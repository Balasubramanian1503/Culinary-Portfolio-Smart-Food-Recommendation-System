const mockCategories = [
  { category_id: 1, name: 'North Indian' },
  { category_id: 2, name: 'South Indian' },
  { category_id: 3, name: 'Continental' },
  { category_id: 4, name: 'Healthy/Salads' },
  { category_id: 5, name: 'Desserts' }
];

const mockFoods = [
  {
    item_id: 1, name: 'Butter Chicken (Murgh Makhani)', description: 'Succulent tandoor-kissed chicken thighs slow-simmered in a velvety tomato-cream sauce.',
    category_id: 1, category_name: 'North Indian', image_url: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg', price_inr: 320,
    calories: 520, protein_g: 38, carbs_g: 22, fats_g: 30, fiber_g: 2.5, serving_size: '1 portion (350 g)', chef_special: 1, is_veg: 0
  },
  {
    item_id: 2, name: 'Quinoa Power Bowl', description: 'Tri-colour quinoa tossed with roasted sweet potato, edamame, avocado, cherry tomatoes.',
    category_id: 4, category_name: 'Healthy/Salads', image_url: 'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg', price_inr: 360,
    calories: 390, protein_g: 18, carbs_g: 48, fats_g: 14, fiber_g: 9, serving_size: '1 bowl (400 g)', chef_special: 1, is_veg: 1
  },
  {
    item_id: 3, name: 'Grilled Salmon Steak', description: 'Norwegian salmon fillet seasoned with lemon-dill butter, grilled to a perfect medium.',
    category_id: 3, category_name: 'Continental', image_url: 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg', price_inr: 750,
    calories: 460, protein_g: 44, carbs_g: 6, fats_g: 28, fiber_g: 2, serving_size: '1 fillet (280 g)', chef_special: 1, is_veg: 0
  },
  {
    item_id: 4, name: 'Avial', description: 'A medley of seasonal vegetables simmered in freshly ground coconut-cumin paste.',
    category_id: 2, category_name: 'South Indian', image_url: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg', price_inr: 160,
    calories: 220, protein_g: 6, carbs_g: 28, fats_g: 9, fiber_g: 8, serving_size: '1 bowl (250 g)', chef_special: 0, is_veg: 1
  },
  {
    item_id: 5, name: 'Tiramisu', description: 'Classic Italian tiramisu with espresso-soaked savoiardi biscuits, layered between velvety mascarpone mousse.',
    category_id: 5, category_name: 'Desserts', image_url: 'https://images.unsplash.com/photo-1571115177098-24dfaa181514?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', price_inr: 280,
    calories: 380, protein_g: 8, carbs_g: 36, fats_g: 22, fiber_g: 0.8, serving_size: '1 slice (160 g)', chef_special: 1, is_veg: 1
  },
  {
    item_id: 6, name: 'Truffle Mushroom Pizza', description: 'Wood-fired artisan pizza topped with wild mushrooms, mozzarella, and a drizzle of white truffle oil.',
    category_id: 3, category_name: 'Continental', image_url: 'https://images.pexels.com/photos/1166120/pexels-photo-1166120.jpeg', price_inr: 550,
    calories: 680, protein_g: 22, carbs_g: 75, fats_g: 32, fiber_g: 4, serving_size: '1 pizza (10 inch)', chef_special: 1, is_veg: 1
  },
  {
    item_id: 7, name: 'Hyderabadi Chicken Biryani', description: 'Fragrant basmati rice slow-cooked with marinated chicken, saffron, and rich aromatic spices in a sealed pot.',
    category_id: 2, category_name: 'South Indian', image_url: 'https://images.pexels.com/photos/973898/pexels-photo-973898.jpeg', price_inr: 380,
    calories: 650, protein_g: 42, carbs_g: 65, fats_g: 24, fiber_g: 3, serving_size: '1 portion (400 g)', chef_special: 1, is_veg: 0
  },
  {
    item_id: 8, name: 'Palak Paneer', description: 'Fresh cottage cheese cubes simmered in a smooth, spiced spinach gravy enriched with cream.',
    category_id: 1, category_name: 'North Indian', image_url: 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg', price_inr: 260,
    calories: 410, protein_g: 18, carbs_g: 14, fats_g: 32, fiber_g: 5, serving_size: '1 bowl (300 g)', chef_special: 0, is_veg: 1
  },
  {
    item_id: 9, name: 'Spaghetti Carbonara', description: 'Classic Roman pasta tossed with crispy pancetta, egg yolk, pecorino romano, and black pepper.',
    category_id: 3, category_name: 'Continental', image_url: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg', price_inr: 420,
    calories: 580, protein_g: 24, carbs_g: 62, fats_g: 28, fiber_g: 3, serving_size: '1 plate (350 g)', chef_special: 0, is_veg: 0
  },
  {
    item_id: 10, name: 'Szechuan Tofu Bowl', description: 'Crispy tofu glazed in a spicy Szechuan sauce served over a bed of jasmine rice and steamed broccoli.',
    category_id: 4, category_name: 'Healthy/Salads', image_url: 'https://images.pexels.com/photos/3338537/pexels-photo-3338537.jpeg', price_inr: 310,
    calories: 450, protein_g: 22, carbs_g: 58, fats_g: 16, fiber_g: 7, serving_size: '1 bowl (380 g)', chef_special: 0, is_veg: 1
  },
  {
    item_id: 11, name: 'Classic New York Cheesecake', description: 'Rich and creamy vanilla cheesecake baked on a buttery graham cracker crust.',
    category_id: 5, category_name: 'Desserts', image_url: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg', price_inr: 290,
    calories: 480, protein_g: 8, carbs_g: 42, fats_g: 32, fiber_g: 1, serving_size: '1 slice (150 g)', chef_special: 1, is_veg: 1
  },
  {
    item_id: 12, name: 'Mutton Rogan Josh', description: 'Tender morsels of lamb slow-braised in a robust gravy of Kashmiri chilies, fennel, and ginger.',
    category_id: 1, category_name: 'North Indian', image_url: 'https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg', price_inr: 450,
    calories: 540, protein_g: 45, carbs_g: 12, fats_g: 34, fiber_g: 2, serving_size: '1 portion (320 g)', chef_special: 1, is_veg: 0
  },
  {
    item_id: 13, name: 'Kerala Fish Curry', description: 'Fresh kingfish simmered in a tangy, fiery coconut gravy flavored with kokum and curry leaves.',
    category_id: 2, category_name: 'South Indian', image_url: 'https://images.pexels.com/photos/3590401/pexels-photo-3590401.jpeg', price_inr: 390,
    calories: 380, protein_g: 32, carbs_g: 10, fats_g: 24, fiber_g: 1.5, serving_size: '1 bowl (300 g)', chef_special: 0, is_veg: 0
  },
  {
    item_id: 14, name: 'Mediterranean Falafel Wrap', description: 'Crispy falafel, hummus, cucumber, and tahini drizzle wrapped in a warm whole-wheat pita.',
    category_id: 4, category_name: 'Healthy/Salads', image_url: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg', price_inr: 250,
    calories: 420, protein_g: 14, carbs_g: 54, fats_g: 18, fiber_g: 10, serving_size: '1 wrap (250 g)', chef_special: 0, is_veg: 1
  },
  {
    item_id: 15, name: 'Chocolate Lava Cake', description: 'Decadent dark chocolate cake with a molten, gooey center. Best paired with vanilla bean ice cream.',
    category_id: 5, category_name: 'Desserts', image_url: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg', price_inr: 220,
    calories: 410, protein_g: 6, carbs_g: 48, fats_g: 22, fiber_g: 2, serving_size: '1 piece (120 g)', chef_special: 1, is_veg: 1
  }
];

module.exports = { mockCategories, mockFoods };
