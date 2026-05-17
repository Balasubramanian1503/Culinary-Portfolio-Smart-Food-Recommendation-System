const API_URL = 'http://localhost:3000/api';

// DOM Elements
const foodGrid = document.getElementById('food-grid');
const menuFilters = document.getElementById('menu-filters');
const searchInput = document.getElementById('search-input');

// Dashboard Elements
const toggleDashboardBtn = document.getElementById('toggle-dashboard');
const closeDashboardBtn = document.getElementById('close-dashboard');
const smartDashboard = document.getElementById('smart-dashboard');
const dashboardOverlay = document.getElementById('dashboard-overlay');
const calorieSlider = document.getElementById('calorie-slider');
const calValue = document.getElementById('cal-value');
const applyRecommendationsBtn = document.getElementById('apply-recommendations');

// Modal Elements
const macrosModal = document.getElementById('macros-modal');
const modalContent = document.getElementById('modal-content');
const closeModalBtn = document.getElementById('close-modal');

// Cart Elements
const toggleCartBtn = document.getElementById('toggle-cart');
const closeCartBtn = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');

let allFoodItems = [];
let currentFilter = 'all';
let cart = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initDashboard();
    initCart();
    fetchAllFoodItems();
    
    // Modal Listeners
    closeModalBtn.addEventListener('click', closeMacrosModal);
    macrosModal.addEventListener('click', (e) => {
        if (e.target === macrosModal) closeMacrosModal();
    });

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
        } else {
            nav.style.boxShadow = 'none';
        }
    });
});

// Animations
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
}

