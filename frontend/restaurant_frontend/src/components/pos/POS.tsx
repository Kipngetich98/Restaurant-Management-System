import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '../ui/table';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '../ui/select';
import { 
  ShoppingCart, Plus, Minus, Trash2, CreditCard, Printer, Save, User 
} from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface OrderItem {
  id: number;
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  notes: string;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  loyaltyPoints: number;
}

const POS = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderType, setOrderType] = useState<string>('dine-in');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState<boolean>(false);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState<string>('');

  useEffect(() => {
    const mockMenuItems: MenuItem[] = [
      { id: 1, name: 'Beef Burger', price: 550, category: 'Burgers' },
      { id: 2, name: 'Chicken Burger', price: 500, category: 'Burgers' },
      { id: 3, name: 'Veggie Burger', price: 450, category: 'Burgers' },
      { id: 4, name: 'French Fries', price: 200, category: 'Sides' },
      { id: 5, name: 'Onion Rings', price: 250, category: 'Sides' },
      { id: 6, name: 'Coca Cola', price: 100, category: 'Drinks' },
      { id: 7, name: 'Sprite', price: 100, category: 'Drinks' },
      { id: 8, name: 'Chicken Pizza', price: 950, category: 'Pizza' },
      { id: 9, name: 'Beef Pizza', price: 1050, category: 'Pizza' },
      { id: 10, name: 'Vegetable Pizza', price: 850, category: 'Pizza' },
      { id: 11, name: 'Chicken Biryani', price: 650, category: 'Main Course' },
      { id: 12, name: 'Beef Stew', price: 750, category: 'Main Course' },
      { id: 13, name: 'Fish Fillet', price: 850, category: 'Main Course' },
      { id: 14, name: 'Chocolate Cake', price: 350, category: 'Desserts' },
      { id: 15, name: 'Ice Cream', price: 250, category: 'Desserts' },
    ];
    
    setMenuItems(mockMenuItems);
    
    const uniqueCategories = ['All', ...new Set(mockMenuItems.map(item => item.category))];
    setCategories(uniqueCategories);

    setCustomers([
      { id: 1, name: 'John Doe', phone: '0712345678', loyaltyPoints: 120 },
      { id: 2, name: 'Jane Smith', phone: '0723456789', loyaltyPoints: 85 },
      { id: 3, name: 'Michael Johnson', phone: '0734567890', loyaltyPoints: 210 },
    ]);
  }, []);

  const addToOrder = (menuItem: MenuItem) => {
    const existingItemIndex = orderItems.findIndex(item => item.menuItemId === menuItem.id);
    
    if (existingItemIndex !== -1) {
      const updatedOrderItems = [...orderItems];
      updatedOrderItems[existingItemIndex].quantity += 1;
      setOrderItems(updatedOrderItems);
    } else {
      const newOrderItem: OrderItem = {
        id: Date.now(), // Temporary ID
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        notes: ''
      };
      setOrderItems([...orderItems, newOrderItem]);
    }
  };

  const removeFromOrder = (orderItemId: number) => {
    setOrderItems(orderItems.filter(item => item.id !== orderItemId));
  };

  const updateQuantity = (orderItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedOrderItems = orderItems.map(item => 
      item.id === orderItemId ? { ...item, quantity: newQuantity } : item
    );
    
    setOrderItems(updatedOrderItems);
  };

  const updateNotes = (orderItemId: number, notes: string) => {
    const updatedOrderItems = orderItems.map(item => 
      item.id === orderItemId ? { ...item, notes } : item
    );
    
    setOrderItems(updatedOrderItems);
  };

  const handlePayment = () => {
    console.log('Order submitted:', {
      orderItems,
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : null,
      customerId: selectedCustomer?.id,
      discount,
      tax,
      paymentMethod,
      total: calculateTotal(),
      finalTotal: calculateFinalTotal()
    });
    
    setOrderItems([]);
    setTableNumber('');
    setDiscount(0);
    setTax(0);
    setPaymentMethod('cash');
    setSelectedCustomer(null);
    setIsPaymentDialogOpen(false);
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal;
  };

  const calculateFinalTotal = () => {
    const total = calculateTotal();
    const discountAmount = (discount / 100) * total;
    const taxAmount = (tax / 100) * total;
    return total - discountAmount + taxAmount;
  };

  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.phone.includes(customerSearchTerm)
  );

  const selectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsCustomerDialogOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      {/* Menu Items Section */}
      <div className="lg:w-2/3 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Point of Sale</h1>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
          </div>
        </div>
        
        {/* Categories */}
        <div className="overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Menu Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMenuItems.map((item) => (
            <Card 
              key={item.id} 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => addToOrder(item)}
            >
              <CardContent className="p-4">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">{item.category}</div>
                <div className="mt-2 font-bold">Ksh {item.price.toLocaleString()}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Order Section */}
      <div className="lg:w-1/3 bg-gray-50 rounded-lg p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Current Order</h2>
          <div className="flex items-center gap-2">
            <Select value={orderType} onValueChange={setOrderType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Order Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dine-in">Dine In</SelectItem>
                <SelectItem value="takeaway">Takeaway</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
              </SelectContent>
            </Select>
            
            {orderType === 'dine-in' && (
              <Input
                placeholder="Table #"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-20"
              />
            )}
          </div>
        </div>
        
        {/* Customer Selection */}
        <div className="flex items-center justify-between">
          <div>
            {selectedCustomer ? (
              <div className="text-sm">
                <span className="font-medium">{selectedCustomer.name}</span>
                <span className="text-gray-500 ml-2">({selectedCustomer.phone})</span>
                <div className="text-xs text-green-600">Loyalty Points: {selectedCustomer.loyaltyPoints}</div>
              </div>
            ) : (
              <span className="text-sm text-gray-500">No customer selected</span>
            )}
          </div>
          <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {selectedCustomer ? 'Change' : 'Add Customer'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Customer</DialogTitle>
                <DialogDescription>
                  Search for a customer by name or phone number.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Search customers..."
                  value={customerSearchTerm}
                  onChange={(e) => setCustomerSearchTerm(e.target.value)}
                />
                <div className="max-h-60 overflow-y-auto">
                  {filteredCustomers.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No customers found</p>
                  ) : (
                    <div className="space-y-2">
                      {filteredCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          className="p-2 border rounded-md cursor-pointer hover:bg-gray-50"
                          onClick={() => selectCustomer(customer)}
                        >
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.phone}</div>
                          <div className="text-xs text-green-600">Loyalty Points: {customer.loyaltyPoints}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCustomerDialogOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Order Items */}
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-400px)]">
          {orderItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <ShoppingCart className="h-12 w-12 mb-2" />
              <p>No items in order</p>
              <p className="text-sm">Click on menu items to add them</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        {item.notes && (
                          <div className="text-xs text-gray-500">{item.notes}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-2">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {(item.price * item.quantity).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Save className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Notes</DialogTitle>
                              <DialogDescription>
                                Add special instructions for this item.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <Label htmlFor="notes">Notes</Label>
                              <Input
                                id="notes"
                                value={item.notes}
                                onChange={(e) => updateNotes(item.id, e.target.value)}
                                className="mt-2"
                              />
                            </div>
                            <DialogFooter>
                              <Button type="submit">Save Notes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500"
                          onClick={() => removeFromOrder(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>Ksh {calculateSubtotal().toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Discount (%):</span>
            <Input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-20 h-8"
            />
          </div>
          <div className="flex justify-between items-center">
            <span>Tax (%):</span>
            <Input
              type="number"
              value={tax}
              onChange={(e) => setTax(Number(e.target.value))}
              className="w-20 h-8"
            />
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>Ksh {calculateFinalTotal().toLocaleString()}</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setOrderItems([])}
            disabled={orderItems.length === 0}
          >
            Clear
          </Button>
          <Button
            variant="outline"
            className="flex-1"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="flex-1"
                disabled={orderItems.length === 0}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Pay
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Payment</DialogTitle>
                <DialogDescription>
                  Complete the order payment.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Ksh {calculateSubtotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount ({discount}%):</span>
                    <span>Ksh {((discount / 100) * calculateTotal()).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({tax}%):</span>
                    <span>Ksh {((tax / 100) * calculateTotal()).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>Ksh {calculateFinalTotal().toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger id="payment-method">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="mpesa">M-Pesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePayment}>
                  Complete Payment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default POS;
