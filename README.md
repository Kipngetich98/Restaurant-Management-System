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
- Node.js (v16 or higher) for frontend development
- Python 3.11 or higher for backend development
- PostgreSQL (if not using Docker)

### Installation with Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/Kipngetich98/Restaurant-Management-System.git
cd Restaurant-Management-System
```

2. Configure environment variables:
```bash
# Copy the example environment files
cp backend/restaurant_backend/.env.example backend/restaurant_backend/.env
cp frontend/restaurant_frontend/.env.example frontend/restaurant_frontend/.env

# Edit the environment files if needed
# For production, update the DATABASE_URL and SECRET_KEY in backend/.env
# For production, update the VITE_API_URL in frontend/.env
```

3. Build and start the application using Docker Compose:
```bash
docker-compose up -d --build
```

4. Initialize the database with seed data:
```bash
docker-compose exec backend poetry run python -m app.scripts.seed_data
```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Manual Installation (Development)

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend/restaurant_backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Poetry and dependencies:
```bash
pip install poetry
poetry install
```

4. Configure environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your database credentials and other settings
# For SQLite (development):
# DATABASE_URL=sqlite:///./restaurant.db
# For PostgreSQL:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/restaurant_db
```

5. Initialize the database:
```bash
poetry run python -m app.scripts.create_tables
poetry run python -m app.scripts.seed_data
```

6. Run the development server:
```bash
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend/restaurant_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file
# For local development:
# VITE_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

### Default Credentials

The system is seeded with the following default users:

| Username | Password | Role |
|----------|----------|------|
| admin    | admin123 | Admin |
| manager  | manager123 | Manager |
| staff    | staff123 | Staff |

### Troubleshooting

1. If you encounter database connection issues:
   - Check that PostgreSQL is running
   - Verify the DATABASE_URL in the .env file
   - For Docker, ensure the db service is running: `docker-compose ps`

2. If the frontend can't connect to the backend:
   - Check that the backend is running
   - Verify the VITE_API_URL in the frontend .env file
   - Check for CORS issues in the browser console

3. For Docker-related issues:
   - Check Docker logs: `docker-compose logs -f`
   - Rebuild containers: `docker-compose up -d --build`
   - Reset containers: `docker-compose down -v && docker-compose up -d`

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