// Dashboard Logic
function initDashboard() {
    // Open/Close
    toggleDashboardBtn.addEventListener('click', (e) => {
        e.preventDefault();
        smartDashboard.classList.add('open');
        dashboardOverlay.classList.add('show');
    });

    closeDashboardBtn.addEventListener('click', () => {
        smartDashboard.classList.remove('open');
        dashboardOverlay.classList.remove('show');
    });

    dashboardOverlay.addEventListener('click', () => {
        smartDashboard.classList.remove('open');
        cartSidebar.classList.remove('open');
        dashboardOverlay.classList.remove('show');
    });

    // Calorie Slider Update
    calorieSlider.addEventListener('input', (e) => {
        calValue.textContent = `${e.target.value} kcal`;
    });

    // Toggle Pills
    document.querySelectorAll('.toggle-pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            // If it's a nutritional goal, make it exclusive
            if(pill.dataset.goal) {
                document.querySelectorAll('[data-goal]').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
            } else {
                // Preferences can be multiple
                pill.classList.toggle('active');
            }
        });
    });

    // Apply Recommendations
    applyRecommendationsBtn.addEventListener('click', async () => {
        const maxCal = parseInt(calorieSlider.value);
        smartDashboard.classList.remove('open');
        dashboardOverlay.classList.remove('show');
        
        // Filter UI
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        if (searchInput) searchInput.value = '';
        
        // Show loading in grid
        foodGrid.innerHTML = '<p style="grid-column:1/-1; text-align:center;">Analyzing nutritional profiles...</p>';

        try {
            // Determine params based on active pills
            const activeGoal = document.querySelector('.toggle-pill[data-goal].active')?.dataset.goal || 'balanced';
            
            let minProtein = 0;
            let maxCarbs = 999;

            if (activeGoal === 'high-protein') minProtein = 25;
            if (activeGoal === 'low-carb') maxCarbs = 20;

            const payload = {
                max_calories: maxCal,
                min_protein: minProtein,
                max_carbs: maxCarbs
            };

            const response = await fetch(`${API_URL}/recommend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Recommendation API failed');
            
            const recommended = await response.json();
            renderFoodItems(recommended);
        } catch(error) {
            console.error(error);
            foodGrid.innerHTML = '<p style="color:var(--color-terracotta); text-align:center; grid-column:1/-1;">Error fetching recommendations.</p>';
        }
        
        // Scroll to menu
        document.getElementById('menu').scrollIntoView({behavior: 'smooth'});
    });
}

// Fetch & Render
async function fetchAllFoodItems() {
    try {
        const response = await fetch(`${API_URL}/foods`);
        if (!response.ok) throw new Error('API Error');
        allFoodItems = await response.json();
        
        setupFilters();
        renderFoodItems(allFoodItems);
    } catch (error) {
        console.error(error);
        foodGrid.innerHTML = '<p style="color:var(--color-terracotta); text-align:center; grid-column:1/-1; padding: 2rem;">Unable to connect to the database. Ensure backend is running.</p>';
    }
}

function setupFilters() {
    menuFilters.innerHTML = `
        <button class="filter-tab active" data-filter="all">All Expressions</button>
        <button class="filter-tab" data-filter="specials">Chef's Signatures</button>
    `;

    // Extract unique categories
    const categories = [...new Set(allFoodItems.map(item => item.category_name))];
    
    categories.forEach(cat => {
        if(cat) {
            const btn = document.createElement('button');
            btn.className = 'filter-tab';
            btn.dataset.filter = cat;
            btn.textContent = cat;
            menuFilters.appendChild(btn);
        }
    });

    // Add filter logic
    menuFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-tab')) {
            document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // clear search when clicking filters
            if(searchInput) searchInput.value = '';
            
            currentFilter = e.target.dataset.filter;
            applyFiltersAndSearch();
        }
    });
    
    // Add search logic
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            applyFiltersAndSearch();
        });
    }
}

function applyFiltersAndSearch() {
    let filtered = allFoodItems;
    
    // Apply Category/Special Filter
    if (currentFilter === 'specials') {
        filtered = filtered.filter(item => item.chef_special);
    } else if (currentFilter !== 'all') {
        filtered = filtered.filter(item => item.category_name === currentFilter);
    }
    
    // Apply Search
    if (searchInput && searchInput.value.trim() !== '') {
        const query = searchInput.value.toLowerCase().trim();
        filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(query) || 
            item.description.toLowerCase().includes(query)
        );
    }
    
    renderFoodItems(filtered);
}

function renderFoodItems(items) {
    foodGrid.innerHTML = '';
    
    if (items.length === 0) {
        foodGrid.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding: 2rem;">No items match your criteria.</p>';
        return;
    }

    items.forEach(item => {
        const price = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price_inr);
        let badgeHtml = '';
        if (item.chef_special) {
            badgeHtml = '<div class="card-badge special">Chef Special</div>';
        } else if (item.category_name) {
            badgeHtml = `<div class="card-badge">${item.category_name}</div>`;
        }

        const card = document.createElement('div');
        card.className = 'food-card';
        card.innerHTML = `
            <div class="card-img-wrapper">
                ${badgeHtml}
                <img src="${item.image_url}" alt="${item.name}" class="card-img" onerror="this.src='https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'">
            </div>
            <div class="card-content">
                <div class="card-header">
                    <h3 class="card-title">${item.name}</h3>
                    <span class="card-price">${price}</span>
                </div>
                <p class="card-desc">${item.description}</p>
                <div style="margin-top: auto; padding-top: 1.5rem; border-top: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.85rem; color: var(--color-charcoal); font-weight: 500;">
                        <i class="fa-solid fa-fire" style="color: var(--color-terracotta)"></i> ${item.calories} kcal
                    </span>
                    <button class="btn-macros" onclick="openMacrosModal(${item.item_id})">
                        View Macros <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
        foodGrid.appendChild(card);
    });
}

// Modal Logic
async function openMacrosModal(id) {
    macrosModal.classList.add('show');
    modalContent.innerHTML = '<div style="display:flex; justify-content:center; align-items:center; width:100%; min-height:400px;"><i class="fa-solid fa-spinner fa-spin fa-2x" style="color:var(--color-terracotta)"></i></div>';
    
    try {
        const response = await fetch(`${API_URL}/foods/item/${id}`);
        if (!response.ok) throw new Error('Network error');
        const item = await response.json();
        
        modalContent.innerHTML = `
            <div class="modal-img-pane">
                <img src="${item.image_url}" alt="${item.name}" onerror="this.src='https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'">
            </div>
            <div class="modal-info-pane">
                <span class="sage-text" style="text-transform: uppercase; letter-spacing: 1px; font-size: 0.85rem;">${item.category_name}</span>
                <h2 style="font-size: 2.5rem; margin: 0.5rem 0 1.5rem; letter-spacing:-1px;">${item.name}</h2>
                <p style="color: var(--color-muted); line-height: 1.8;">${item.description}</p>
                
                <div class="macro-grid">
                    <div class="macro-item">
                        <div class="macro-label">Calories</div>
                        <div class="macro-val">${item.calories} kcal</div>
                    </div>
                    <div class="macro-item">
                        <div class="macro-label">Protein</div>
                        <div class="macro-val">${item.protein_g}g</div>
                    </div>
                    <div class="macro-item">
                        <div class="macro-label">Carbs</div>
                        <div class="macro-val">${item.carbs_g}g</div>
                    </div>
                    <div class="macro-item">
                        <div class="macro-label">Fats</div>
                        <div class="macro-val">${item.fats_g}g</div>
                    </div>
                </div>
                
                <div style="margin-top: 2.5rem; display:flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="font-size:0.85rem; color:var(--color-muted); display:block;">Serving Size</span>
                        <span style="font-weight:600;">${item.serving_size}</span>
                    </div>
                    <button class="btn-primary" style="padding: 0.8rem 2rem;" onclick="addToCart(${item.item_id})">Order Now</button>
                </div>
            </div>
        `;
    } catch (error) {
        modalContent.innerHTML = '<div style="padding: 3rem; text-align: center; color: var(--color-terracotta);">Failed to load macros.</div>';
    }
}

function closeMacrosModal() {
    macrosModal.classList.remove('show');
}

// Cart Logic
function initCart() {
    toggleCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cartSidebar.classList.add('open');
        dashboardOverlay.classList.add('show');
    });

    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        dashboardOverlay.classList.remove('show');
    });
    
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if(cart.length === 0) return;
        alert('Order placed successfully! This is a mock checkout.');
        cart = [];
        updateCartUI();
        cartSidebar.classList.remove('open');
        dashboardOverlay.classList.remove('show');
    });
}

window.addToCart = function(itemId) {
    const item = allFoodItems.find(f => f.item_id === itemId);
    if (!item) return;

    const existing = cart.find(c => c.item_id === itemId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCartUI();
    closeMacrosModal();
    cartSidebar.classList.add('open');
    dashboardOverlay.classList.add('show');
};

window.updateCartQty = function(itemId, change) {
    const existing = cart.find(c => c.item_id === itemId);
    if (existing) {
        existing.quantity += change;
        if (existing.quantity <= 0) {
            cart = cart.filter(c => c.item_id !== itemId);
        }
    }
    updateCartUI();
};

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--color-muted); margin-top: 2rem;">Your cart is empty.</p>';
        cartTotal.textContent = '₹0.00';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let totalValue = 0;

    cart.forEach(item => {
        totalValue += item.price_inr * item.quantity;
        const priceFmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price_inr);
        
        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML = `
            <img src="${item.image_url}" class="cart-item-img" onerror="this.src='https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${priceFmt}</div>
                <div class="cart-qty-controls">
                    <button class="btn-qty" onclick="updateCartQty(${item.item_id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn-qty" onclick="updateCartQty(${item.item_id}, 1)">+</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(el);
    });

    cartTotal.textContent = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalValue);
}
