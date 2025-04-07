from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.database import get_db
from app.schemas.inventory import (
    SupplierCreate, SupplierUpdate, SupplierResponse,
    InventoryItemCreate, InventoryItemUpdate, InventoryItemResponse,
    InventoryTransactionCreate, InventoryTransactionResponse
)
from app.models.inventory import Supplier, InventoryItem, InventoryTransaction
from app.models.user import User
from app.auth.jwt import get_current_active_user, get_manager_user

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
)

@router.post("/suppliers", response_model=SupplierResponse)
def create_supplier(
    supplier: SupplierCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_supplier = Supplier(**supplier.dict())
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

@router.get("/suppliers", response_model=List[SupplierResponse])
def read_suppliers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    suppliers = db.query(Supplier).offset(skip).limit(limit).all()
    return suppliers

@router.get("/suppliers/{supplier_id}", response_model=SupplierResponse)
def read_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if db_supplier is None:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return db_supplier

@router.put("/suppliers/{supplier_id}", response_model=SupplierResponse)
def update_supplier(
    supplier_id: int,
    supplier: SupplierUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if db_supplier is None:
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    for key, value in supplier.dict(exclude_unset=True).items():
        setattr(db_supplier, key, value)
    
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

@router.delete("/suppliers/{supplier_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if db_supplier is None:
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    db.delete(db_supplier)
    db.commit()
    return None

@router.post("/items", response_model=InventoryItemResponse)
def create_inventory_item(
    item: InventoryItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_item = InventoryItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/items", response_model=List[InventoryItemResponse])
def read_inventory_items(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    items = db.query(InventoryItem).offset(skip).limit(limit).all()
    return items

@router.get("/items/{item_id}", response_model=InventoryItemResponse)
def read_inventory_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return db_item

@router.put("/items/{item_id}", response_model=InventoryItemResponse)
def update_inventory_item(
    item_id: int,
    item: InventoryItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    for key, value in item.dict(exclude_unset=True).items():
        setattr(db_item, key, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_inventory_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    db.delete(db_item)
    db.commit()
    return None

@router.post("/transactions", response_model=InventoryTransactionResponse)
def create_inventory_transaction(
    transaction: InventoryTransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_item = db.query(InventoryItem).filter(InventoryItem.id == transaction.inventory_item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    db_transaction = InventoryTransaction(
        **transaction.dict(),
        created_by=current_user.id
    )
    db.add(db_transaction)
    
    if transaction.transaction_type == "purchase":
        db_item.quantity += transaction.quantity
    elif transaction.transaction_type == "usage":
        if db_item.quantity < transaction.quantity:
            raise HTTPException(status_code=400, detail="Not enough inventory")
        db_item.quantity -= transaction.quantity
    elif transaction.transaction_type == "adjustment":
        db_item.quantity = transaction.quantity
    
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@router.get("/transactions", response_model=List[InventoryTransactionResponse])
def read_inventory_transactions(
    skip: int = 0,
    limit: int = 100,
    item_id: Optional[int] = None,
    transaction_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(InventoryTransaction)
    
    if item_id:
        query = query.filter(InventoryTransaction.inventory_item_id == item_id)
    
    if transaction_type:
        query = query.filter(InventoryTransaction.transaction_type == transaction_type)
    
    transactions = query.order_by(InventoryTransaction.created_at.desc()).offset(skip).limit(limit).all()
    return transactions

@router.get("/low-stock", response_model=List[InventoryItemResponse])
def get_low_stock_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    low_stock_items = db.query(InventoryItem).filter(
        InventoryItem.quantity <= InventoryItem.reorder_level
    ).all()
    return low_stock_items
