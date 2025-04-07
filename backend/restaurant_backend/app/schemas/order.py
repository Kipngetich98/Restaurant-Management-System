from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

class OrderItemBase(BaseModel):
    order_id: int
    menu_item_id: int
    quantity: int
    unit_price: float
    total_price: float
    notes: Optional[str] = None

class OrderItemCreate(BaseModel):
    menu_item_id: int
    quantity: int
    notes: Optional[str] = None

class OrderItemResponse(OrderItemBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class OrderBase(BaseModel):
    customer_id: Optional[int] = None
    table_number: Optional[int] = None
    order_type: str
    status: str = "pending"
    total_amount: float
    discount: float = 0
    tax: float = 0
    final_amount: float
    payment_status: str = "pending"
    payment_method: Optional[str] = None
    notes: Optional[str] = None

class OrderCreate(BaseModel):
    customer_id: Optional[int] = None
    table_number: Optional[int] = None
    order_type: str
    discount: float = 0
    tax: float = 0
    notes: Optional[str] = None
    items: List[OrderItemCreate]

class OrderUpdate(BaseModel):
    customer_id: Optional[int] = None
    table_number: Optional[int] = None
    order_type: Optional[str] = None
    status: Optional[str] = None
    discount: Optional[float] = None
    tax: Optional[float] = None
    payment_status: Optional[str] = None
    payment_method: Optional[str] = None
    notes: Optional[str] = None

class OrderResponse(OrderBase):
    id: int
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class OrderDetailResponse(OrderResponse):
    order_items: List[OrderItemResponse] = []

    class Config:
        orm_mode = True
