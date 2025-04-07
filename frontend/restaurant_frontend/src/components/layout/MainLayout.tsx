import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, X, Home, Package, Users, Coffee, ShoppingCart, 
  BarChart2, Users as UsersIcon, LogOut, ChevronDown, ChevronRight
} from 'lucide-react';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSubmenu = (key: string) => {
    setIsSubmenuOpen(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      path: '/',
      submenu: []
    },
    {
      title: 'Inventory',
      icon: <Package className="h-5 w-5" />,
      path: '/inventory',
      submenu: [
        { title: 'Items', path: '/inventory/items' },
        { title: 'Suppliers', path: '/inventory/suppliers' },
        { title: 'Transactions', path: '/inventory/transactions' }
      ]
    },
    {
      title: 'Staff',
      icon: <Users className="h-5 w-5" />,
      path: '/staff',
      submenu: [
        { title: 'Staff List', path: '/staff/list' },
        { title: 'Schedules', path: '/staff/schedules' },
        { title: 'Time Logs', path: '/staff/time-logs' }
      ]
    },
    {
      title: 'Menu',
      icon: <Coffee className="h-5 w-5" />,
      path: '/menu',
      submenu: [
        { title: 'Categories', path: '/menu/categories' },
        { title: 'Items', path: '/menu/items' }
      ]
    },
    {
      title: 'POS',
      icon: <ShoppingCart className="h-5 w-5" />,
      path: '/pos',
      submenu: []
    },
    {
      title: 'Reports',
      icon: <BarChart2 className="h-5 w-5" />,
      path: '/reports',
      submenu: [
        { title: 'Sales', path: '/reports/sales' },
        { title: 'Expenses', path: '/reports/expenses' },
        { title: 'Profit', path: '/reports/profit' },
        { title: 'Inventory', path: '/reports/inventory' }
      ]
    },
    {
      title: 'Customers',
      icon: <UsersIcon className="h-5 w-5" />,
      path: '/customers',
      submenu: [
        { title: 'Customer List', path: '/customers/list' },
        { title: 'Feedback', path: '/customers/feedback' }
      ]
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-800 text-white transition-all duration-300 ease-in-out fixed h-full`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {isSidebarOpen ? (
            <h1 className="text-xl font-bold">Restaurant MS</h1>
          ) : (
            <h1 className="text-xl font-bold">RMS</h1>
          )}
          <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-700">
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <nav className="mt-4">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className="mb-1">
                {item.submenu.length > 0 ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.title)}
                      className={`flex items-center w-full p-3 ${
                        isActive(item.path) ? 'bg-gray-700' : 'hover:bg-gray-700'
                      } rounded-md transition-colors`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {isSidebarOpen && (
                        <>
                          <span className="flex-1 text-left">{item.title}</span>
                          {isSubmenuOpen[item.title] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </>
                      )}
                    </button>
                    {isSidebarOpen && isSubmenuOpen[item.title] && (
                      <ul className="pl-10 mt-1">
                        {item.submenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subItem.path}
                              className={`block p-2 rounded-md ${
                                isActive(subItem.path) ? 'bg-gray-700' : 'hover:bg-gray-700'
                              } transition-colors`}
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 ${
                      isActive(item.path) ? 'bg-gray-700' : 'hover:bg-gray-700'
                    } rounded-md transition-colors`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {isSidebarOpen && <span>{item.title}</span>}
                  </Link>
                )}
              </li>
            ))}
            <li className="mt-auto">
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-3 hover:bg-gray-700 rounded-md transition-colors"
              >
                <span className="mr-3"><LogOut className="h-5 w-5" /></span>
                {isSidebarOpen && <span>Logout</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 ease-in-out`}>
        <header className="bg-white shadow-sm">
          <div className="px-4 py-3">
            <h2 className="text-xl font-semibold text-gray-800">
              {menuItems.find(item => isActive(item.path))?.title || 'Dashboard'}
            </h2>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
