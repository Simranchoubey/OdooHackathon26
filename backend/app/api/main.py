from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

from backend.app import models
from backend.app.database import SessionLocal

app = FastAPI(title="AssetFlow Enterprise Engine")

# --- Database Session Dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# SCREEN 2: DASHBOARD / HOME SCREEN

@app.get("/dashboard/overview")
def get_dashboard_overview(db: Session = Depends(get_db)):

    current_time = datetime.datetime.utcnow()
    current_date = datetime.date.today()

    # 1. Fetch KPI Structural Summaries
    assets_available = db.query(func.count(models.Asset.id)).filter(models.Asset.lifecycle_status == "Available").scalar() or 0
    assets_allocated = db.query(func.count(models.Asset.id)).filter(models.Asset.lifecycle_status == "Allocated").scalar() or 0
    maintenance_today = db.query(func.count(models.Asset.id)).filter(models.Asset.lifecycle_status == "Under Maintenance").scalar() or 0
    active_bookings = db.query(func.count(models.ResourceBooking.id)).filter(
        models.ResourceBooking.status == "Upcoming", 
        models.ResourceBooking.end_time > current_time
    ).scalar() or 0
    pending_transfers = db.query(func.count(models.AllocationTransfer.id)).filter(
        models.AllocationTransfer.type == "Transfer", 
        models.AllocationTransfer.status == "Pending_Approval"
    ).scalar() or 0
    upcoming_returns = db.query(func.count(models.AllocationTransfer.id)).filter(
        models.AllocationTransfer.status == "Active",
        models.AllocationTransfer.expected_return_date >= current_date
    ).scalar() or 0

    # 2. Critical Alert Engine: Flag assets past Expected Return Date
    overdue_count = db.query(func.count(models.AllocationTransfer.id)).filter(
        models.AllocationTransfer.status == "Active",
        models.AllocationTransfer.expected_return_date < current_date
    ).scalar() or 0

    # 3. Compile Unified Recent Timeline Feed
    timeline = []
    
    # Check Allocations & Handoffs
    recent_allocs = db.query(models.AllocationTransfer).order_by(models.AllocationTransfer.created_at.desc()).limit(3).all()
    for item in recent_allocs:
        holder = item.holder.name if item.holder else "Department Space"
        msg = f"Laptop {item.asset.asset_tag} - allocated to {holder}" if item.type == 'Allocation' else f"Asset {item.asset.asset_tag} - transfer {item.status.lower()}"
        timeline.append({"text": msg, "time": item.created_at})

    # Check Shared Bookings
    recent_books = db.query(models.ResourceBooking).order_by(models.ResourceBooking.created_at.desc()).limit(2).all()
    for bk in recent_books:
        timeline.append({
            "text": f"{bk.asset.name} - booking confirmed - {bk.start_time.strftime('%I:%M %p')} to {bk.end_time.strftime('%I:%M %p')}",
            "time": bk.created_at
        })

    # Check Maintenance Movements
    recent_maint = db.query(models.MaintenanceRequest).order_by(models.MaintenanceRequest.created_at.desc()).limit(2).all()
    for mt in recent_maint:
        timeline.append({
            "text": f"Projector {mt.asset.asset_tag} - maintenance {mt.status.lower()}",
            "time": mt.created_at
        })

    # Sort consolidated pipeline chronologically (Newest first)
    timeline = sorted(timeline, key=lambda x: x["time"], reverse=True)[:5]

    return {
        "kpis": {
            "available": assets_available,
            "allocated": assets_allocated,
            "maintenance_today": maintenance_today,
            "active_bookings": active_bookings,
            "pending_transfers": pending_transfers,
            "upcoming_returns": upcoming_returns
        },
        "overdue_alert": f"{overdue_count} assets overdue for return - flagged for follow-up" if overdue_count > 0 else None,
        "recent_activity": [t["text"] for t in timeline]
    }


# SCREEN ROUTER PLACEHOLDERS


# Sesssion 3

# Pydantic Schemas
class DepartmentRequest(BaseModel):
    name: str = Field(..., example="Sports")
    parent_department_name: Optional[str] = Field(None, example="Facilities")
    head_employee_name: Optional[str] = Field(None, example="Arjun Varma")
    status: Optional[str] = "Active"

class EmployeeResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    department_name: Optional[str]
    status: str

    class Config:
        from_attributes = True

class DepartmentResponse(BaseModel):
    id: int
    name: str
    parent_department_name: Optional[str]
    head_employee_name: Optional[str]
    status: str

    class Config:
        from_attributes = True


# --- TAB A: Department Management ---
@app.get("/admin/departments", response_model=List[DepartmentResponse])
def list_departments(db: Session = Depends(get_db)):
    departments = db.query(models.Department).all()
    
    response = []
    for dept in departments:
        # Resolve parent department name safely
        parent_name = None
        if dept.parent_id:
            parent_dept = db.query(models.Department).filter(models.Department.id == dept.parent_id).first()
            parent_name = parent_dept.name if parent_dept else None
            
        # Resolve head employee name safely
        head_name = None
        if dept.head_id:
            head_user = db.query(models.User).filter(models.User.id == dept.head_id).first()
            head_name = head_user.name if head_user else None
            
        response.append(DepartmentResponse(
            id=dept.id,
            name=dept.name,
            parent_department_name=parent_name,
            head_employee_name=head_name,
            status=dept.status
        ))
    return response

