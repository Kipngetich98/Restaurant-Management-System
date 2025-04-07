from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

class SupplierBase(BaseModel):
    name: str
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None

class SupplierCreate(SupplierBase):
    pass

class SupplierUpdate(SupplierBase):
    name: Optional[str] = None

class SupplierResponse(SupplierBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class InventoryItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    quantity: float
    unit: str
    cost_per_unit: float
    reorder_level: float
    supplier_id: Optional[int] = None

class InventoryItemCreate(InventoryItemBase):
    pass

class InventoryItemUpdate(InventoryItemBase):
    name: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    cost_per_unit: Optional[float] = None
    reorder_level: Optional[float] = None
    supplier_id: Optional[int] = None

class InventoryItemResponse(InventoryItemBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    supplier: Optional[SupplierResponse] = None

    class Config:
        orm_mode = True

class InventoryTransactionBase(BaseModel):
    inventory_item_id: int
    transaction_type: str
    quantity: float
    unit_price: Optional[float] = None
    total_price: Optional[float] = None
    notes: Optional[str] = None

class InventoryTransactionCreate(InventoryTransactionBase):
    pass

class InventoryTransactionResponse(InventoryTransactionBase):
    id: int
    created_by: int
    created_at: datetime

    class Config:
        orm_mode = True
