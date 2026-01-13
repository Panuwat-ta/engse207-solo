// public/js/api.js - API Client for Product Management
class ProductAPI {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }
    
    async getAllProducts(category = null) {
        let url = `${this.baseURL}/products`;
        if (category) {
            url += `?category=${category}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        return await response.json();
    }
    
    async getProductById(id) {
        const response = await fetch(`${this.baseURL}/products/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch product');
        }
        return await response.json();
    }
    
    async createProduct(productData) {
        const response = await fetch(`${this.baseURL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }
        
        return await response.json();
    }
    
    async updateProduct(id, productData) {
        const response = await fetch(`${this.baseURL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }
        
        return await response.json();
    }
    
    async deleteProduct(id) {
        const response = await fetch(`${this.baseURL}/products/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }
        
        return await response.json();
    }
}

// Initialize API client
const api = new ProductAPI('/api');



// public/js/app.js - Main Application Logic
let currentFilter = 'all';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadProducts();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('add-btn').addEventListener('click', showAddModal);
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;
            filterProducts(filter);
        });
    });
    
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('cancel-btn').addEventListener('click', closeModal);
    document.getElementById('product-form').addEventListener('submit', handleSubmit);
}

// Load products
async function loadProducts(category = null) {
    try {
        showLoading();
        
        const data = await api.getAllProducts(category);
        
        displayProducts(data.products);
        updateStatistics(data.products, data.totalValue);
        
        hideLoading();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load products: ' + error.message);
        hideLoading();
    }
}

// Display products
function displayProducts(products) {
    const container = document.getElementById('product-list');
    
    if (products.length === 0) {
        container.innerHTML = '<div class="no-products">📦 No products found</div>';
        return;
    }
    
    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card">
            <h3>${escapeHtml(product.name)}</h3>
            <span class="category-badge category-${product.category.toLowerCase()}">
                ${escapeHtml(product.category)}
            </span>
            
            <div class="product-info">
                <div class="info-row">
                    <span class="info-label">💰 Price:</span>
                    <span class="info-value">฿${product.price.toFixed(2)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">📦 Stock:</span>
                    <span class="info-value">${product.stock} units</span>
                </div>
                <div class="info-row">
                    <span class="info-label">💵 Value:</span>
                    <span class="info-value">฿${(product.price * product.stock).toFixed(2)}</span>
                </div>
            </div>
            
            <div class="actions">
                <button class="btn btn-secondary" onclick="editProduct(${product.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        </div>
    `;
}

// Update statistics
function updateStatistics(products, totalValue) {
    document.getElementById('stat-total').textContent = products.length;
    document.getElementById('stat-value').textContent = '฿' + parseFloat(totalValue).toFixed(2);
}

// Filter products
function filterProducts(category) {
    currentFilter = category;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === category) {
            btn.classList.add('active');
        }
    });
    
    loadProducts(category === 'all' ? null : category);
}

// Show/hide loading
function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('product-list').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('product-list').style.display = 'grid';
}

// Modal functions
function showAddModal() {
    document.getElementById('modal-title').textContent = 'Add New Product';
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('product-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
}

// Form submit
async function handleSubmit(event) {
    event.preventDefault();
    
    const id = document.getElementById('product-id').value;
    const productData = {
        name: document.getElementById('name').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value
    };
    
    try {
        if (id) {
            await api.updateProduct(id, productData);
            alert('Product updated successfully!');
        } else {
            await api.createProduct(productData);
            alert('Product added successfully!');
        }
        
        closeModal();
        loadProducts(currentFilter === 'all' ? null : currentFilter);
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Edit product
async function editProduct(id) {
    try {
        const product = await api.getProductById(id);
        
        document.getElementById('modal-title').textContent = 'Edit Product';
        document.getElementById('product-id').value = product.id;
        document.getElementById('name').value = product.name;
        document.getElementById('price').value = product.price;
        document.getElementById('stock').value = product.stock;
        document.getElementById('category').value = product.category;
        
        document.getElementById('product-modal').style.display = 'flex';
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Delete product
async function deleteProduct(id) {
    if (!confirm('Are you sure?')) return;
    
    try {
        await api.deleteProduct(id);
        alert('Product deleted successfully!');
        loadProducts(currentFilter === 'all' ? null : currentFilter);
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}