-- ============================================================
-- PROJECT  : Culinary Portfolio & Smart Food Recommendation
-- FILE     : db/schema.sql
-- PURPOSE  : Relational schema + Mock Data (Phase 1)
-- ENGINE   : MySQL 8.x / MariaDB 10.x
-- AUTHOR   : Antigravity (Auto-Generated)
-- DATE     : 2026-05-16
-- ============================================================

-- ---------------------------------------------------------
-- 0. Database Bootstrap
-- ---------------------------------------------------------
CREATE DATABASE IF NOT EXISTS culinary_portfolio
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE culinary_portfolio;

-- ---------------------------------------------------------
-- 1. categories
-- ---------------------------------------------------------
DROP TABLE IF EXISTS food_items;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
  category_id   INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  name          VARCHAR(100)     NOT NULL,
  slug          VARCHAR(100)     NOT NULL,
  description   TEXT,
  icon_class    VARCHAR(60)      DEFAULT 'fa-utensils',   -- FontAwesome class
  display_order TINYINT UNSIGNED DEFAULT 0,
  created_at    TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (category_id),
  UNIQUE KEY uq_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 2. food_items
-- ---------------------------------------------------------
CREATE TABLE food_items (
  item_id       INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  name          VARCHAR(150)     NOT NULL,
  description   TEXT             NOT NULL,
  category_id   INT UNSIGNED     NOT NULL,
  image_url     VARCHAR(500)     NOT NULL,
  price_inr     DECIMAL(8,2)     NOT NULL DEFAULT 0.00,
  calories      SMALLINT UNSIGNED NOT NULL DEFAULT 0,   -- kcal per serving
  protein_g     DECIMAL(6,2)     NOT NULL DEFAULT 0.00,
  carbs_g       DECIMAL(6,2)     NOT NULL DEFAULT 0.00,
  fats_g        DECIMAL(6,2)     NOT NULL DEFAULT 0.00,
  fiber_g       DECIMAL(6,2)     NOT NULL DEFAULT 0.00,
  serving_size  VARCHAR(60)      DEFAULT '1 plate / 300 g',
  chef_special  BOOLEAN          NOT NULL DEFAULT FALSE,
  is_veg        BOOLEAN          NOT NULL DEFAULT TRUE,
  spice_level   TINYINT UNSIGNED DEFAULT 1,  -- 1=Mild, 2=Medium, 3=Hot, 4=Extra Hot
  rating        DECIMAL(3,1)     DEFAULT 4.0,
  is_available  BOOLEAN          NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (item_id),
  KEY idx_category (category_id),
  KEY idx_chef_special (chef_special),
  CONSTRAINT fk_food_category
    FOREIGN KEY (category_id) REFERENCES categories (category_id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 3. Mock Data — Categories (5)
-- ---------------------------------------------------------
INSERT INTO categories (name, slug, description, icon_class, display_order) VALUES
  ('North Indian',  'north-indian',  'Rich, aromatic gravies, tandoori classics, and hearty bread from the heartland of India.',          'fa-fire-flame-curved', 1),
  ('South Indian',  'south-indian',  'Light, fermented rice delicacies, coconut-based curries, and spiced lentil accompaniments.',         'fa-leaf',              2),
  ('Continental',   'continental',   'European-inspired dishes — pastas, grills, and salads prepared with fresh, premium ingredients.',    'fa-globe',             3),
  ('Healthy/Salads','healthy-salads','Nutrient-dense bowls, power salads, and low-calorie meals designed for mindful eating.',             'fa-seedling',          4),
  ('Desserts',      'desserts',      'Indulgent sweets and confections — from traditional Indian mithai to contemporary pâtisserie.',      'fa-cake-candles',      5);

-- ---------------------------------------------------------
-- 4. Mock Data — Food Items (20 items across 5 categories)
-- ---------------------------------------------------------
-- Pexels free-use images are used as placeholder image_url values.
-- Replace with your own CDN / local paths in production.

INSERT INTO food_items
  (name, description, category_id, image_url, price_inr,
   calories, protein_g, carbs_g, fats_g, fiber_g,
   serving_size, chef_special, is_veg, spice_level, rating)
VALUES

-- ── NORTH INDIAN (category_id = 1) ──────────────────────────────────────────
(
  'Butter Chicken (Murgh Makhani)',
  'Succulent tandoor-kissed chicken thighs slow-simmered in a velvety tomato-cream sauce enriched with kasuri methi and garam masala. Served with a garlic naan.',
  1, 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg', 320.00,
  520, 38.00, 22.00, 30.00, 2.50, '1 portion (350 g)', TRUE,  FALSE, 2, 4.9
),
(
  'Dal Makhani',
  'Whole black lentils and kidney beans cooked overnight on a slow flame with tomatoes, cream, and hand-pounded spices — a true Punjabi heirloom recipe.',
  1, 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg', 210.00,
  410, 18.00, 48.00, 14.00, 11.00, '1 bowl (300 g)', TRUE,  TRUE,  1, 4.8
),
(
  'Paneer Lababdar',
  'Cubes of fresh cottage cheese bathed in a rich onion-tomato gravy with a hint of cream and aromatic whole spices — indulgently mild.',
  1, 'https://images.pexels.com/photos/6260921/pexels-photo-6260921.jpeg', 280.00,
  440, 20.00, 24.00, 24.00, 3.00, '1 plate (320 g)',  FALSE, TRUE,  2, 4.7
),
(
  'Tandoori Raan',
  'A whole leg of lamb marinated for 24 hours in saffron-yoghurt masala, then roasted in a clay tandoor until fall-off-the-bone tender. A festive chef showpiece.',
  1, 'https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg', 680.00,
  780, 62.00, 10.00, 52.00, 1.50, '½ leg (400 g)',    TRUE,  FALSE, 3, 5.0
),
(
  'Chole Bhature',
  'Pillowy, deep-fried sourdough bhature paired with slow-cooked spiced Bengal gram — a beloved street-food classic elevated with pickled onions and green chutney.',
  1, 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', 180.00,
  680, 22.00, 88.00, 24.00, 9.00, '2 bhature + 1 bowl', FALSE, TRUE, 2, 4.6
),

-- ── SOUTH INDIAN (category_id = 2) ──────────────────────────────────────────
(
  'Masala Dosa',
  'A crisp, golden rice crepe folded around a filling of spiced potato bhaji, accompanied by coconut chutney and a robust sambar — a South Indian icon.',
  2, 'https://images.pexels.com/photos/5560764/pexels-photo-5560764.jpeg', 130.00,
  380, 10.00, 62.00, 10.00, 5.50, '1 large dosa + sides', TRUE, TRUE, 2, 4.8
),
(
  'Chettinad Chicken Curry',
  'An intensely spiced dry-roasted masala of kalpasi, marathi mokku, and star anise slow-cooked with free-range chicken — bold, complex, and unforgettable.',
  2, 'https://images.pexels.com/photos/3590401/pexels-photo-3590401.jpeg', 350.00,
  490, 40.00, 18.00, 26.00, 4.00, '1 portion (320 g)', TRUE,  FALSE, 4, 4.9
),
(
  'Avial',
  'A medley of seasonal vegetables simmered in freshly ground coconut-cumin paste and finished with raw coconut oil and curry leaves — Kerala's signature treasure.',
  2, 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg', 160.00,
  220, 6.00,  28.00, 9.00,  8.00, '1 bowl (250 g)',   FALSE, TRUE,  1, 4.5
),
(
  'Idli Sambar Set',
  'Fluffy, steamed rice-lentil cakes served alongside a piping-hot toor dal sambar and a trio of chutneys. Light, gut-friendly, and supremely satisfying.',
  2, 'https://images.pexels.com/photos/5560760/pexels-photo-5560760.jpeg', 90.00,
  260, 9.00,  46.00, 4.50, 4.00, '3 idli + 1 bowl',  FALSE, TRUE,  1, 4.6
),

-- ── CONTINENTAL (category_id = 3) ─────────────────────────────────────────
(
  'Grilled Salmon Steak',
  'Norwegian salmon fillet seasoned with lemon-dill butter, grilled to a perfect medium, and plated with haricot verts, roasted cherry tomatoes, and béarnaise sauce.',
  3, 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg', 750.00,
  460, 44.00, 6.00,  28.00, 2.00, '1 fillet (280 g)', TRUE,  FALSE, 1, 4.9
),
(
  'Penne Arrabiata',
  'Al-dente penne tossed in a fiery San Marzano tomato sauce with Italian parsley, toasted garlic, and Calabrian chilli flakes — simplicity at its finest.',
  3, 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg', 320.00,
  510, 16.00, 78.00, 12.00, 4.00, '1 plate (340 g)',  FALSE, TRUE,  3, 4.6
),
(
  'Mushroom Risotto',
  'Carnaroli rice slowly ladled with a warm porcini stock, finished with truffle oil, aged Parmigiano-Reggiano, and sautéed wild mushrooms. Deeply umami.',
  3, 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg', 480.00,
  540, 14.00, 68.00, 20.00, 3.50, '1 bowl (380 g)',   TRUE,  TRUE,  1, 4.8
),
(
  'BBQ Chicken Burger',
  'A juicy flame-grilled chicken patty glazed with house-made smoky BBQ sauce, layered with aged cheddar, caramelised onions, and house pickles in a brioche bun.',
  3, 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg', 420.00,
  680, 38.00, 60.00, 30.00, 3.00, '1 burger (300 g)', FALSE, FALSE, 2, 4.7
),

-- ── HEALTHY / SALADS (category_id = 4) ─────────────────────────────────────
(
  'Quinoa Power Bowl',
  'Tri-colour quinoa tossed with roasted sweet potato, edamame, avocado, cherry tomatoes, and a tahini-lemon dressing. Gluten-free, protein-packed, plant-based.',
  4, 'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg', 360.00,
  390, 18.00, 48.00, 14.00, 9.00, '1 bowl (400 g)',   TRUE,  TRUE,  1, 4.8
),
(
  'Greek Salad',
  'Crisp Romaine, ripe Kalamata olives, cucumber ribbons, heirloom tomatoes, and generous crumbles of barrel-aged feta, drizzled with cold-pressed extra-virgin olive oil.',
  4, 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg', 240.00,
  210, 8.00,  16.00, 14.00, 4.00, '1 bowl (280 g)',   FALSE, TRUE,  1, 4.5
),
(
  'Detox Green Smoothie Bowl',
  'Blended spirulina, spinach, frozen mango, and banana topped with granola, chia seeds, fresh berries, and a drizzle of raw honey. Vibrant, energising, nourishing.',
  4, 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg', 280.00,
  310, 9.00,  52.00, 8.00,  7.50, '1 bowl (350 ml)',  TRUE,  TRUE,  1, 4.7
),
(
  'Grilled Chicken Cobb Salad',
  'Sliced grilled chicken breast, hard-boiled egg, crisp bacon bits, avocado, blue cheese, and cherry tomatoes on a bed of butter lettuce with ranch dressing.',
  4, 'https://images.pexels.com/photos/169075/pexels-photo-169075.jpeg', 380.00,
  430, 36.00, 12.00, 26.00, 5.00, '1 large bowl (380 g)', FALSE, FALSE, 1, 4.6
),

-- ── DESSERTS (category_id = 5) ──────────────────────────────────────────────
(
  'Gulab Jamun (Classic)',
  'Melt-in-the-mouth khoya dumplings fried to a deep-amber hue, soaked in rose-cardamom sugar syrup, and garnished with slivered pistachios. Served warm.',
  5, 'https://images.pexels.com/photos/5560770/pexels-photo-5560770.jpeg', 120.00,
  340, 6.00,  54.00, 10.00, 0.50, '3 pieces (150 g)',  TRUE,  TRUE,  1, 4.9
),
(
  'Tiramisu',
  'Classic Italian tiramisu with espresso-soaked savoiardi biscuits, layered between velvety mascarpone mousse, dusted with premium Valrhona cocoa powder.',
  5, 'https://images.unsplash.com/photo-1571115177098-24dfaa181514?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 280.00,
  380, 8.00,  36.00, 22.00, 0.80, '1 slice (160 g)',   TRUE,  TRUE,  1, 4.8
),
(
  'Mango Panna Cotta',
  'Silky vanilla-infused cream set to a delicate wobble, crowned with fresh Alphonso mango coulis and edible gold flakes — elegance on a plate.',
  5, 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg', 220.00,
  290, 5.00,  34.00, 14.00, 0.60, '1 ramekin (180 g)', FALSE, TRUE,  1, 4.7
),
(
  'Truffle Mushroom Pizza',
  'Wood-fired artisan pizza topped with wild mushrooms, mozzarella, and a drizzle of white truffle oil.',
  3, 'https://images.pexels.com/photos/1166120/pexels-photo-1166120.jpeg', 550.00,
  680, 22.00, 75.00, 32.00, 4.00, '1 pizza (10 inch)', TRUE, TRUE, 1, 4.8
),
(
  'Hyderabadi Chicken Biryani',
  'Fragrant basmati rice slow-cooked with marinated chicken, saffron, and rich aromatic spices in a sealed pot.',
  2, 'https://images.pexels.com/photos/973898/pexels-photo-973898.jpeg', 380.00,
  650, 42.00, 65.00, 24.00, 3.00, '1 portion (400 g)', TRUE, FALSE, 3, 4.9
),
(
  'Palak Paneer',
  'Fresh cottage cheese cubes simmered in a smooth, spiced spinach gravy enriched with cream.',
  1, 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg', 260.00,
  410, 18.00, 14.00, 32.00, 5.00, '1 bowl (300 g)', FALSE, TRUE, 2, 4.6
),
(
  'Spaghetti Carbonara',
  'Classic Roman pasta tossed with crispy pancetta, egg yolk, pecorino romano, and black pepper.',
  3, 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg', 420.00,
  580, 24.00, 62.00, 28.00, 3.00, '1 plate (350 g)', FALSE, FALSE, 2, 4.7
),
(
  'Szechuan Tofu Bowl',
  'Crispy tofu glazed in a spicy Szechuan sauce served over a bed of jasmine rice and steamed broccoli.',
  4, 'https://images.pexels.com/photos/3338537/pexels-photo-3338537.jpeg', 310.00,
  450, 22.00, 58.00, 16.00, 7.00, '1 bowl (380 g)', FALSE, TRUE, 3, 4.5
),
(
  'Classic New York Cheesecake',
  'Rich and creamy vanilla cheesecake baked on a buttery graham cracker crust.',
  5, 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg', 290.00,
  480, 8.00, 42.00, 32.00, 1.00, '1 slice (150 g)', TRUE, TRUE, 1, 4.8
),
(
  'Mutton Rogan Josh',
  'Tender morsels of lamb slow-braised in a robust gravy of Kashmiri chilies, fennel, and ginger.',
  1, 'https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg', 450.00,
  540, 45.00, 12.00, 34.00, 2.00, '1 portion (320 g)', TRUE, FALSE, 3, 4.9
),
(
  'Kerala Fish Curry',
  'Fresh kingfish simmered in a tangy, fiery coconut gravy flavored with kokum and curry leaves.',
  2, 'https://images.pexels.com/photos/3590401/pexels-photo-3590401.jpeg', 390.00,
  380, 32.00, 10.00, 24.00, 1.50, '1 bowl (300 g)', FALSE, FALSE, 4, 4.7
),
(
  'Mediterranean Falafel Wrap',
  'Crispy falafel, hummus, cucumber, and tahini drizzle wrapped in a warm whole-wheat pita.',
  4, 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg', 250.00,
  420, 14.00, 54.00, 18.00, 10.00, '1 wrap (250 g)', FALSE, TRUE, 1, 4.6
),
(
  'Chocolate Lava Cake',
  'Decadent dark chocolate cake with a molten, gooey center. Best paired with vanilla bean ice cream.',
  5, 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg', 220.00,
  410, 6.00, 48.00, 22.00, 2.00, '1 piece (120 g)', TRUE, TRUE, 1, 4.8
);

-- ---------------------------------------------------------
-- 5. Verification Queries (run after import to validate)
-- ---------------------------------------------------------
SELECT
  c.name            AS category,
  COUNT(f.item_id)  AS total_items,
  SUM(f.chef_special) AS chef_specials,
  ROUND(AVG(f.calories)) AS avg_calories
FROM categories c
LEFT JOIN food_items f ON f.category_id = c.category_id
GROUP BY c.category_id, c.name
ORDER BY c.display_order;

SELECT item_id, name, price_inr, calories, chef_special FROM food_items ORDER BY category_id, item_id;
