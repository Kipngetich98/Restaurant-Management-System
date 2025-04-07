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
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '../ui/select';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  ingredients: string;
  image_url: string;
  is_available: boolean;
}

const MenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMenuItem, setCurrentMenuItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: '',
    description: '',
    ingredients: '',
    image_url: '',
    is_available: true
  });

  useEffect(() => {
    setTimeout(() => {
      const mockMenuItems: MenuItem[] = [
        {
          id: 1,
          name: 'Beef Burger',
          price: 550,
          category: 'Burgers',
          description: 'Juicy beef patty with lettuce, tomato, and special sauce',
          ingredients: 'Beef, lettuce, tomato, onion, cheese, special sauce, bun',
          image_url: 'https://example.com/beef-burger.jpg',
          is_available: true
        },
        {
          id: 2,
          name: 'Chicken Burger',
          price: 500,
          category: 'Burgers',
          description: 'Grilled chicken breast with mayo and fresh vegetables',
          ingredients: 'Chicken breast, lettuce, tomato, mayo, bun',
          image_url: 'https://example.com/chicken-burger.jpg',
          is_available: true
        },
        {
          id: 3,
          name: 'Veggie Burger',
          price: 450,
          category: 'Burgers',
          description: 'Plant-based patty with avocado and vegan mayo',
          ingredients: 'Plant-based patty, avocado, lettuce, tomato, vegan mayo, bun',
          image_url: 'https://example.com/veggie-burger.jpg',
          is_available: false
        },
        {
          id: 4,
          name: 'French Fries',
          price: 200,
          category: 'Sides',
          description: 'Crispy golden fries with a sprinkle of salt',
          ingredients: 'Potatoes, vegetable oil, salt',
          image_url: 'https://example.com/french-fries.jpg',
          is_available: true
        },
        {
          id: 5,
          name: 'Coca Cola',
          price: 100,
          category: 'Drinks',
          description: 'Classic refreshing cola drink',
          ingredients: 'Carbonated water, sugar, caramel color, phosphoric acid, natural flavors, caffeine',
          image_url: 'https://example.com/coca-cola.jpg',
          is_available: true
        },
        {
          id: 6,
          name: 'Chicken Pizza',
          price: 950,
          category: 'Pizza',
          description: 'Thin crust pizza with grilled chicken and vegetables',
          ingredients: 'Pizza dough, tomato sauce, mozzarella, grilled chicken, bell peppers, onions, olives',
          image_url: 'https://example.com/chicken-pizza.jpg',
          is_available: true
        }
      ];
      
      setMenuItems(mockMenuItems);
      
      const uniqueCategories = ['All', ...new Set(mockMenuItems.map(item => item.category))];
      setCategories(uniqueCategories);
      
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddMenuItem = () => {
    const newMenuItem: MenuItem = {
      id: menuItems.length + 1,
      ...formData
    };
    
    setMenuItems([...menuItems, newMenuItem]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditMenuItem = () => {
    if (!currentMenuItem) return;
    
    const updatedMenuItems = menuItems.map(item => 
      item.id === currentMenuItem.id 
        ? { ...item, ...formData } 
        : item
    );
    
    setMenuItems(updatedMenuItems);
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDeleteMenuItem = () => {
    if (!currentMenuItem) return;
    
    const updatedMenuItems = menuItems.filter(item => item.id !== currentMenuItem.id);
    
    setMenuItems(updatedMenuItems);
    setIsDeleteDialogOpen(false);
  };

  const openEditDialog = (menuItem: MenuItem) => {
    setCurrentMenuItem(menuItem);
    setFormData({
      name: menuItem.name,
      price: menuItem.price,
      category: menuItem.category,
      description: menuItem.description,
      ingredients: menuItem.ingredients,
      image_url: menuItem.image_url,
      is_available: menuItem.is_available
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (menuItem: MenuItem) => {
    setCurrentMenuItem(menuItem);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      category: '',
      description: '',
      ingredients: '',
      image_url: '',
      is_available: true
    });
    setCurrentMenuItem(null);
  };

  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Menu Items</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Menu Item</DialogTitle>
              <DialogDescription>
                Add a new item to your menu. Click save when you're done.
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
                <Label htmlFor="price" className="text-right">Price (Ksh)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(cat => cat !== 'All').map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                    <SelectItem value="new">+ Add New Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.category === 'new' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="new-category" className="text-right">New Category</Label>
                  <Input
                    id="new-category"
                    name="category"
                    value={formData.category === 'new' ? '' : formData.category}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ingredients" className="text-right">Ingredients</Label>
                <Textarea
                  id="ingredients"
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image_url" className="text-right">Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="is_available" className="text-right">Available</Label>
                <div className="col-span-3 flex items-center">
                  <input
                    id="is_available"
                    name="is_available"
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={handleCheckboxChange}
                    className="mr-2 h-4 w-4"
                  />
                  <Label htmlFor="is_available">Item is available for ordering</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddMenuItem}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Input
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        
        <div className="flex space-x-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading menu items...</p>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of your menu items.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price (Ksh)</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMenuItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">No menu items found</TableCell>
              </TableRow>
            ) : (
              filteredMenuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.price.toLocaleString()}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                  <TableCell>
                    <Badge variant={item.is_available ? "default" : "secondary"}>
                      {item.is_available ? 'Available' : 'Unavailable'}
                    </Badge>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>
              Make changes to the menu item. Click save when you're done.
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
              <Label htmlFor="edit-price" className="text-right">Price (Ksh)</Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(cat => cat !== 'All').map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                  <SelectItem value="new">+ Add New Category</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.category === 'new' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-new-category" className="text-right">New Category</Label>
                <Input
                  id="edit-new-category"
                  name="category"
                  value={formData.category === 'new' ? '' : formData.category}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-ingredients" className="text-right">Ingredients</Label>
              <Textarea
                id="edit-ingredients"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-image_url" className="text-right">Image URL</Label>
              <Input
                id="edit-image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-is_available" className="text-right">Available</Label>
              <div className="col-span-3 flex items-center">
                <input
                  id="edit-is_available"
                  name="is_available"
                  type="checkbox"
                  checked={formData.is_available}
                  onChange={handleCheckboxChange}
                  className="mr-2 h-4 w-4"
                />
                <Label htmlFor="edit-is_available">Item is available for ordering</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditMenuItem}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {currentMenuItem?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteMenuItem}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuItems;
