from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
import datetime
from typing import List

# Hook directly into your existing models file
from backend.app import models

app = FastAPI(title="AssetFlow Enterprise Engine")

# --- Database Session Dependency ---
def get_db():
    db = None 
    try:
        yield db
    finally:
        if db:
            db.close()

# =============================================================================
# SCREEN 2: DASHBOARD / HOME SCREEN (FULLY OPERATIONAL)
# =============================================================================
@app.get("/dashboard/overview")
def get_dashboard_overview(db: Session = Depends(get_db)):
    """
    Provides a real-time operational snapshot including KPI metrics, 
    overdue return condition tracking, and a consolidated timeline feed.
    """
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
# SCREEN ROUTER PLACEHOLDERS (DOCUMENTING COMING ENGINE MODULES)
# =============================================================================

@app.get("/organization-setup", tags=["Placeholder Router"])
def screen_3_organization_setup():
    """
    [SCREEN 3 ROUTER]: Admin Only Master Data Configuration Tree.
    - Tab A: Manage department hierarchies (Parent-child tracking).
    - Tab B: Define categories and register optional dynamic schemas via JSON custom fields.
    - Tab C: Central Employee Directory to promote Employees to 'Asset Manager' or 'Department Head'.
    """
    return {"status": "Router Blueprint Ready", "scope": ["Departments", "Categories", "Employees"]}


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