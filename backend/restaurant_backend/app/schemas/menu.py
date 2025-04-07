from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

class MenuCategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class MenuCategoryCreate(MenuCategoryBase):
    pass

class MenuCategoryUpdate(MenuCategoryBase):
    name: Optional[str] = None

class MenuCategoryResponse(MenuCategoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class MenuIngredientBase(BaseModel):
    menu_item_id: int
    inventory_item_id: int
    quantity: float

class MenuIngredientCreate(MenuIngredientBase):
    pass

class MenuIngredientUpdate(BaseModel):
    quantity: Optional[float] = None

class MenuIngredientResponse(MenuIngredientBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class MenuItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category_id: int
    image_url: Optional[str] = None
    is_available: bool = True

class MenuItemCreate(MenuItemBase):
    pass

class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[int] = None
    image_url: Optional[str] = None
    is_available: Optional[bool] = None

class MenuItemResponse(MenuItemBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    category: Optional[MenuCategoryResponse] = None

    class Config:
        orm_mode = True

class MenuItemDetailResponse(MenuItemResponse):
    ingredients: List[MenuIngredientResponse] = []

    class Config:
        orm_mode = True
