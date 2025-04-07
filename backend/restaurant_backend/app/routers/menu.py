from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.database import get_db
from app.schemas.menu import (
    MenuCategoryCreate, MenuCategoryUpdate, MenuCategoryResponse,
    MenuItemCreate, MenuItemUpdate, MenuItemResponse, MenuItemDetailResponse,
    MenuIngredientCreate, MenuIngredientUpdate, MenuIngredientResponse
)
from app.models.menu import MenuCategory, MenuItem, MenuIngredient
from app.models.inventory import InventoryItem
from app.models.user import User
from app.auth.jwt import get_current_active_user, get_manager_user

router = APIRouter(
    prefix="/menu",
    tags=["Menu"]
)

@router.post("/categories", response_model=MenuCategoryResponse)
def create_menu_category(
    category: MenuCategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_category = MenuCategory(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.get("/categories", response_model=List[MenuCategoryResponse])
def read_menu_categories(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    categories = db.query(MenuCategory).offset(skip).limit(limit).all()
    return categories

@router.get("/categories/{category_id}", response_model=MenuCategoryResponse)
def read_menu_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_category = db.query(MenuCategory).filter(MenuCategory.id == category_id).first()
    if db_category is None:
        raise HTTPException(status_code=404, detail="Menu category not found")
    return db_category

@router.put("/categories/{category_id}", response_model=MenuCategoryResponse)
def update_menu_category(
    category_id: int,
    category: MenuCategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_category = db.query(MenuCategory).filter(MenuCategory.id == category_id).first()
    if db_category is None:
        raise HTTPException(status_code=404, detail="Menu category not found")
    
    for key, value in category.dict(exclude_unset=True).items():
        setattr(db_category, key, value)
    
    db.commit()
    db.refresh(db_category)
    return db_category

@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_menu_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_category = db.query(MenuCategory).filter(MenuCategory.id == category_id).first()
    if db_category is None:
        raise HTTPException(status_code=404, detail="Menu category not found")
    
    menu_items = db.query(MenuItem).filter(MenuItem.category_id == category_id).count()
    if menu_items > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete category with {menu_items} menu items. Remove menu items first."
        )
    
    db.delete(db_category)
    db.commit()
    return None

@router.post("/items", response_model=MenuItemResponse)
def create_menu_item(
    item: MenuItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    category = db.query(MenuCategory).filter(MenuCategory.id == item.category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Menu category not found")
    
    db_item = MenuItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/items", response_model=List[MenuItemResponse])
def read_menu_items(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    is_available: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(MenuItem)
    
    if category_id:
        query = query.filter(MenuItem.category_id == category_id)
    
    if is_available is not None:
        query = query.filter(MenuItem.is_available == is_available)
    
    items = query.offset(skip).limit(limit).all()
    return items

@router.get("/items/{item_id}", response_model=MenuItemDetailResponse)
def read_menu_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return db_item

@router.put("/items/{item_id}", response_model=MenuItemResponse)
def update_menu_item(
    item_id: int,
    item: MenuItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    update_data = item.dict(exclude_unset=True)
    
    if "category_id" in update_data:
        category = db.query(MenuCategory).filter(MenuCategory.id == update_data["category_id"]).first()
        if not category:
            raise HTTPException(status_code=404, detail="Menu category not found")
    
    for key, value in update_data.items():
        setattr(db_item, key, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_menu_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    db.delete(db_item)
    db.commit()
    return None

@router.post("/ingredients", response_model=MenuIngredientResponse)
def create_menu_ingredient(
    ingredient: MenuIngredientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    menu_item = db.query(MenuItem).filter(MenuItem.id == ingredient.menu_item_id).first()
    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    inventory_item = db.query(InventoryItem).filter(InventoryItem.id == ingredient.inventory_item_id).first()
    if not inventory_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    existing_ingredient = db.query(MenuIngredient).filter(
        MenuIngredient.menu_item_id == ingredient.menu_item_id,
        MenuIngredient.inventory_item_id == ingredient.inventory_item_id
    ).first()
    
    if existing_ingredient:
        raise HTTPException(
            status_code=400,
            detail="This ingredient is already added to the menu item"
        )
    
    db_ingredient = MenuIngredient(**ingredient.dict())
    db.add(db_ingredient)
    db.commit()
    db.refresh(db_ingredient)
    return db_ingredient

@router.get("/ingredients", response_model=List[MenuIngredientResponse])
def read_menu_ingredients(
    menu_item_id: Optional[int] = None,
    inventory_item_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(MenuIngredient)
    
    if menu_item_id:
        query = query.filter(MenuIngredient.menu_item_id == menu_item_id)
    
    if inventory_item_id:
        query = query.filter(MenuIngredient.inventory_item_id == inventory_item_id)
    
    ingredients = query.all()
    return ingredients

@router.put("/ingredients/{ingredient_id}", response_model=MenuIngredientResponse)
def update_menu_ingredient(
    ingredient_id: int,
    ingredient: MenuIngredientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_ingredient = db.query(MenuIngredient).filter(MenuIngredient.id == ingredient_id).first()
    if db_ingredient is None:
        raise HTTPException(status_code=404, detail="Menu ingredient not found")
    
    for key, value in ingredient.dict(exclude_unset=True).items():
        setattr(db_ingredient, key, value)
    
    db.commit()
    db.refresh(db_ingredient)
    return db_ingredient

@router.delete("/ingredients/{ingredient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_menu_ingredient(
    ingredient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_manager_user)
):
    db_ingredient = db.query(MenuIngredient).filter(MenuIngredient.id == ingredient_id).first()
    if db_ingredient is None:
        raise HTTPException(status_code=404, detail="Menu ingredient not found")
    
    db.delete(db_ingredient)
    db.commit()
    return None
