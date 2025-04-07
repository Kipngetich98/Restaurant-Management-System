from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

class StaffBase(BaseModel):
    user_id: int
    position: str
    department: str
    hourly_rate: float
    phone: str
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    hire_date: datetime

class StaffCreate(StaffBase):
    pass

class StaffUpdate(BaseModel):
    position: Optional[str] = None
    department: Optional[str] = None
    hourly_rate: Optional[float] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None

class StaffResponse(StaffBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class ScheduleBase(BaseModel):
    staff_id: int
    day_of_week: str
    start_time: datetime
    end_time: datetime

class ScheduleCreate(ScheduleBase):
    pass

class ScheduleUpdate(BaseModel):
    day_of_week: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

class ScheduleResponse(ScheduleBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class TimeLogBase(BaseModel):
    staff_id: int
    clock_in: datetime
    clock_out: Optional[datetime] = None
    total_hours: Optional[float] = None
    notes: Optional[str] = None

class TimeLogCreate(TimeLogBase):
    pass

class TimeLogUpdate(BaseModel):
    clock_out: Optional[datetime] = None
    total_hours: Optional[float] = None
    notes: Optional[str] = None

class TimeLogResponse(TimeLogBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
