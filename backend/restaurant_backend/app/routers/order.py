from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from app.database.database import get_db
from app.schemas.order import (
    OrderCreate, OrderUpdate, OrderResponse, OrderDetailResponse,
    OrderItemCreate, OrderItemResponse
)
from app.models.order import Order, OrderItem
from app.models.menu import MenuItem
from app.models.customer import Customer
from app.models.user import User
from app.auth.jwt import get_current_active_user, get_manager_user

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)

@router.post("", response_model=OrderDetailResponse)
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if order.customer_id:
        customer = db.query(Customer).filter(Customer.id == order.customer_id).first()
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
    
    total_amount = 0
    order_items_data = []
    
    for item in order.items:
        menu_item = db.query(MenuItem).filter(MenuItem.id == item.menu_item_id).first()
        if not menu_item:
            raise HTTPException(status_code=404, detail=f"Menu item with id {item.menu_item_id} not found")
        
        if not menu_item.is_available:
            raise HTTPException(status_code=400, detail=f"Menu item '{menu_item.name}' is not available")
        
        item_total = menu_item.price * item.quantity
        total_amount += item_total
        
        order_items_data.append({
            "menu_item_id": item.menu_item_id,
            "quantity": item.quantity,
            "unit_price": menu_item.price,
            "total_price": item_total,
            "notes": item.notes
        })
    
    final_amount = total_amount - order.discount
    final_amount += order.tax
    
    db_order = Order(
        customer_id=order.customer_id,
        table_number=order.table_number,
        order_type=order.order_type,
        total_amount=total_amount,
        discount=order.discount,
        tax=order.tax,
        final_amount=final_amount,
        notes=order.notes,
        created_by=current_user.id
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    for item_data in order_items_data:
        db_order_item = OrderItem(
            order_id=db_order.id,
            **item_data
        )
        db.add(db_order_item)
    
    db.commit()
    db.refresh(db_order)
    
    return db_order

@router.get("", response_model=List[OrderResponse])
def read_orders(
    skip: int = 0,
    limit: int = 100,
    customer_id: Optional[int] = None,
    order_type: Optional[str] = None,
    status: Optional[str] = None,
    payment_status: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(Order)
    
    if customer_id:
        query = query.filter(Order.customer_id == customer_id)
    
    if order_type:
        query = query.filter(Order.order_type == order_type)
    
    if status:
        query = query.filter(Order.status == status)
    
    if payment_status:
        query = query.filter(Order.payment_status == payment_status)
    
    if start_date:
        query = query.filter(Order.created_at >= start_date)
    
    if end_date:
        query = query.filter(Order.created_at <= end_date)
    
    orders = query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    return orders

@router.get("/{order_id}", response_model=OrderDetailResponse)
def read_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@router.put("/{order_id}", response_model=OrderResponse)
def update_order(
    order_id: int,
    order: OrderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.customer_id:
        customer = db.query(Customer).filter(Customer.id == order.customer_id).first()
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
    
    update_data = order.dict(exclude_unset=True)
    
    if "discount" in update_data or "tax" in update_data:
        discount = update_data.get("discount", db_order.discount)
        tax = update_data.get("tax", db_order.tax)
        final_amount = db_order.total_amount - discount + tax
        update_data["final_amount"] = final_amount
    
    for key, value in update_data.items():
        setattr(db_order, key, value)
    
    db.commit()
    db.refresh(db_order)
    return db_order

@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db.query(OrderItem).filter(OrderItem.order_id == order_id).delete()
    
    db.delete(db_order)
    db.commit()
    return None

@router.post("/{order_id}/items", response_model=OrderItemResponse)
def add_order_item(
    order_id: int,
    item: OrderItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    
    menu_item = db.query(MenuItem).filter(MenuItem.id == item.menu_item_id).first()
    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    if not menu_item.is_available:
        raise HTTPException(status_code=400, detail=f"Menu item '{menu_item.name}' is not available")
    
    item_total = menu_item.price * item.quantity
    
    db_order_item = OrderItem(
        order_id=order_id,
        menu_item_id=item.menu_item_id,
        quantity=item.quantity,
        unit_price=menu_item.price,
        total_price=item_total,
        notes=item.notes
    )
    
    db.add(db_order_item)
    
    db_order.total_amount += item_total
    db_order.final_amount = db_order.total_amount - db_order.discount + db_order.tax
    
    db.commit()
    db.refresh(db_order_item)
    
    return db_order_item

@router.delete("/{order_id}/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_order_item(
    order_id: int,
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db_order_item = db.query(OrderItem).filter(
        OrderItem.id == item_id,
        OrderItem.order_id == order_id
    ).first()
    
    if db_order_item is None:
        raise HTTPException(status_code=404, detail="Order item not found")
    
    db_order.total_amount -= db_order_item.total_price
    db_order.final_amount = db_order.total_amount - db_order.discount + db_order.tax
    
    db.delete(db_order_item)
    db.commit()
    
    return None
