import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '../ui/card';
import { Button } from '../ui/button';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '../ui/select';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { DateRangePicker } from '../ui/date-range-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Download, Calendar, TrendingUp, DollarSign } from 'lucide-react';

interface SalesData {
  date: string;
  total: number;
  orders: number;
}

interface CategorySales {
  name: string;
  value: number;
}

interface TopSellingItem {
  id: number;
  name: string;
  quantity: number;
  revenue: number;
}

const SalesReports = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySales[]>([]);
  const [topSellingItems, setTopSellingItems] = useState<TopSellingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      let mockSalesData: SalesData[] = [];
      let mockTotalSales = 0;
      let mockTotalOrders = 0;
      
      if (timeRange === 'week') {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        mockSalesData = days.map(day => {
          const total = Math.floor(Math.random() * 20000) + 5000;
          const orders = Math.floor(Math.random() * 50) + 10;
          mockTotalSales += total;
          mockTotalOrders += orders;
          return { date: day, total, orders };
        });
      } else if (timeRange === 'month') {
        for (let i = 1; i <= 30; i++) {
          const total = Math.floor(Math.random() * 20000) + 5000;
          const orders = Math.floor(Math.random() * 50) + 10;
          mockTotalSales += total;
          mockTotalOrders += orders;
          mockSalesData.push({ date: `Day ${i}`, total, orders });
        }
      } else if (timeRange === 'year') {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        mockSalesData = months.map(month => {
          const total = Math.floor(Math.random() * 200000) + 50000;
          const orders = Math.floor(Math.random() * 500) + 100;
          mockTotalSales += total;
          mockTotalOrders += orders;
          return { date: month, total, orders };
        });
      }
      
      setSalesData(mockSalesData);
      setTotalSales(mockTotalSales);
      setTotalOrders(mockTotalOrders);
      setAverageOrderValue(Math.round(mockTotalSales / mockTotalOrders));
      
      setCategorySales([
        { name: 'Main Course', value: Math.floor(Math.random() * 100000) + 50000 },
        { name: 'Appetizers', value: Math.floor(Math.random() * 50000) + 20000 },
        { name: 'Desserts', value: Math.floor(Math.random() * 30000) + 10000 },
        { name: 'Drinks', value: Math.floor(Math.random() * 40000) + 30000 },
        { name: 'Sides', value: Math.floor(Math.random() * 20000) + 5000 },
      ]);
      
      setTopSellingItems([
        { id: 1, name: 'Beef Burger', quantity: 120, revenue: 66000 },
        { id: 2, name: 'Chicken Pizza', quantity: 95, revenue: 90250 },
        { id: 3, name: 'Fish Fillet', quantity: 85, revenue: 72250 },
        { id: 4, name: 'Chicken Biryani', quantity: 78, revenue: 50700 },
        { id: 5, name: 'Coca Cola', quantity: 150, revenue: 15000 },
      ]);
      
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    setLoading(true);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sales Reports</h1>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="year">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ksh {totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              For the selected period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              For the selected period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ksh {averageOrderValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              For the selected period
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sales">Sales Trend</TabsTrigger>
          <TabsTrigger value="categories">Sales by Category</TabsTrigger>
          <TabsTrigger value="items">Top Selling Items</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
              <CardDescription>
                {timeRange === 'week' 
                  ? 'Daily sales for the last 7 days' 
                  : timeRange === 'month' 
                    ? 'Daily sales for the last 30 days' 
                    : 'Monthly sales for the last 12 months'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <p>Loading sales data...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`Ksh ${value.toLocaleString()}`, 'Sales']}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        name="Sales (Ksh)" 
                        stroke="#3b82f6" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>
                Distribution of sales across different menu categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <p>Loading category data...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categorySales}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categorySales.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`Ksh ${value.toLocaleString()}`, 'Sales']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="items">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Items</CardTitle>
              <CardDescription>
                Items with the highest sales volume and revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <p>Loading items data...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topSellingItems}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="quantity" name="Quantity Sold" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="revenue" name="Revenue (Ksh)" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Detailed Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Sales Data</CardTitle>
          <CardDescription>
            Breakdown of sales by date
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-right py-3 px-4">Orders</th>
                  <th className="text-right py-3 px-4">Sales (Ksh)</th>
                  <th className="text-right py-3 px-4">Avg. Order Value</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">Loading data...</td>
                  </tr>
                ) : (
                  salesData.map((day, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{day.date}</td>
                      <td className="text-right py-3 px-4">{day.orders}</td>
                      <td className="text-right py-3 px-4">{day.total.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">
                        {Math.round(day.total / day.orders).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 font-bold">Total</td>
                  <td className="text-right py-3 px-4 font-bold">{totalOrders.toLocaleString()}</td>
                  <td className="text-right py-3 px-4 font-bold">{totalSales.toLocaleString()}</td>
                  <td className="text-right py-3 px-4 font-bold">{averageOrderValue.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Export to CSV
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SalesReports;
