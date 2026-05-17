const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { mockFoods } = require('./mockData');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'culinary_portfolio',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper to check DB connection on startup
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to the MySQL database.');
        connection.release();
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
    }
})();

// --- API ROUTES ---

// GET /api/foods - Fetches all food items with their category names.
app.get('/api/foods', async (req, res) => {
    try {
        const query = `
            SELECT f.*, c.name as category_name 
            FROM food_items f
            JOIN categories c ON f.category_id = c.category_id
            ORDER BY f.category_id, f.item_id
        `;
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Database connection failed, using mock data for /api/foods.');
        res.status(200).json(mockFoods);
    }
});

// GET /api/foods/category/:id - Dynamically filters items by category.
app.get('/api/foods/category/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT f.*, c.name as category_name 
            FROM food_items f
            JOIN categories c ON f.category_id = c.category_id
            WHERE f.category_id = ?
        `;
        const [rows] = await pool.query(query, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No items found for this category' });
        }
        res.status(200).json(rows);
    } catch (error) {
        console.error('Database connection failed, using mock data for category filter.');
        const { id } = req.params;
        const filtered = mockFoods.filter(f => f.category_id == id);
        res.status(200).json(filtered);
    }
});

// GET /api/foods/:id - Fetch single item (Needed for the frontend modal)
app.get('/api/foods/item/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT f.*, c.name as category_name 
            FROM food_items f
            JOIN categories c ON f.category_id = c.category_id
            WHERE f.item_id = ?
        `;
        const [rows] = await pool.query(query, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Database connection failed, using mock data for single item.');
        const { id } = req.params;
        const item = mockFoods.find(f => f.item_id == id);
        if (item) {
            res.status(200).json(item);
        } else {
            res.status(404).json({ error: 'Item not found in mock data' });
        }
    }
});

// POST /api/recommend - Accepts JSON payload (max_calories, min_protein, max_carbs)
app.post('/api/recommend', async (req, res) => {
    try {
        const { max_calories, min_protein, max_carbs } = req.body;
        
        // Basic validation
        if (max_calories === undefined || min_protein === undefined || max_carbs === undefined) {
            return res.status(400).json({ error: 'Missing required preference parameters.' });
        }

        const query = `
            SELECT f.*, c.name as category_name 
            FROM food_items f
            JOIN categories c ON f.category_id = c.category_id
            WHERE f.calories <= ? 
              AND f.protein_g >= ? 
              AND f.carbs_g <= ?
        `;
        
        const [rows] = await pool.query(query, [max_calories, min_protein, max_carbs]);
        
        // Custom logic: sort by closest match (e.g., highest protein-to-calorie ratio)
        // Or simple score: closer to max_calories = better match
        rows.sort((a, b) => {
            const scoreA = a.protein_g / (a.calories || 1);
            const scoreB = b.protein_g / (b.calories || 1);
            return scoreB - scoreA; // Sort descending by protein efficiency
        });

        res.status(200).json(rows);
    } catch (error) {
        console.error('Database connection failed, using mock data for /api/recommend.');
        const { max_calories, min_protein, max_carbs } = req.body;
        let filtered = mockFoods.filter(f => f.calories <= max_calories && f.protein_g >= min_protein && f.carbs_g <= max_carbs);
        filtered.sort((a, b) => {
            const scoreA = a.protein_g / (a.calories || 1);
            const scoreB = b.protein_g / (b.calories || 1);
            return scoreB - scoreA;
        });
        res.status(200).json(filtered);
    }
});

// Fallback error handler
app.use((err, req, res, next) => {
    console.error('Unhandled application error:', err.stack);
    res.status(500).send('Something broke!');
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
