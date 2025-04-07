import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Package, Users, ShoppingCart } from 'lucide-react';

interface SalesDataItem {
  name: string;
  sales: number;
}

interface InventoryDataItem {
  name: string;
  value: number;
}

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockItems: number;
  salesData: SalesDataItem[];
  inventoryData: InventoryDataItem[];
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    lowStockItems: 0,
    salesData: [],
    inventoryData: []
  });

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalSales: 125850,
        totalOrders: 432,
        totalCustomers: 128,
        lowStockItems: 5,
        salesData: [
          { name: 'Jan', sales: 4000 },
          { name: 'Feb', sales: 3000 },
          { name: 'Mar', sales: 5000 },
          { name: 'Apr', sales: 7000 },
          { name: 'May', sales: 6000 },
          { name: 'Jun', sales: 8000 },
        ],
        inventoryData: [
          { name: 'In Stock', value: 85 },
          { name: 'Low Stock', value: 10 },
          { name: 'Out of Stock', value: 5 },
        ]
      });
    }, 1000);
  }, []);

  const COLORS = ['#0088FE', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ksh {stats.totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">+5.3%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
              <span className="text-red-500">Requires attention</span>
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
            <CardDescription>Sales performance over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.salesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Current inventory status overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.inventoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.inventoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest transactions and system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="mr-4 bg-blue-100 p-2 rounded-full">
                <ShoppingCart className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">New order #1089</p>
                <p className="text-xs text-muted-foreground">Table 5 - Ksh 2,450</p>
              </div>
              <div className="ml-auto text-xs text-muted-foreground">5 mins ago</div>
            </div>
            
            <div className="flex items-center">
              <div className="mr-4 bg-green-100 p-2 rounded-full">
                <DollarSign className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Payment received</p>
                <p className="text-xs text-muted-foreground">Order #1088 - Ksh 3,200</p>
              </div>
              <div className="ml-auto text-xs text-muted-foreground">15 mins ago</div>
            </div>
            
            <div className="flex items-center">
              <div className="mr-4 bg-yellow-100 p-2 rounded-full">
                <Package className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Low stock alert</p>
                <p className="text-xs text-muted-foreground">Chicken - 2kg remaining</p>
              </div>
              <div className="ml-auto text-xs text-muted-foreground">1 hour ago</div>
            </div>
            
            <div className="flex items-center">
              <div className="mr-4 bg-purple-100 p-2 rounded-full">
                <Users className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium">New customer registered</p>
                <p className="text-xs text-muted-foreground">John Doe - john@example.com</p>
              </div>
              <div className="ml-auto text-xs text-muted-foreground">3 hours ago</div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <button className="text-sm text-blue-500 hover:underline">View all activity</button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Dashboard;
