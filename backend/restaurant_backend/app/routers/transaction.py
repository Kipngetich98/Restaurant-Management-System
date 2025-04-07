from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from app.database.database import get_db
from app.schemas.transaction import (
    TransactionCreate, TransactionResponse,
    ExpenseCreate, ExpenseUpdate, ExpenseResponse
)
from app.models.transaction import Transaction, Expense
from app.models.order import Order
from app.models.user import User
from app.auth.jwt import get_current_active_user, get_manager_user

router = APIRouter(
    prefix="/finance",
    tags=["Finance"]
)

@router.post("/transactions", response_model=TransactionResponse)
def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if transaction.order_id:
        order = db.query(Order).filter(Order.id == transaction.order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        if transaction.transaction_type == "payment":
            order.payment_status = "paid"
            order.payment_method = transaction.payment_method
    
    db_transaction = Transaction(
        **transaction.dict(),
        created_by=current_user.id
    )
    
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@router.get("/transactions", response_model=List[TransactionResponse])
def read_transactions(
    skip: int = 0,
    limit: int = 100,
    order_id: Optional[int] = None,
    transaction_type: Optional[str] = None,
    payment_method: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(Transaction)
    
    if order_id:
        query = query.filter(Transaction.order_id == order_id)
    
    if transaction_type:
        query = query.filter(Transaction.transaction_type == transaction_type)
    
    if payment_method:
        query = query.filter(Transaction.payment_method == payment_method)
    
    if start_date:
        query = query.filter(Transaction.created_at >= start_date)
    
    if end_date:
        query = query.filter(Transaction.created_at <= end_date)
    
    transactions = query.order_by(Transaction.created_at.desc()).offset(skip).limit(limit).all()
    return transactions

@router.get("/transactions/{transaction_id}", response_model=TransactionResponse)
def read_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return db_transaction

@router.post("/expenses", response_model=ExpenseResponse)
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_expense = Expense(
        **expense.dict(),
        created_by=current_user.id
    )
    
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.get("/expenses", response_model=List[ExpenseResponse])
def read_expenses(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(Expense)
    
    if category:
        query = query.filter(Expense.category == category)
    
    if start_date:
        query = query.filter(Expense.created_at >= start_date)
    
    if end_date:
        query = query.filter(Expense.created_at <= end_date)
    
    expenses = query.order_by(Expense.created_at.desc()).offset(skip).limit(limit).all()
    return expenses

@router.get("/expenses/{expense_id}", response_model=ExpenseResponse)
def read_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if db_expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    return db_expense

@router.put("/expenses/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: int,
    expense: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if db_expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    for key, value in expense.dict(exclude_unset=True).items():
        setattr(db_expense, key, value)
    
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.delete("/expenses/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if db_expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    db.delete(db_expense)
    db.commit()
    return None

@router.get("/reports/sales")
def get_sales_report(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    group_by: str = "day",  # day, week, month
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    if not end_date:
        end_date = datetime.utcnow()
    
    if not start_date:
        start_date = end_date - timedelta(days=30)
    
    query = db.query(Transaction).filter(
        Transaction.transaction_type == "payment",
        Transaction.created_at >= start_date,
        Transaction.created_at <= end_date
    )
    
    transactions = query.all()
    
    result = {
        "total_sales": sum(t.amount for t in transactions),
        "transaction_count": len(transactions),
        "start_date": start_date,
        "end_date": end_date,
        "data": []
    }
    
    if group_by == "day":
        days = {}
        for t in transactions:
            day_key = t.created_at.strftime("%Y-%m-%d")
            if day_key not in days:
                days[day_key] = {"date": day_key, "amount": 0, "count": 0}
            days[day_key]["amount"] += t.amount
            days[day_key]["count"] += 1
        
        result["data"] = list(days.values())
    
    elif group_by == "week":
        weeks = {}
        for t in transactions:
            week_key = t.created_at.strftime("%Y-%U")
            if week_key not in weeks:
                weeks[week_key] = {"week": week_key, "amount": 0, "count": 0}
            weeks[week_key]["amount"] += t.amount
            weeks[week_key]["count"] += 1
        
        result["data"] = list(weeks.values())
    
    elif group_by == "month":
        months = {}
        for t in transactions:
            month_key = t.created_at.strftime("%Y-%m")
            if month_key not in months:
                months[month_key] = {"month": month_key, "amount": 0, "count": 0}
            months[month_key]["amount"] += t.amount
            months[month_key]["count"] += 1
        
        result["data"] = list(months.values())
    
    return result

@router.get("/reports/expenses")
def get_expense_report(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    group_by: str = "category",  # category, day, month
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    if not end_date:
        end_date = datetime.utcnow()
    
    if not start_date:
        start_date = end_date - timedelta(days=30)
    
    query = db.query(Expense).filter(
        Expense.created_at >= start_date,
        Expense.created_at <= end_date
    )
    
    expenses = query.all()
    
    result = {
        "total_expenses": sum(e.amount for e in expenses),
        "expense_count": len(expenses),
        "start_date": start_date,
        "end_date": end_date,
        "data": []
    }
    
    if group_by == "category":
        categories = {}
        for e in expenses:
            if e.category not in categories:
                categories[e.category] = {"category": e.category, "amount": 0, "count": 0}
            categories[e.category]["amount"] += e.amount
            categories[e.category]["count"] += 1
        
        result["data"] = list(categories.values())
    
    elif group_by == "day":
        days = {}
        for e in expenses:
            day_key = e.created_at.strftime("%Y-%m-%d")
            if day_key not in days:
                days[day_key] = {"date": day_key, "amount": 0, "count": 0}
            days[day_key]["amount"] += e.amount
            days[day_key]["count"] += 1
        
        result["data"] = list(days.values())
    
    elif group_by == "month":
        months = {}
        for e in expenses:
            month_key = e.created_at.strftime("%Y-%m")
            if month_key not in months:
                months[month_key] = {"month": month_key, "amount": 0, "count": 0}
            months[month_key]["amount"] += e.amount
            months[month_key]["count"] += 1
        
        result["data"] = list(months.values())
    
    return result

@router.get("/reports/profit")
def get_profit_report(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    group_by: str = "day",  # day, week, month
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    if not end_date:
        end_date = datetime.utcnow()
    
    if not start_date:
        start_date = end_date - timedelta(days=30)
    
    sales_query = db.query(Transaction).filter(
        Transaction.transaction_type == "payment",
        Transaction.created_at >= start_date,
        Transaction.created_at <= end_date
    )
    
    sales = sales_query.all()
    total_sales = sum(s.amount for s in sales)
    
    expense_query = db.query(Expense).filter(
        Expense.created_at >= start_date,
        Expense.created_at <= end_date
    )
    
    expenses = expense_query.all()
    total_expenses = sum(e.amount for e in expenses)
    
    total_profit = total_sales - total_expenses
    
    result = {
        "total_sales": total_sales,
        "total_expenses": total_expenses,
        "total_profit": total_profit,
        "profit_margin": (total_profit / total_sales * 100) if total_sales > 0 else 0,
        "start_date": start_date,
        "end_date": end_date,
        "data": []
    }
    
    if group_by == "day":
        days = {}
        
        for s in sales:
            day_key = s.created_at.strftime("%Y-%m-%d")
            if day_key not in days:
                days[day_key] = {"date": day_key, "sales": 0, "expenses": 0, "profit": 0}
            days[day_key]["sales"] += s.amount
        
        for e in expenses:
            day_key = e.created_at.strftime("%Y-%m-%d")
            if day_key not in days:
                days[day_key] = {"date": day_key, "sales": 0, "expenses": 0, "profit": 0}
            days[day_key]["expenses"] += e.amount
        
        for day in days.values():
            day["profit"] = day["sales"] - day["expenses"]
        
        result["data"] = list(days.values())
    
    elif group_by == "week":
        weeks = {}
        
        for s in sales:
            week_key = s.created_at.strftime("%Y-%U")
            if week_key not in weeks:
                weeks[week_key] = {"week": week_key, "sales": 0, "expenses": 0, "profit": 0}
            weeks[week_key]["sales"] += s.amount
        
        for e in expenses:
            week_key = e.created_at.strftime("%Y-%U")
            if week_key not in weeks:
                weeks[week_key] = {"week": week_key, "sales": 0, "expenses": 0, "profit": 0}
            weeks[week_key]["expenses"] += e.amount
        
        for week in weeks.values():
            week["profit"] = week["sales"] - week["expenses"]
        
        result["data"] = list(weeks.values())
    
    elif group_by == "month":
        months = {}
        
        for s in sales:
            month_key = s.created_at.strftime("%Y-%m")
            if month_key not in months:
                months[month_key] = {"month": month_key, "sales": 0, "expenses": 0, "profit": 0}
            months[month_key]["sales"] += s.amount
        
        for e in expenses:
            month_key = e.created_at.strftime("%Y-%m")
            if month_key not in months:
                months[month_key] = {"month": month_key, "sales": 0, "expenses": 0, "profit": 0}
            months[month_key]["expenses"] += e.amount
        
        for month in months.values():
            month["profit"] = month["sales"] - month["expenses"]
        
        result["data"] = list(months.values())
    
    return result
