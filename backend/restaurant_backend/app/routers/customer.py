from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.database import get_db
from app.schemas.customer import (
    CustomerCreate, CustomerUpdate, CustomerResponse,
    FeedbackCreate, FeedbackUpdate, FeedbackResponse
)
from app.models.customer import Customer, Feedback
from app.models.order import Order
from app.models.user import User
from app.auth.jwt import get_current_active_user, get_manager_user

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)

@router.post("", response_model=CustomerResponse)
def create_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if customer.email:
        existing_customer = db.query(Customer).filter(Customer.email == customer.email).first()
        if existing_customer:
            raise HTTPException(
                status_code=400,
                detail="Customer with this email already exists"
            )
    
    if customer.phone:
        existing_customer = db.query(Customer).filter(Customer.phone == customer.phone).first()
        if existing_customer:
            raise HTTPException(
                status_code=400,
                detail="Customer with this phone number already exists"
            )
    
    db_customer = Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

@router.get("", response_model=List[CustomerResponse])
def read_customers(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(Customer)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Customer.name.ilike(search_term)) |
            (Customer.email.ilike(search_term)) |
            (Customer.phone.ilike(search_term))
        )
    
    customers = query.offset(skip).limit(limit).all()
    return customers

@router.get("/{customer_id}", response_model=CustomerResponse)
def read_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if db_customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return db_customer

@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(
    customer_id: int,
    customer: CustomerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if db_customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    update_data = customer.dict(exclude_unset=True)
    
    if "email" in update_data and update_data["email"]:
        existing_customer = db.query(Customer).filter(
            Customer.email == update_data["email"],
            Customer.id != customer_id
        ).first()
        if existing_customer:
            raise HTTPException(
                status_code=400,
                detail="Customer with this email already exists"
            )
    
    if "phone" in update_data and update_data["phone"]:
        existing_customer = db.query(Customer).filter(
            Customer.phone == update_data["phone"],
            Customer.id != customer_id
        ).first()
        if existing_customer:
            raise HTTPException(
                status_code=400,
                detail="Customer with this phone number already exists"
            )
    
    for key, value in update_data.items():
        setattr(db_customer, key, value)
    
    db.commit()
    db.refresh(db_customer)
    return db_customer

@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if db_customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    orders = db.query(Order).filter(Order.customer_id == customer_id).count()
    if orders > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete customer with {orders} orders. Remove orders first or anonymize customer data."
        )
    
    db.delete(db_customer)
    db.commit()
    return None

@router.post("/feedback", response_model=FeedbackResponse)
def create_feedback(
    feedback: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    customer = db.query(Customer).filter(Customer.id == feedback.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    if feedback.order_id:
        order = db.query(Order).filter(Order.id == feedback.order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        if order.customer_id != feedback.customer_id:
            raise HTTPException(
                status_code=400,
                detail="Order does not belong to this customer"
            )
    
    if feedback.rating < 1 or feedback.rating > 5:
        raise HTTPException(
            status_code=400,
            detail="Rating must be between 1 and 5"
        )
    
    db_feedback = Feedback(**feedback.dict())
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

@router.get("/feedback", response_model=List[FeedbackResponse])
def read_feedback(
    customer_id: Optional[int] = None,
    order_id: Optional[int] = None,
    rating: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(Feedback)
    
    if customer_id:
        query = query.filter(Feedback.customer_id == customer_id)
    
    if order_id:
        query = query.filter(Feedback.order_id == order_id)
    
    if rating:
        query = query.filter(Feedback.rating == rating)
    
    feedback = query.order_by(Feedback.created_at.desc()).offset(skip).limit(limit).all()
    return feedback

@router.put("/feedback/{feedback_id}", response_model=FeedbackResponse)
def update_feedback(
    feedback_id: int,
    feedback: FeedbackUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if db_feedback is None:
        raise HTTPException(status_code=404, detail="Feedback not found")
    
    update_data = feedback.dict(exclude_unset=True)
    
    if "rating" in update_data and (update_data["rating"] < 1 or update_data["rating"] > 5):
        raise HTTPException(
            status_code=400,
            detail="Rating must be between 1 and 5"
        )
    
    for key, value in update_data.items():
        setattr(db_feedback, key, value)
    
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

@router.delete("/feedback/{feedback_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_feedback(
    feedback_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if db_feedback is None:
        raise HTTPException(status_code=404, detail="Feedback not found")
    
    db.delete(db_feedback)
    db.commit()
    return None
