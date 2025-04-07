from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

class TransactionBase(BaseModel):
    order_id: Optional[int] = None
    transaction_type: str
    amount: float
    payment_method: Optional[str] = None
    reference_number: Optional[str] = None
    notes: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    created_by: int
    created_at: datetime

    class Config:
        orm_mode = True

class ExpenseBase(BaseModel):
    category: str
    amount: float
    description: Optional[str] = None
    receipt_url: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    category: Optional[str] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    receipt_url: Optional[str] = None

class ExpenseResponse(ExpenseBase):
    id: int
    created_by: int
    created_at: datetime

    class Config:
        orm_mode = True
