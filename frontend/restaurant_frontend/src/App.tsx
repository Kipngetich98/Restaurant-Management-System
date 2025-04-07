import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import LoginForm from './components/auth/LoginForm';
import Dashboard from './components/dashboard/Dashboard';
import InventoryItems from './components/inventory/InventoryItems';
import POS from './components/pos/POS';
import StaffList from './components/staff/StaffList';
import MenuItems from './components/menu/MenuItems';
import SalesReports from './components/reports/SalesReports';
import CustomersList from './components/customers/CustomersList';
import './App.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
const InventorySuppliers = () => <div className="p-4">Inventory Suppliers Content</div>;
const InventoryTransactions = () => <div className="p-4">Inventory Transactions Content</div>;
const StaffSchedules = () => <div className="p-4">Staff Schedules Content</div>;
const StaffTimeLogs = () => <div className="p-4">Staff Time Logs Content</div>;
const MenuCategories = () => <div className="p-4">Menu Categories Content</div>;
const ReportsExpenses = () => <div className="p-4">Expenses Reports Content</div>;
const ReportsProfit = () => <div className="p-4">Profit Reports Content</div>;
const ReportsInventory = () => <div className="p-4">Inventory Reports Content</div>;
const CustomersFeedback = () => <div className="p-4">Customers Feedback Content</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          
          {/* Inventory Routes */}
          <Route path="inventory">
            <Route index element={<Navigate to="/inventory/items" replace />} />
            <Route path="items" element={<InventoryItems />} />
            <Route path="suppliers" element={<InventorySuppliers />} />
            <Route path="transactions" element={<InventoryTransactions />} />
          </Route>
          
          {/* Staff Routes */}
          <Route path="staff">
            <Route index element={<Navigate to="/staff/list" replace />} />
            <Route path="list" element={<StaffList />} />
            <Route path="schedules" element={<StaffSchedules />} />
            <Route path="time-logs" element={<StaffTimeLogs />} />
          </Route>
          
          {/* Menu Routes */}
          <Route path="menu">
            <Route index element={<Navigate to="/menu/items" replace />} />
            <Route path="categories" element={<MenuCategories />} />
            <Route path="items" element={<MenuItems />} />
          </Route>
          
          {/* POS Route */}
          <Route path="pos" element={<POS />} />
          
          {/* Reports Routes */}
          <Route path="reports">
            <Route index element={<Navigate to="/reports/sales" replace />} />
            <Route path="sales" element={<SalesReports />} />
            <Route path="expenses" element={<ReportsExpenses />} />
            <Route path="profit" element={<ReportsProfit />} />
            <Route path="inventory" element={<ReportsInventory />} />
          </Route>
          
          {/* Customers Routes */}
          <Route path="customers">
            <Route index element={<Navigate to="/customers/list" replace />} />
            <Route path="list" element={<CustomersList />} />
            <Route path="feedback" element={<CustomersFeedback />} />
          </Route>
        </Route>
        
        {/* Redirect any unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
