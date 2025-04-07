import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
  reorder_level: number;
  supplier_id: number;
  supplier_name: string;
  created_at: string;
}

const InventoryItems = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    unit: '',
    cost: 0,
    reorder_level: 0,
    supplier_id: 0
  });

  useEffect(() => {
    setTimeout(() => {
      setItems([
        {
          id: 1,
          name: 'Rice',
          quantity: 50,
          unit: 'kg',
          cost: 120,
          reorder_level: 10,
          supplier_id: 1,
          supplier_name: 'Global Foods Ltd',
          created_at: '2025-03-15T10:30:00Z'
        },
        {
          id: 2,
          name: 'Chicken',
          quantity: 15,
          unit: 'kg',
          cost: 450,
          reorder_level: 5,
          supplier_id: 2,
          supplier_name: 'Fresh Meats Inc',
          created_at: '2025-03-16T09:15:00Z'
        },
        {
          id: 3,
          name: 'Tomatoes',
          quantity: 8,
          unit: 'kg',
          cost: 80,
          reorder_level: 3,
          supplier_id: 3,
          supplier_name: 'Local Farmers Co-op',
          created_at: '2025-03-17T14:20:00Z'
        },
        {
          id: 4,
          name: 'Cooking Oil',
          quantity: 25,
          unit: 'liters',
          cost: 200,
          reorder_level: 5,
          supplier_id: 1,
          supplier_name: 'Global Foods Ltd',
          created_at: '2025-03-18T11:45:00Z'
        },
        {
          id: 5,
          name: 'Flour',
          quantity: 30,
          unit: 'kg',
          cost: 90,
          reorder_level: 8,
          supplier_id: 1,
          supplier_name: 'Global Foods Ltd',
          created_at: '2025-03-19T08:30:00Z'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' || name === 'cost' || name === 'reorder_level' || name === 'supplier_id' 
        ? parseFloat(value) 
        : value
    });
  };

  const handleAddItem = () => {
    const newItem: InventoryItem = {
      id: items.length + 1,
      ...formData,
      supplier_name: 'Supplier Name', // This would come from the API
      created_at: new Date().toISOString()
    };
    
    setItems([...items, newItem]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditItem = () => {
    if (!currentItem) return;
    
    const updatedItems = items.map(item => 
      item.id === currentItem.id 
        ? { ...item, ...formData } 
        : item
    );
    
    setItems(updatedItems);
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDeleteItem = () => {
    if (!currentItem) return;
    
    const updatedItems = items.filter(item => item.id !== currentItem.id);
    
    setItems(updatedItems);
    setIsDeleteDialogOpen(false);
  };

  const openEditDialog = (item: InventoryItem) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      cost: item.cost,
      reorder_level: item.reorder_level,
      supplier_id: item.supplier_id
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (item: InventoryItem) => {
    setCurrentItem(item);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      quantity: 0,
      unit: '',
      cost: 0,
      reorder_level: 0,
      supplier_id: 0
    });
    setCurrentItem(null);
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Items</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Inventory Item</DialogTitle>
              <DialogDescription>
                Add a new item to your inventory. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit" className="text-right">Unit</Label>
                <Input
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cost" className="text-right">Cost (Ksh)</Label>
                <Input
                  id="cost"
                  name="cost"
                  type="number"
                  value={formData.cost}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reorder_level" className="text-right">Reorder Level</Label>
                <Input
                  id="reorder_level"
                  name="reorder_level"
                  type="number"
                  value={formData.reorder_level}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="supplier_id" className="text-right">Supplier ID</Label>
                <Input
                  id="supplier_id"
                  name="supplier_id"
                  type="number"
                  value={formData.supplier_id}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddItem}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex items-center">
        <Input
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading inventory items...</p>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of your inventory items.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Cost (Ksh)</TableHead>
              <TableHead>Reorder Level</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">No items found</TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.cost.toLocaleString()}</TableCell>
                  <TableCell>{item.reorder_level}</TableCell>
                  <TableCell>{item.supplier_name}</TableCell>
                  <TableCell>
                    {item.quantity <= item.reorder_level ? (
                      <div className="flex items-center text-amber-500">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Low Stock
                      </div>
                    ) : (
                      <div className="text-green-500">In Stock</div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => openEditDialog(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="text-red-500"
                        onClick={() => openDeleteDialog(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription>
              Make changes to the inventory item. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-quantity" className="text-right">Quantity</Label>
              <Input
                id="edit-quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-unit" className="text-right">Unit</Label>
              <Input
                id="edit-unit"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-cost" className="text-right">Cost (Ksh)</Label>
              <Input
                id="edit-cost"
                name="cost"
                type="number"
                value={formData.cost}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-reorder_level" className="text-right">Reorder Level</Label>
              <Input
                id="edit-reorder_level"
                name="reorder_level"
                type="number"
                value={formData.reorder_level}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-supplier_id" className="text-right">Supplier ID</Label>
              <Input
                id="edit-supplier_id"
                name="supplier_id"
                type="number"
                value={formData.supplier_id}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditItem}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {currentItem?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteItem}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryItems;
