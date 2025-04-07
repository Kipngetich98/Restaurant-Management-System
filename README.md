# Restaurant Management System

A complete restaurant management system for a restaurant in Kiambu Thindigua, focusing on inventory management, staff scheduling, POS, financial reporting, and basic CRM.

## Features

### Authentication System
- Login/logout with JWT
- Role-based permissions (Admin, Manager, Staff)
- Password reset
- Session management with refresh tokens

### Inventory Management
- Add/edit/delete inventory items
- Track inventory levels
- Low stock alerts
- Inventory usage reports
- Supplier management

### Staff Management
- Add/edit/delete staff profiles
- Schedule creation and management
- Time tracking
- Performance metrics

### POS System
- Order creation interface
- Table management
- Payment processing
- Receipt generation
- Order history

### Financial Reporting
- Daily/weekly/monthly sales reports
- Expense tracking
- Profit calculations
- Tax reporting preparation
- Visual charts and graphs

### Basic CRM
- Customer database
- Order history by customer
- Feedback management
- Simple loyalty tracking

## Tech Stack

### Backend
- FastAPI
- PostgreSQL
- SQLAlchemy ORM
- JWT Authentication
- Pydantic for data validation

### Frontend
- React
- TypeScript
- Tailwind CSS
- Shadcn/UI components
- Recharts for data visualization

## Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Kipngetich98/Restaurant-Management-System-.git
cd Restaurant-Management-System
```

2. Start the application using Docker Compose:
```bash
docker-compose up -d
```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Default Credentials

The system is seeded with the following default users:

| Username | Password | Role |
|----------|----------|------|
| admin    | admin123 | Admin |
| manager  | manager123 | Manager |
| staff    | staff123 | Staff |

## Development Setup

### Backend

1. Navigate to the backend directory:
```bash
cd backend/restaurant_backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install poetry
poetry install
```

4. Set up environment variables:
   - Copy `.env.example` to `.env` and update the values

5. Run the development server:
```bash
poetry run uvicorn app.main:app --reload
```

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend/restaurant_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env` and update the values

4. Run the development server:
```bash
npm run dev
```

## API Documentation

The API documentation is available at `/docs` or `/redoc` endpoints when the backend is running.

## Database Schema

The system uses the following database models:

- Users: Authentication and authorization
- Inventory: Tracking restaurant supplies
- Staff: Employee information and scheduling
- Menu: Food and beverage items
- Orders: Customer orders
- Transactions: Financial records
- Customers: Customer information and loyalty

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors

- [Kipngetich98](https://github.com/Kipngetich98)

## Acknowledgements

- FastAPI for the backend framework
- React for the frontend library
- Tailwind CSS for styling
- Shadcn/UI for UI components
