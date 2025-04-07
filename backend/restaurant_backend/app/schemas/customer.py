from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import datetime

class CustomerBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    loyalty_points: int = 0

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    loyalty_points: Optional[int] = None

class CustomerResponse(CustomerBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class FeedbackBase(BaseModel):
    customer_id: int
    order_id: Optional[int] = None
    rating: int
    comment: Optional[str] = None

class FeedbackCreate(FeedbackBase):
    pass

class FeedbackUpdate(BaseModel):
    rating: Optional[int] = None
    comment: Optional[str] = None

class FeedbackResponse(FeedbackBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
