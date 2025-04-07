from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from app.database.database import get_db
from app.schemas.staff import (
    StaffCreate, StaffUpdate, StaffResponse,
    ScheduleCreate, ScheduleUpdate, ScheduleResponse,
    TimeLogCreate, TimeLogUpdate, TimeLogResponse
)
from app.models.staff import Staff, Schedule, TimeLog
from app.models.user import User
from app.auth.jwt import get_current_active_user, get_manager_user

router = APIRouter(
    prefix="/staff",
    tags=["Staff"]
)

@router.post("", response_model=StaffResponse)
def create_staff(
    staff: StaffCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    user = db.query(User).filter(User.id == staff.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    existing_staff = db.query(Staff).filter(Staff.user_id == staff.user_id).first()
    if existing_staff:
        raise HTTPException(status_code=400, detail="Staff profile already exists for this user")
    
    db_staff = Staff(**staff.dict())
    db.add(db_staff)
    db.commit()
    db.refresh(db_staff)
    return db_staff

@router.get("", response_model=List[StaffResponse])
def read_staff(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    staff = db.query(Staff).offset(skip).limit(limit).all()
    return staff

@router.get("/{staff_id}", response_model=StaffResponse)
def read_staff_by_id(
    staff_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if db_staff is None:
        raise HTTPException(status_code=404, detail="Staff not found")
    return db_staff

@router.put("/{staff_id}", response_model=StaffResponse)
def update_staff(
    staff_id: int,
    staff: StaffUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if db_staff is None:
        raise HTTPException(status_code=404, detail="Staff not found")
    
    for key, value in staff.dict(exclude_unset=True).items():
        setattr(db_staff, key, value)
    
    db.commit()
    db.refresh(db_staff)
    return db_staff

@router.delete("/{staff_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_staff(
    staff_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if db_staff is None:
        raise HTTPException(status_code=404, detail="Staff not found")
    
    db.delete(db_staff)
    db.commit()
    return None

@router.post("/schedules", response_model=ScheduleResponse)
def create_schedule(
    schedule: ScheduleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    staff = db.query(Staff).filter(Staff.id == schedule.staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    
    db_schedule = Schedule(**schedule.dict())
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

@router.get("/schedules", response_model=List[ScheduleResponse])
def read_schedules(
    staff_id: Optional[int] = None,
    day_of_week: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(Schedule)
    
    if staff_id:
        query = query.filter(Schedule.staff_id == staff_id)
    
    if day_of_week:
        query = query.filter(Schedule.day_of_week == day_of_week)
    
    schedules = query.all()
    return schedules

@router.put("/schedules/{schedule_id}", response_model=ScheduleResponse)
def update_schedule(
    schedule_id: int,
    schedule: ScheduleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if db_schedule is None:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    for key, value in schedule.dict(exclude_unset=True).items():
        setattr(db_schedule, key, value)
    
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

@router.delete("/schedules/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if db_schedule is None:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    db.delete(db_schedule)
    db.commit()
    return None

@router.post("/time-logs", response_model=TimeLogResponse)
def create_time_log(
    time_log: TimeLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    staff = db.query(Staff).filter(Staff.id == time_log.staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    
    if time_log.clock_out:
        time_diff = time_log.clock_out - time_log.clock_in
        total_hours = time_diff.total_seconds() / 3600
        time_log_dict = time_log.dict()
        time_log_dict["total_hours"] = total_hours
        db_time_log = TimeLog(**time_log_dict)
    else:
        db_time_log = TimeLog(**time_log.dict())
    
    db.add(db_time_log)
    db.commit()
    db.refresh(db_time_log)
    return db_time_log

@router.get("/time-logs", response_model=List[TimeLogResponse])
def read_time_logs(
    staff_id: Optional[int] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(TimeLog)
    
    if staff_id:
        query = query.filter(TimeLog.staff_id == staff_id)
    
    if start_date:
        query = query.filter(TimeLog.clock_in >= start_date)
    
    if end_date:
        query = query.filter(TimeLog.clock_in <= end_date)
    
    time_logs = query.order_by(TimeLog.clock_in.desc()).all()
    return time_logs

@router.put("/time-logs/{time_log_id}", response_model=TimeLogResponse)
def update_time_log(
    time_log_id: int,
    time_log: TimeLogUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_time_log = db.query(TimeLog).filter(TimeLog.id == time_log_id).first()
    if db_time_log is None:
        raise HTTPException(status_code=404, detail="Time log not found")
    
    update_data = time_log.dict(exclude_unset=True)
    
    if "clock_out" in update_data and update_data["clock_out"]:
        time_diff = update_data["clock_out"] - db_time_log.clock_in
        update_data["total_hours"] = time_diff.total_seconds() / 3600
    
    for key, value in update_data.items():
        setattr(db_time_log, key, value)
    
    db.commit()
    db.refresh(db_time_log)
    return db_time_log

@router.delete("/time-logs/{time_log_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_time_log(
    time_log_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_time_log = db.query(TimeLog).filter(TimeLog.id == time_log_id).first()
    if db_time_log is None:
        raise HTTPException(status_code=404, detail="Time log not found")
    
    db.delete(db_time_log)
    db.commit()
    return None
