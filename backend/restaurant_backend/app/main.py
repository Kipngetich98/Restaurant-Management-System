from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.database.database import engine, Base
from app.routers import auth, inventory, staff, menu, order, customer, transaction

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Restaurant Management System API",
    description="API for Restaurant Management System in Kiambu Thindigua",
    version="1.0.0"
)

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(auth.router)
app.include_router(inventory.router)
app.include_router(staff.router)
app.include_router(menu.router)
app.include_router(order.router)
app.include_router(customer.router)
app.include_router(transaction.router)

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {
        "message": "Welcome to Restaurant Management System API",
        "docs": "/docs",
        "redoc": "/redoc"
    }
