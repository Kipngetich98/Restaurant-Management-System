from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    table_number = Column(Integer, nullable=True)
    order_type = Column(String)  # "dine-in", "takeaway", "delivery"
    status = Column(String)  # "pending", "preparing", "ready", "delivered", "completed", "cancelled"
    total_amount = Column(Float)
    discount = Column(Float, default=0)
    tax = Column(Float, default=0)
    final_amount = Column(Float)
    payment_status = Column(String, default="pending")  # "pending", "paid", "refunded"
    payment_method = Column(String, nullable=True)  # "cash", "card", "mobile"
    notes = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    customer = relationship("Customer", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order")
    transactions = relationship("Transaction", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"))
    quantity = Column(Integer)
    unit_price = Column(Float)
    total_price = Column(Float)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    order = relationship("Order", back_populates="order_items")
    menu_item = relationship("MenuItem", back_populates="order_items")
