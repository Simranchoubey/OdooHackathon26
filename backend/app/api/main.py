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


# =============================================================================
# SCREEN 2: DASHBOARD / HOME SCREEN
# =============================================================================

@app.get("/dashboard/overview", tags=["Screen 2"])
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



# =============================================================================
# Sesssion 3
# =============================================================================

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
@app.get("/admin/departments", response_model=List[DepartmentResponse], tags=["Screen 3"])
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

@app.post("/admin/departments", status_code=201, response_model=DepartmentResponse, tags=["Screen 3"])
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

@app.patch("/admin/departments/{dept_id}", response_model=DepartmentResponse, tags=["Screen 3"])
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
@app.get("/admin/employees", response_model=List[EmployeeResponse], tags=["Screen 3"])
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

@app.patch("/admin/employees/{user_id}/manage", tags=["Screen 3"])
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

# =============================================================================
# SCREEN 4: ASSET REGISTRATION & DIRECTORY 
# =============================================================================

# Pydantic Incoming Request Schema
class AssetCreate(BaseModel):
    name: str
    category_name: str
    serial_number: Optional[str] = None
    acquisition_date: datetime.date
    acquisition_cost: float
    condition_state: Optional[str] = "Good"
    location: str
    is_shared_bookable: Optional[bool] = False
    dynamic_attributes: Optional[Dict[str, Any]] = None

# Pydantic Outgoing Response Schema
class AssetResponse(BaseModel):
    id: int
    asset_tag: str
    name: str
    category_name: str  # Outgoing category text field replacing category_id
    serial_number: Optional[str]
    acquisition_date: datetime.date
    acquisition_cost: float
    condition_state: str
    lifecycle_status: str
    location: str
    is_shared_bookable: bool
    dynamic_attributes: Optional[Dict[str, Any]]

    class Config:
        from_attributes = True