@app.post("/admin/departments", status_code=201, response_model=DepartmentResponse)
def create_department(dept: DepartmentRequest, db: Session = Depends(get_db)):
    # 1. Check if department name already exists to prevent duplicate failures
    existing_dept = db.query(models.Department).filter(models.Department.name == dept.name).first()
    if existing_dept:
        raise HTTPException(status_code=400, detail=f"Department '{dept.name}' already exists.")

    # 2. Map Parent Department Name to internal ID
    parent_id = None
    if dept.parent_department_name:
        parent = db.query(models.Department).filter(models.Department.name == dept.parent_department_name).first()
        if not parent:
            raise HTTPException(status_code=404, detail=f"Parent department '{dept.parent_department_name}' not found.")
        parent_id = parent.id

    # 3. Map Head Employee Name to internal ID
    head_id = None
    if dept.head_employee_name:
        head = db.query(models.User).filter(models.User.name == dept.head_employee_name).first()
        if not head:
            raise HTTPException(status_code=404, detail=f"Employee '{dept.head_employee_name}' not found to assign as Head.")
        head_id = head.id

    db_dept = models.Department(
        name=dept.name,
        parent_id=parent_id,
        head_id=head_id,
        status=dept.status
    )
    db.add(db_dept)
    db.commit()
    db.refresh(db_dept)
    
    return DepartmentResponse(
        id=db_dept.id,
        name=db_dept.name,
        parent_department_name=dept.parent_department_name,
        head_employee_name=dept.head_employee_name,
        status=db_dept.status
    )

