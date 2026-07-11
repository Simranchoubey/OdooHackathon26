from sqlalchemy.orm import relationship, backref
import datetime
from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime, Numeric, Boolean, Date, JSON, Text

from backend.app.database import Base

class Department(Base):
    __tablename__ = 'departments'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)
    parent_id = Column(Integer, ForeignKey('departments.id'), nullable=True)
    head_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    status = Column(Enum('Active', 'Inactive'), default='Active')
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    sub_departments = relationship(
        "Department",
        backref=backref("parent", remote_side=[id])
    )
    employees = relationship("User", foreign_keys="User.department_id", back_populates="department")

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum('Admin', 'Asset Manager', 'Department Head', 'Employee'), default='Employee')
    department_id = Column(Integer, ForeignKey('departments.id'), nullable=True)
    status = Column(Enum('Active', 'Inactive'), default='Active')
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    department = relationship("Department", foreign_keys=[department_id], back_populates="employees")


class Category(Base):
    __tablename__ = 'categories'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)
    custom_fields = Column(JSON, nullable=True)

class Asset(Base):
    __tablename__ = 'assets'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    asset_tag = Column(String(50), nullable=False, unique=True)
    name = Column(String(150), nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False)
    serial_number = Column(String(100), nullable=True)
    acquisition_date = Column(Date, nullable=False)
    acquisition_cost = Column(Numeric(12, 2), nullable=False)
    condition_state = Column(Enum('New', 'Good', 'Fair', 'Poor', 'Damaged'), default='Good')
    lifecycle_status = Column(Enum('Available', 'Allocated', 'Reserved', 'Under Maintenance', 'Lost', 'Retired', 'Disposed'), default='Available')
    location = Column(String(150), nullable=False)
    is_shared_bookable = Column(Boolean, default=False)
    dynamic_attributes = Column(JSON, nullable=True)
    
    category = relationship("Category")



# (Include Phase 1 & 2 definitions: Department, User, Category, Asset here)

class AllocationTransfer(Base):
    __tablename__ = 'allocations_transfers'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    asset_id = Column(Integer, ForeignKey('assets.id'), nullable=False)
    current_holder_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    target_department_id = Column(Integer, ForeignKey('departments.id'), nullable=True)
    requested_by_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    assigned_by_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    expected_return_date = Column(Date, nullable=True)
    actual_return_date = Column(Date, nullable=True)
    type = Column(Enum('Allocation', 'Transfer'), default='Allocation')
    status = Column(Enum('Pending_Approval', 'Approved', 'Rejected', 'Active', 'Returned'), default='Active')
    checkin_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    asset = relationship("Asset")
    holder = relationship("User", foreign_keys=[current_holder_id])


class ResourceBooking(Base):
    __tablename__ = 'resource_bookings'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    asset_id = Column(Integer, ForeignKey('assets.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    status = Column(Enum('Upcoming', 'Ongoing', 'Completed', 'Cancelled'), default='Upcoming')
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    asset = relationship("Asset")
    user = relationship("User")


class MaintenanceRequest(Base):
    __tablename__ = 'maintenance_requests'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    asset_id = Column(Integer, ForeignKey('assets.id'), nullable=False)
    reported_by_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    assigned_technician_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    description = Column(Text, nullable=False)
    priority = Column(Enum('Low', 'Medium', 'High', 'Critical'), default='Medium')
    status = Column(Enum('Pending', 'Approved', 'Rejected', 'In_Progress', 'Resolved'), default='Pending')
    resolution_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    asset = relationship("Asset")


class AuditCycle(Base):
    __tablename__ = 'audit_cycles'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(150), nullable=False)
    scope_department_id = Column(Integer, ForeignKey('departments.id'), nullable=True)
    scope_location = Column(String(150), nullable=True)
    status = Column(Enum('Draft', 'Active', 'Closed'), default='Draft')
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AuditItem(Base):
    __tablename__ = 'audit_items'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    audit_cycle_id = Column(Integer, ForeignKey('audit_cycles.id'), nullable=False)
    asset_id = Column(Integer, ForeignKey('assets.id'), nullable=False)
    auditor_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    verification_state = Column(Enum('Pending', 'Verified', 'Missing', 'Damaged'), default='Pending')
    notes = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    asset = relationship("Asset")


class SystemLog(Base):
    __tablename__ = 'system_logs'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    message = Column(String(255), nullable=False)
    category = Column(Enum('Alert', 'Approval', 'Booking', 'General'), default='General')
    created_at = Column(DateTime, default=datetime.datetime.utcnow)