@app.post("/assets", status_code=201, response_model=AssetResponse, tags=["Screen 4"])
def register_asset(asset: AssetCreate, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(models.Category.name == asset.category_name).first()
    if not category:
        raise HTTPException(status_code=404, detail=f"Category '{asset.category_name}' not found.")

    last_asset = db.query(models.Asset).order_by(models.Asset.id.desc()).first()
    next_id = (last_asset.id + 1) if last_asset else 1
    generated_tag = f"AF-{next_id:04d}"

    db_asset = models.Asset(
        asset_tag=generated_tag,
        name=asset.name,
        category_id=category.id,
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
    
    # Manually map to Response Schema to output category name string
    return AssetResponse(
        id=db_asset.id,
        asset_tag=db_asset.asset_tag,
        name=db_asset.name,
        category_name=category.name,
        serial_number=db_asset.serial_number,
        acquisition_date=db_asset.acquisition_date,
        acquisition_cost=db_asset.acquisition_cost,
        condition_state=db_asset.condition_state,
        lifecycle_status=db_asset.lifecycle_status,
        location=db_asset.location,
        is_shared_bookable=db_asset.is_shared_bookable,
        dynamic_attributes=db_asset.dynamic_attributes
    )


@app.get("/assets", response_model=List[AssetResponse], tags=["Screen 4"])
def query_asset_directory(
    search: Optional[str] = None,
    category_name: Optional[str] = None,
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
    if category_name:
        query = query.join(models.Category).filter(models.Category.name == category_name)
    if status:
        query = query.filter(models.Asset.lifecycle_status == status)
    if location:
        query = query.filter(models.Asset.location.like(f"%{location}%"))
        
    assets = query.all()
    
    # Convert active SQLAlchemy model items into formatted response schemas
    response = []
    for a in assets:
        # Resolves category via the `category` relationship setup in models.py
        cat_name = a.category.name if a.category else "Uncategorized"
        
        response.append(AssetResponse(
            id=a.id,
            asset_tag=a.asset_tag,
            name=a.name,
            category_name=cat_name,
            serial_number=a.serial_number,
            acquisition_date=a.acquisition_date,
            acquisition_cost=a.acquisition_cost,
            condition_state=a.condition_state,
            lifecycle_status=a.lifecycle_status,
            location=a.location,
            is_shared_bookable=a.is_shared_bookable,
            dynamic_attributes=a.dynamic_attributes
        ))
        
    return response


@app.get("/assets/history/{asset_name}", tags=["Screen 4"])
def get_asset_history(asset_name: str, db: Session = Depends(get_db)):
    # Look up the target profile using the asset's name column
    asset = db.query(models.Asset).filter(models.Asset.name == asset_name).first()
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Asset profile matching name '{asset_name}' not found"
        )

    allocations = db.query(models.AllocationTransfer).filter(models.AllocationTransfer.asset_id == asset.id).all()
    maintenance = db.query(models.MaintenanceRequest).filter(models.MaintenanceRequest.asset_id == asset.id).all()

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


# =============================================================================
# SCREEN 5: ASSET ALLOCATION & TRANSFER ENGINE WITH AUTO-DETECTION
# =============================================================================

# --- Pydantic Schemas ---

class AssetCheckResponse(BaseModel):
    asset_tag: str
    name: str
    lifecycle_status: str
    is_blocked: bool
    current_holder_name: Optional[str] = None
    current_holder_department: Optional[str] = None
    alert_message: Optional[str] = None

class AllocationSubmitRequest(BaseModel):
    asset_name: str
    target_employee_name: str
    requested_by_name: str
    reason_notes: Optional[str] = None
    expected_return_date: Optional[datetime.date] = None

class HistoricalTimelineItem(BaseModel):
    date: str
    event_text: str

class AllocationSubmitResponse(BaseModel):
    status: str
    transaction_type: str
    message: str
    timeline: List[HistoricalTimelineItem]


# --- API Endpoints ---

@app.get("/allocations/check-asset", response_model=AssetCheckResponse, tags=["Screen 5"])
def check_asset_allocation_state(asset_name: str, db: Session = Depends(get_db)):
    """
    Triggers when the user selects an asset on Screen 5.
    Evaluates allocation status to warn the frontend of a double-allocation state.
    """
    asset = db.query(models.Asset).filter(models.Asset.name == asset_name).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset profile not found.")
    
    is_blocked = False
    current_holder_name = None
    current_holder_department = None
    alert_message = None

    # If already allocated, pull the active tracking record details to populate the red warning banner
    if asset.lifecycle_status == "Allocated":
        is_blocked = True
        active_alloc = db.query(models.AllocationTransfer).filter(
            models.AllocationTransfer.asset_id == asset.id,
            models.AllocationTransfer.status == "Active"
        ).first()
        
        if active_alloc and active_alloc.holder:
            current_holder_name = active_alloc.holder.name
            if active_alloc.holder.department:
                current_holder_department = active_alloc.holder.department.name
            
            alert_message = f"Already Allocated to {current_holder_name} ({current_holder_department or 'No Dept'}). Direct re-allocation is blocked - submit a transfer request below."
            
    elif asset.lifecycle_status in ["Under Maintenance", "Lost", "Retired", "Disposed"]:
        is_blocked = True
        alert_message = f"Asset is currently locked under state: {asset.lifecycle_status}. Allocation operations are completely unavailable."

    return AssetCheckResponse(
        asset_tag=asset.asset_tag,
        name=asset.name,
        lifecycle_status=asset.lifecycle_status,
        is_blocked=is_blocked,
        current_holder_name=current_holder_name,
        current_holder_department=current_holder_department,
        alert_message=alert_message
    )


@app.post("/allocations/allocate", status_code=201, tags=["Screen 5"], response_model=AllocationSubmitResponse)
def submit_allocation_or_transfer(req: AllocationSubmitRequest, db: Session = Depends(get_db)):
    """
    Processes the request submission.
    Creates an Active Allocation or a Pending_Approval Transfer depending on current state.
    """
    # 1. Resolve domain models
    asset = db.query(models.Asset).filter(models.Asset.name == req.asset_name).first()
    target_user = db.query(models.User).filter(models.User.name == req.target_employee_name).first()
    requester = db.query(models.User).filter(models.User.name == req.requested_by_name).first()

    if not asset or not target_user or not requester:
        raise HTTPException(status_code=404, detail="One or more target entities could not be resolved from values.")

    # 2. Process Business Rules Based on Lifecycle State
    if asset.lifecycle_status == "Allocated":
        transaction_type = "Transfer"
        execution_status = "Pending_Approval"
        msg = f"Direct allocation blocked. Transfer request safely submitted for approval to move asset to {target_user.name}."
        
        # Pull current active holder context to keep historical ledger link intact
        active_alloc = db.query(models.AllocationTransfer).filter(
            models.AllocationTransfer.asset_id == asset.id, models.AllocationTransfer.status == "Active"
        ).first()
        current_holder_id = active_alloc.current_holder_id if active_alloc else None

    elif asset.lifecycle_status == "Available":
        transaction_type = "Allocation"
        execution_status = "Active"
        msg = f"Successfully allocated {asset.asset_tag} directly to {target_user.name}."
        current_holder_id = target_user.id
        
        # Lock asset down immediately
        asset.lifecycle_status = "Allocated"
    else:
        raise HTTPException(status_code=400, detail=f"Cannot allocate asset with current state: {asset.lifecycle_status}")

    # 3. Commit the ledger transaction record
    new_tx = models.AllocationTransfer(
        asset_id=asset.id,
        current_holder_id=current_holder_id,
        target_department_id=target_user.department_id if transaction_type == "Transfer" else None,
        requested_by_id=requester.id,
        expected_return_date=req.expected_return_date,
        type=transaction_type,
        status=execution_status,
        checkin_notes=req.reason_notes
    )
    db.add(new_tx)
    db.commit()

    # 4. Compile Consolidated UI Feed Timeline History Array (Sorted Newest First)
    all_history = db.query(models.AllocationTransfer).filter(
        models.AllocationTransfer.asset_id == asset.id
    ).order_by(models.AllocationTransfer.created_at.desc()).all()

    timeline_feed = []
    for log in all_history:
        date_str = log.created_at.strftime("%b %d")
        holder_lbl = log.holder.name if log.holder else "Unassigned Space"
        
        if log.type == "Allocation" and log.status == "Active":
            text = f"Allocated to {holder_lbl}"
            if log.holder and log.holder.department:
                text += f" - {log.holder.department.name}"
        elif log.type == "Transfer" and log.status == "Pending_Approval":
            text = f"Transfer Request Pending to target department"
        else:
            text = f"Returned / State change entry recorded (Notes: {log.checkin_notes or 'none'})"
            
        timeline_feed.append(HistoricalTimelineItem(date=date_str, event_text=text))

    return AllocationSubmitResponse(
        status="Success",
        transaction_type=transaction_type,
        message=msg,
        timeline=timeline_feed
    )


# =============================================================================
# SCREEN 6: RESOURCE BOOKING & TIME-SLOT RESOLVER
# =============================================================================

class BookingItemResponse(BaseModel):
    booking_id: int
    user_name: str
    start_time: str
    end_time: str
    status: str
    display_text: str

class ResourceScheduleResponse(BaseModel):
    asset_name: str
    asset_tag: str
    date: str
    bookings: List[BookingItemResponse]

class ReserveSlotRequest(BaseModel):
    asset_name: str
    user_name: str
    date: datetime.date  # e.g., "2026-07-12"
    start_hour: int      # e.g., 9 for 09:00
    end_hour: int        # e.g., 10 for 10:00


@app.get("/bookings/schedule", response_model=ResourceScheduleResponse, tags=["Screen 6"])
def get_resource_schedule(asset_name: str, target_date: datetime.date, db: Session = Depends(get_db)):
    """
    Fetches all bookings for a shared asset on a specific date to build the UI calendar view.
    """
    asset = db.query(models.Asset).filter(models.Asset.name == asset_name, models.Asset.is_shared_bookable == True).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Shared bookable resource profile not found.")

    start_of_day = datetime.datetime.combine(target_date, datetime.time.min)
    end_of_day = datetime.datetime.combine(target_date, datetime.time.max)

    bookings = db.query(models.ResourceBooking).filter(
        models.ResourceBooking.asset_id == asset.id,
        models.ResourceBooking.start_time >= start_of_day,
        models.ResourceBooking.end_time <= end_of_day,
        models.ResourceBooking.status != "Cancelled"
    ).order_by(models.ResourceBooking.start_time.asc()).all()

    booking_list = []
    for bk in bookings:
        user_name = bk.user.name if bk.user else "Unknown User"
        s_str = bk.start_time.strftime("%H:%M")
        e_str = bk.end_time.strftime("%H:%M")
        
        # Cross-platform safe integer extraction for clean human-readable hours
        start_hour = bk.start_time.hour if bk.start_time.hour <= 12 else bk.start_time.hour - 12
        start_hour = 12 if start_hour == 0 else start_hour
        
        end_hour = bk.end_time.hour if bk.end_time.hour <= 12 else bk.end_time.hour - 12
        end_hour = 12 if end_hour == 0 else end_hour
        end_period = bk.end_time.strftime('%p')
        
        booking_list.append(BookingItemResponse(
            booking_id=bk.id,
            user_name=user_name,
            start_time=s_str,
            end_time=e_str,
            status=bk.status,
            display_text=f"Booked - {user_name} - {start_hour} to {end_hour} {end_period}"
        ))

    return ResourceScheduleResponse(
        asset_name=asset.name,
        asset_tag=asset.asset_tag,
        date=target_date.strftime("%a, %d %b"),
        bookings=booking_list
    )


@app.post("/bookings/reserve", status_code=201, tags=["Screen 6"])
def reserve_resource_timeslot(req: ReserveSlotRequest, db: Session = Depends(get_db)):
    """
    Validates boundary constraints to prevent overlapping time slot scheduling entries.
    """
    asset = db.query(models.Asset).filter(models.Asset.name == req.asset_name, models.Asset.is_shared_bookable == True).first()
    user = db.query(models.User).filter(models.User.name == req.user_name).first()

    if not asset or not user:
        raise HTTPException(status_code=404, detail="Target shared resource or user identity could not be resolved.")

    # Guard check: Ensure asset is not out under structural repair
    if asset.lifecycle_status == "Under Maintenance":
        raise HTTPException(status_code=400, detail="Resource is under maintenance and completely unavailable for booking.")

    # Construct explicit datetime objects
    proposed_start = datetime.datetime.combine(req.date, datetime.time(req.start_hour, 0, 0))
    proposed_end = datetime.datetime.combine(req.date, datetime.time(req.end_hour, 0, 0))

    if proposed_start >= proposed_end:
        raise HTTPException(status_code=400, detail="Invalid duration window configuration parameters provided.")

    # Core Overlap Query Constraint Engine logic: (StartA < EndB) AND (EndA > StartB)
    overlap_conflict = db.query(models.ResourceBooking).filter(
        models.ResourceBooking.asset_id == asset.id,
        models.ResourceBooking.status != "Cancelled",
        models.ResourceBooking.start_time < proposed_end,
        models.ResourceBooking.end_time > proposed_start
    ).first()

    if overlap_conflict:
        conflict_user = overlap_conflict.user.name if overlap_conflict.user else "Another Team"
        raise HTTPException(
            status_code=409,
            detail=f"Requested {req.start_hour}:00 to {req.end_hour}:00 - conflict - slot is unavailable (Reserved by {conflict_user})."
        )

    # Success: Save booking reservation ledger entry record
    new_booking = models.ResourceBooking(
        asset_id=asset.id,
        user_id=user.id,
        start_time=proposed_start,
        end_time=proposed_end,
        status="Upcoming"
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    return {
        "status": "Success",
        "message": f"Slot successfully reserved for {asset.name} from {req.start_hour}:00 to {req.end_hour}:00.",
        "booking_id": new_booking.id
    }


# =============================================================================
# SCREEN 7: MAINTENANCE KANBAN MANAGEMENT ENGINE
# =============================================================================

# --- Pydantic Schemas ---

class MaintenanceCardResponse(BaseModel):
    request_id: int
    asset_tag: str
    asset_name: str
    description: str
    priority: str
    status: str
    assigned_technician_name: Optional[str] = None
    resolution_notes: Optional[str] = None
    date_label: str

class KanbanBoardResponse(BaseModel):
    pending: List[MaintenanceCardResponse]
    approved: List[MaintenanceCardResponse]
    technician_assigned: List[MaintenanceCardResponse]
    in_progress: List[MaintenanceCardResponse]
    resolved: List[MaintenanceCardResponse]

class MaintenanceTransitionRequest(BaseModel):
    target_status: str  # 'Pending', 'Approved', 'In_Progress', 'Resolved'
    technician_name: Optional[str] = None
    resolution_notes: Optional[str] = None


# --- API Endpoints ---

@app.get("/maintenance/kanban", response_model=KanbanBoardResponse, tags=["Screen 7"])
def get_maintenance_kanban_board(db: Session = Depends(get_db)):
    """
    Fetches and categorizes all maintenance requests into specific Kanban columns.
    """
    requests = db.query(models.MaintenanceRequest).order_by(models.MaintenanceRequest.created_at.desc()).all()

    board = {
        "pending": [],
        "approved": [],
        "technician_assigned": [],
        "in_progress": [],
        "resolved": []
    }

    for r in requests:
        tech_name = db.query(models.User).filter(models.User.id == r.assigned_technician_id).first().name if r.assigned_technician_id else None
        date_lbl = r.created_at.strftime("%d %b")

        card = MaintenanceCardResponse(
            request_id=r.id,
            asset_tag=r.asset.asset_tag,
            asset_name=r.asset.name,
            description=r.description,
            priority=r.priority,
            status=r.status,
            assigned_technician_name=tech_name,
            resolution_notes=r.resolution_notes,
            date_label=f"resolved {date_lbl}" if r.status == "Resolved" else date_lbl
        )

        # Distribute into matching columns based on status and technician assignment
        if r.status == "Pending":
            board["pending"].append(card)
        elif r.status == "Approved" and not r.assigned_technician_id:
            board["approved"].append(card)
        elif r.status == "Approved" and r.assigned_technician_id:
            board["technician_assigned"].append(card)
        elif r.status == "In_Progress":
            board["in_progress"].append(card)
        elif r.status == "Resolved":
            board["resolved"].append(card)

    return board


@app.patch("/maintenance/{request_id}/transition", status_code=200, tags=["Screen 7"])
def transition_maintenance_kanban_card(request_id: int, req: MaintenanceTransitionRequest, db: Session = Depends(get_db)):
    """
    Handles moving cards between columns and automatically mutates the asset lifecycle state.
    """
    allowed_statuses = ['Pending', 'Approved', 'In_Progress', 'Resolved', 'Rejected']
    if req.target_status not in allowed_statuses:
        raise HTTPException(status_code=400, detail="Invalid Kanban status target column.")

    maint_req = db.query(models.MaintenanceRequest).filter(models.MaintenanceRequest.id == request_id).first()
    if not maint_req:
        raise HTTPException(status_code=404, detail="Maintenance ticket not found.")

    asset = maint_req.asset

    # 1. Resolve technician assignment if name is supplied
    if req.technician_name:
        tech_user = db.query(models.User).filter(models.User.name == req.technician_name).first()
        if not tech_user:
            raise HTTPException(status_code=404, detail=f"Technician '{req.technician_name}' not found.")
        maint_req.assigned_technician_id = tech_user.id

    # 2. Mutate Statuses & Apply Lifecycle Locks
    maint_req.status = req.target_status
    
    if req.target_status in ["Approved", "In_Progress"]:
        # Lock down the asset immediately
        asset.lifecycle_status = "Under Maintenance"
        msg = f"Ticket status set to {req.target_status}. Asset {asset.asset_tag} locked under maintenance state."
        
    elif req.target_status == "Resolved":
        # Release the asset back to the pool
        asset.lifecycle_status = "Available"
        if req.resolution_notes:
            maint_req.resolution_notes = req.resolution_notes
        msg = f"Ticket successfully resolved. Asset {asset.asset_tag} is now Available."
        
    else:
        # If explicitly set back to Pending, reset asset state if it was locked
        asset.lifecycle_status = "Available"
        msg = f"Ticket returned to Pending list."

    db.commit()
    return {"status": "Success", "message": msg, "current_asset_lifecycle": asset.lifecycle_status}


@app.post("/allocations/allocate_", tags=["Placeholder Router"])
def screen_5_allocation_engine():
    """
    [SCREEN 5 ROUTER]: Allocation & Handoff Core.
    - Validates asset operational states to avoid double-allocation issues.
    - Triggers contextual data updates when routing cross-department Transfer Requests.
    """
    return {"status": "Router Blueprint Ready", "scope": ["Conflict Handling", "Transfer Requests", "Check-in Notes"]}


@app.post("/bookings/reserve_", tags=["Placeholder Router"])
def screen_6_resource_booking():
    """
    [SCREEN 6 ROUTER]: Time-Slot Conflict Resolver.
    - Enforces precision boundary checks on shared assets (Rooms, Vehicles).
    - Uses overlapping validation queries: (StartA < EndB) AND (EndA > StartB).
    """
    return {"status": "Router Blueprint Ready", "scope": ["Calendar Feeds", "Overlap Validation", "Cancellations"]}


@app.patch("/maintenance/{request_id}/transition_", tags=["Placeholder Router"])
def screen_7_maintenance_kanban():
    """
    [SCREEN 7 ROUTER]: Multi-tier Maintenance Status Router.
    - Handles status workflows: Pending -> Approved -> In Progress -> Resolved.
    - Automatically flips asset states into 'Under Maintenance' and restores them to 'Available' upon fix.
    """
    return {"status": "Router Blueprint Ready", "scope": ["Raise Issue", "Approval Workflows", "Technician Assignment"]}


@app.get("/audits_", tags=["Placeholder Router"])
def screen_8_structured_audits():
    """
    [SCREEN 8 ROUTER]: Internal Audit Verification Tracker.
    - Launches dedicated cycle contexts bound to department locations.
    - Allows marking checklists: Verified, Missing, or Damaged.
    - Auto-generates discrepancy reports and automatically marks missing assets as 'Lost' on cycle close.
    """
    return {"status": "Router Blueprint Ready", "scope": ["Create Cycle", "Discrepancy Reporting", "Status Locking"]}


@app.get("/analytics_", tags=["Placeholder Router"])
def screen_9_and_10_analytics_and_logs():
    """
    [SCREEN 9 & 10 ROUTER]: Intelligence Reporting & Auditable Activity Logging.
    - Compiles allocation summary matrices and usage heatmaps.
    - Maintains historic activity logs (Who did what, and when) across all operational modules.
    """
    return {"status": "Router Blueprint Ready", "scope": ["Utilization Heatmaps", "System Logs", "Alert Triggers"]}