@app.patch("/admin/departments/{dept_id}", response_model=DepartmentResponse)
def update_department(dept_id: int, dept_data: DepartmentRequest, db: Session = Depends(get_db)):
    dept = db.query(models.Department).filter(models.Department.id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Target department not found")
    
    # Internal Resolution Strategy for modifications
    parent_id = None
    if dept_data.parent_department_name:
        parent = db.query(models.Department).filter(models.Department.name == dept_data.parent_department_name).first()
        if not parent:
            raise HTTPException(status_code=404, detail=f"Parent department '{dept_data.parent_department_name}' not found.")
        parent_id = parent.id

    head_id = None
    if dept_data.head_employee_name:
        head = db.query(models.User).filter(models.User.name == dept_data.head_employee_name).first()
        if not head:
            raise HTTPException(status_code=404, detail=f"Employee '{dept_data.head_employee_name}' not found.")
        head_id = head.id

    dept.name = dept_data.name
    dept.parent_id = parent_id
    dept.head_id = head_id
    dept.status = dept_data.status
    
    db.commit()
    
    return DepartmentResponse(
        id=dept.id,
        name=dept.name,
        parent_department_name=dept_data.parent_department_name,
        head_employee_name=dept_data.head_employee_name,
        status=dept.status
    )

# --- TAB C: Employee Directory ---
@app.get("/admin/employees", response_model=List[EmployeeResponse])
def list_employees(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    
    response = []
    for user in users:
        dept_name = None
        if user.department_id:
            dept = db.query(models.Department).filter(models.Department.id == user.department_id).first()
            dept_name = dept.name if dept else None
            
        response.append(EmployeeResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            role=user.role,
            department_name=dept_name,
            status=user.status
        ))
    return response

@app.patch("/admin/employees/{user_id}/manage")
def manage_employee(user_id: int, role: str, department_name: Optional[str] = None, status: str = "Active", db: Session = Depends(get_db)):
    if role not in ['Admin', 'Asset Manager', 'Department Head', 'Employee']:
        raise HTTPException(status_code=400, detail="Invalid role assignment execution template.")
        
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Employee not located in master directories.")
        
    user.role = role
    user.status = status
    
    if department_name:
        dept = db.query(models.Department).filter(models.Department.name == department_name).first()
        if not dept:
            raise HTTPException(status_code=404, detail=f"Department '{department_name}' does not exist.")
        user.department_id = dept.id
        
    db.commit()
    return {"message": f"Successfully updated profile for {user.name}"}

"""
# =============================================================================
# SCREEN 4: ASSET REGISTRATION & DIRECTORY (FULLY OPERATIONAL)
# =============================================================================

@app.post("/assets", status_code=201)
def register_asset(asset: AssetCreate, db: Session = Depends(get_db)):
    # Sequential Asset Tag Generation Auto Engine (e.g., AF-0008)
    last_asset = db.query(models.Asset).order_by(models.Asset.id.desc()).first()
    next_id = (last_asset.id + 1) if last_asset else 1
    generated_tag = f"AF-{next_id:04d}"

    db_asset = models.Asset(
        asset_tag=generated_tag,
        name=asset.name,
        category_id=asset.category_id,
        serial_number=asset.serial_number,
        acquisition_date=asset.acquisition_date,
        acquisition_cost=asset.acquisition_cost,
        condition_state=asset.condition_state,
        lifecycle_status="Available",
        location=asset.location,
        is_shared_bookable=asset.is_shared_bookable,
        dynamic_attributes=asset.dynamic_attributes or {}
    )
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

@app.get("/assets")
def query_asset_directory(
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    status: Optional[str] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Asset)
    
    if search:
        query = query.filter(
            or_(
                models.Asset.asset_tag.like(f"%{search}%"),
                models.Asset.name.like(f"%{search}%"),
                models.Asset.serial_number.like(f"%{search}%")
            )
        )
    if category_id:
        query = query.filter(models.Asset.category_id == category_id)
    if status:
        query = query.filter(models.Asset.lifecycle_status == status)
    if location:
        query = query.filter(models.Asset.location.like(f"%{location}%"))
        
    return query.all()

@app.get("/assets/{asset_id}/history")
def get_asset_history(asset_id: int, db: Session = Depends(get_db)):
    asset = db.query(models.Asset).filter(models.Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset profile not found")

    allocations = db.query(models.AllocationTransfer).filter(models.AllocationTransfer.asset_id == asset_id).all()
    maintenance = db.query(models.MaintenanceRequest).filter(models.MaintenanceRequest.asset_id == asset_id).all()

    return {
        "asset_tag": asset.asset_tag,
        "name": asset.name,
        "allocation_history": [
            {
                "id": a.id,
                "type": a.type,
                "status": a.status,
                "expected_return": a.expected_return_date,
                "created_at": a.created_at
            } for a in allocations
        ],
        "maintenance_history": [
            {
                "id": m.id,
                "description": m.description,
                "priority": m.priority,
                "status": m.status,
                "created_at": m.created_at
            } for m in maintenance
        ]
    }

"""


@app.get("/asset-directory", tags=["Placeholder Router"])
def screen_4_asset_registration():
    """
    [SCREEN 4 ROUTER]: Asset Repository Registry.
    - Generates unique tracking profiles (e.g., AF-0001).
    - Stores acquisition records, condition values, and allows toggling the 'is_shared_bookable' visibility flag.
    - Surfaces historical asset lifecycle paths (Available, Allocated, Reserved, Under Maintenance, etc.).
    """
    return {"status": "Router Blueprint Ready", "scope": ["Register Asset", "Search & Filter", "Lifecycle History"]}


@app.post("/allocations/allocate", tags=["Placeholder Router"])
def screen_5_allocation_engine():
    """
    [SCREEN 5 ROUTER]: Allocation & Handoff Core.
    - Validates asset operational states to avoid double-allocation issues.
    - Triggers contextual data updates when routing cross-department Transfer Requests.
    """
    return {"status": "Router Blueprint Ready", "scope": ["Conflict Handling", "Transfer Requests", "Check-in Notes"]}


@app.post("/bookings/reserve", tags=["Placeholder Router"])
def screen_6_resource_booking():
    """
    [SCREEN 6 ROUTER]: Time-Slot Conflict Resolver.
    - Enforces precision boundary checks on shared assets (Rooms, Vehicles).
    - Uses overlapping validation queries: (StartA < EndB) AND (EndA > StartB).
    """
    return {"status": "Router Blueprint Ready", "scope": ["Calendar Feeds", "Overlap Validation", "Cancellations"]}


@app.patch("/maintenance/{request_id}/transition", tags=["Placeholder Router"])
def screen_7_maintenance_kanban():
    """
    [SCREEN 7 ROUTER]: Multi-tier Maintenance Status Router.
    - Handles status workflows: Pending -> Approved -> In Progress -> Resolved.
    - Automatically flips asset states into 'Under Maintenance' and restores them to 'Available' upon fix.
    """
    return {"status": "Router Blueprint Ready", "scope": ["Raise Issue", "Approval Workflows", "Technician Assignment"]}


@app.get("/audits", tags=["Placeholder Router"])
def screen_8_structured_audits():
    """
    [SCREEN 8 ROUTER]: Internal Audit Verification Tracker.
    - Launches dedicated cycle contexts bound to department locations.
    - Allows marking checklists: Verified, Missing, or Damaged.
    - Auto-generates discrepancy reports and automatically marks missing assets as 'Lost' on cycle close.
    """
    return {"status": "Router Blueprint Ready", "scope": ["Create Cycle", "Discrepancy Reporting", "Status Locking"]}


@app.get("/analytics", tags=["Placeholder Router"])
def screen_9_and_10_analytics_and_logs():
    """
    [SCREEN 9 & 10 ROUTER]: Intelligence Reporting & Auditable Activity Logging.
    - Compiles allocation summary matrices and usage heatmaps.
    - Maintains historic activity logs (Who did what, and when) across all operational modules.
    """
    return {"status": "Router Blueprint Ready", "scope": ["Utilization Heatmaps", "System Logs", "Alert Triggers"]}