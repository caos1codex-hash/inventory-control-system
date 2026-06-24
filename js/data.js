/* ============================================
   DATA MODULE - LocalStorage Persistence
   Inventory Control System AAA
   ============================================ */

const DataStore = (() => {
    const KEYS = {
        PRODUCTS: 'ics_products',
        CATEGORIES: 'ics_categories',
        MOVEMENTS: 'ics_movements',
        SETTINGS: 'ics_settings',
        AUTH: 'ics_auth'
    };

    // Default categories
    const DEFAULT_CATEGORIES = [
        { id: 'cat-1', name: 'Electronica', color: '#3b82f6', icon: 'monitor' },
        { id: 'cat-2', name: 'Oficina', color: '#10b981', icon: 'briefcase' },
        { id: 'cat-3', name: 'Almacen', color: '#f59e0b', icon: 'warehouse' },
        { id: 'cat-4', name: 'Limpieza', color: '#8b5cf6', icon: 'sparkles' },
        { id: 'cat-5', name: 'Seguridad', color: '#ef4444', icon: 'shield' },
        { id: 'cat-6', name: 'Mobiliario', color: '#06b6d4', icon: 'armchair' }
    ];

    // Default products with realistic data
    const DEFAULT_PRODUCTS = [
        { id: 'prod-001', name: 'Monitor Dell 27"', sku: 'MON-DLL-27', category: 'cat-1', price: 349.99, cost: 220.00, stock: 45, minStock: 10, unit: 'unidad', description: 'Monitor IPS 27 pulgadas, resoluci\u00f3n 2560x1440, 60Hz', createdAt: '2025-01-15T10:30:00Z' },
        { id: 'prod-002', name: 'Teclado Mecanico Logitech', sku: 'TEC-LOG-MK', category: 'cat-1', price: 129.99, cost: 75.00, stock: 8, minStock: 15, unit: 'unidad', description: 'Teclado mecanico RGB, switches Brown, layout completo', createdAt: '2025-01-18T14:20:00Z' },
        { id: 'prod-003', name: 'Mouse Inalambrico MX Master', sku: 'MOU-LOG-MX', category: 'cat-1', price: 99.99, cost: 55.00, stock: 62, minStock: 20, unit: 'unidad', description: 'Mouse inalambrico ergon\u00f3mico, sensor 4000 DPI, recargable', createdAt: '2025-02-01T09:00:00Z' },
        { id: 'prod-004', name: 'Resma Papel A4 500 hojas', sku: 'PAF-RES-A4', category: 'cat-2', price: 8.99, cost: 5.20, stock: 200, minStock: 50, unit: 'unidad', description: 'Papel bond A4 75g, 500 hojas, blanqueado', createdAt: '2025-02-05T11:15:00Z' },
        { id: 'prod-005', name: 'Laptop HP ProBook 450', sku: 'LAP-HP-450', category: 'cat-1', price: 899.99, cost: 620.00, stock: 3, minStock: 5, unit: 'unidad', description: 'Laptop i5-13va gen, 16GB RAM, 512GB SSD, 15.6"', createdAt: '2025-02-10T16:45:00Z' },
        { id: 'prod-006', name: 'Silla Ergonomica Pro', sku: 'SIL-ERG-PRO', category: 'cat-6', price: 459.99, cost: 280.00, stock: 12, minStock: 5, unit: 'unidad', description: 'Silla ergonomica con soporte lumbar, reposabrazos 4D', createdAt: '2025-02-12T08:30:00Z' },
        { id: 'prod-007', name: 'Escritorio Standing Desk', sku: 'ESC-STD-160', category: 'cat-6', price: 599.99, cost: 350.00, stock: 0, minStock: 3, unit: 'unidad', description: 'Escritorio electrico ajustable 120-180cm, 160x80cm', createdAt: '2025-02-15T13:00:00Z' },
        { id: 'prod-008', name: 'Auriculares Noise Canceling', sku: 'AUR-SONY-NC', category: 'cat-1', price: 249.99, cost: 150.00, stock: 28, minStock: 10, unit: 'unidad', description: 'Auriculares inalambricos con cancelacion de ruido activa, 30h bateria', createdAt: '2025-02-20T10:00:00Z' },
        { id: 'prod-009', name: 'Cable HDMI 2m', sku: 'CAB-HDM-2M', category: 'cat-1', price: 12.99, cost: 4.50, stock: 150, minStock: 30, unit: 'unidad', description: 'Cable HDMI 2.1 de alta velocidad, 4K 120Hz', createdAt: '2025-03-01T09:00:00Z' },
        { id: 'prod-010', name: 'Detergente Multiuso 5L', sku: 'DET-MUL-5L', category: 'cat-4', price: 15.99, cost: 8.50, stock: 4, minStock: 10, unit: 'galon', description: 'Detergente concentrado multiuso, rendimiento 200L', createdAt: '2025-03-05T14:30:00Z' },
        { id: 'prod-011', name: 'Extintor Polvo ABC 5kg', sku: 'EXT-ABC-5K', category: 'cat-5', price: 45.99, cost: 28.00, stock: 18, minStock: 8, unit: 'unidad', description: 'Extintor de polvo quimico seco ABC, 5 kilogramos', createdAt: '2025-03-08T11:00:00Z' },
        { id: 'prod-012', name: 'Caja Archivo Legal', sku: 'CAJ-ARC-LEG', category: 'cat-2', price: 3.49, cost: 1.80, stock: 500, minStock: 100, unit: 'unidad', description: 'Caja de archivo legal corrugada con tapa', createdAt: '2025-03-10T15:20:00Z' },
        { id: 'prod-013', name: 'Camara Seguridad IP', sku: 'CAM-SEC-IP', category: 'cat-5', price: 179.99, cost: 95.00, stock: 2, minStock: 5, unit: 'unidad', description: 'Camara IP WiFi 1080p, vision nocturna, deteccion movimiento', createdAt: '2025-03-12T10:45:00Z' },
        { id: 'prod-014', name: 'Toner HP LaserJet', sku: 'TON-HP-LJ', category: 'cat-2', price: 89.99, cost: 52.00, stock: 7, minStock: 8, unit: 'unidad', description: 'Cartucho toner negro compatible HP LaserJet Pro, 2500 paginas', createdAt: '2025-03-15T09:30:00Z' },
        { id: 'prod-015', name: 'Ethernet Cat6 10m', sku: 'CAB-ETH-10', category: 'cat-1', price: 9.99, cost: 3.80, stock: 85, minStock: 20, unit: 'unidad', description: 'Cable de red Cat6 UTP, 10 metros, conector RJ45', createdAt: '2025-03-18T14:00:00Z' }
    ];

    // Default movements
    const DEFAULT_MOVEMENTS = [
        { id: 'mov-001', productId: 'prod-001', type: 'entrada', quantity: 50, reason: 'Compra inicial proveedor', user: 'Admin', date: '2025-01-15T10:35:00Z' },
        { id: 'mov-002', productId: 'prod-001', type: 'salida', quantity: 5, reason: 'Asignacion departamento desarrollo', user: 'Admin', date: '2025-02-01T09:00:00Z' },
        { id: 'mov-003', productId: 'prod-004', type: 'entrada', quantity: 300, reason: 'Reposicion mensual', user: 'Admin', date: '2025-02-05T11:20:00Z' },
        { id: 'mov-004', productId: 'prod-004', type: 'salida', quantity: 100, reason: 'Distribucion a todas las areas', user: 'Admin', date: '2025-02-15T08:00:00Z' },
        { id: 'mov-005', productId: 'prod-005', type: 'entrada', quantity: 10, reason: 'Compra lote corporativo', user: 'Admin', date: '2025-02-10T17:00:00Z' },
        { id: 'mov-006', productId: 'prod-005', type: 'salida', quantity: 7, reason: 'Asignacion equipo gerencial', user: 'Admin', date: '2025-03-01T10:00:00Z' },
        { id: 'mov-007', productId: 'prod-003', type: 'entrada', quantity: 80, reason: 'Stock inicial', user: 'Admin', date: '2025-02-01T09:05:00Z' },
        { id: 'mov-008', productId: 'prod-003', type: 'salida', quantity: 18, reason: 'Asignacion general oficinas', user: 'Admin', date: '2025-02-20T14:00:00Z' },
        { id: 'mov-009', productId: 'prod-006', type: 'entrada', quantity: 15, reason: 'Equipamiento nueva sede', user: 'Admin', date: '2025-02-12T09:00:00Z' },
        { id: 'mov-010', productId: 'prod-006', type: 'salida', quantity: 3, reason: 'Sala de reuniones principal', user: 'Admin', date: '2025-03-05T11:00:00Z' },
        { id: 'mov-011', productId: 'prod-002', type: 'entrada', quantity: 25, reason: 'Reemplazo equipo antiguo', user: 'Admin', date: '2025-01-18T14:25:00Z' },
        { id: 'mov-012', productId: 'prod-002', type: 'salida', quantity: 17, reason: 'Distribucion equipo desarrollo', user: 'Admin', date: '2025-02-28T10:00:00Z' },
        { id: 'mov-013', productId: 'prod-008', type: 'entrada', quantity: 40, reason: 'Compra proveedor', user: 'Admin', date: '2025-02-20T10:05:00Z' },
        { id: 'mov-014', productId: 'prod-008', type: 'salida', quantity: 12, reason: 'Asignacion call center', user: 'Admin', date: '2025-03-10T09:00:00Z' },
        { id: 'mov-015', productId: 'prod-007', type: 'entrada', quantity: 5, reason: 'Compra inicial mobiliario', user: 'Admin', date: '2025-02-15T13:05:00Z' },
        { id: 'mov-016', productId: 'prod-007', type: 'salida', quantity: 5, reason: 'Instalacion oficinas nuevas', user: 'Admin', date: '2025-03-01T15:00:00Z' },
        { id: 'mov-017', productId: 'prod-009', type: 'entrada', quantity: 200, reason: 'Stock cableado de red', user: 'Admin', date: '2025-03-01T09:05:00Z' },
        { id: 'mov-018', productId: 'prod-009', type: 'salida', quantity: 50, reason: 'Instalacion red nueva sede', user: 'Admin', date: '2025-03-15T16:00:00Z' },
        { id: 'mov-019', productId: 'prod-010', type: 'entrada', quantity: 20, reason: 'Reposicion limpieza', user: 'Admin', date: '2025-03-05T14:35:00Z' },
        { id: 'mov-020', productId: 'prod-010', type: 'salida', quantity: 16, reason: 'Consumo mensual areas comunes', user: 'Admin', date: '2025-03-20T08:00:00Z' },
        { id: 'mov-021', productId: 'prod-011', type: 'entrada', quantity: 20, reason: 'Equipamiento seguridad', user: 'Admin', date: '2025-03-08T11:05:00Z' },
        { id: 'mov-022', productId: 'prod-011', type: 'salida', quantity: 2, reason: 'Instalacion pisos 1 y 2', user: 'Admin', date: '2025-03-18T10:00:00Z' },
        { id: 'mov-023', productId: 'prod-013', type: 'entrada', quantity: 10, reason: 'Sistema de vigilancia', user: 'Admin', date: '2025-03-12T10:50:00Z' },
        { id: 'mov-024', productId: 'prod-013', type: 'salida', quantity: 8, reason: 'Instalacion perimetral', user: 'Admin', date: '2025-03-19T14:00:00Z' },
        { id: 'mov-025', productId: 'prod-014', type: 'entrada', quantity: 15, reason: 'Reposicion impresoras', user: 'Admin', date: '2025-03-15T09:35:00Z' },
        { id: 'mov-026', productId: 'prod-014', type: 'salida', quantity: 8, reason: 'Distribucion area administrativa', user: 'Admin', date: '2025-03-22T11:00:00Z' }
    ];

    function generateId(prefix = 'id') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    function save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('DataStore save error:', e);
            return false;
        }
    }

    function load(key, fallback = []) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : fallback;
        } catch (e) {
            console.error('DataStore load error:', e);
            return fallback;
        }
    }

    function initialize() {
        if (!localStorage.getItem(KEYS.PRODUCTS)) {
            save(KEYS.PRODUCTS, DEFAULT_PRODUCTS);
        }
        if (!localStorage.getItem(KEYS.CATEGORIES)) {
            save(KEYS.CATEGORIES, DEFAULT_CATEGORIES);
        }
        if (!localStorage.getItem(KEYS.MOVEMENTS)) {
            save(KEYS.MOVEMENTS, DEFAULT_MOVEMENTS);
        }
        if (!localStorage.getItem(KEYS.SETTINGS)) {
            save(KEYS.SETTINGS, { theme: 'light', currency: 'USD', lowStockThreshold: 0.5 });
        }
    }

    function reset() {
        save(KEYS.PRODUCTS, DEFAULT_PRODUCTS);
        save(KEYS.CATEGORIES, DEFAULT_CATEGORIES);
        save(KEYS.MOVEMENTS, DEFAULT_MOVEMENTS);
        save(KEYS.SETTINGS, { theme: 'light', currency: 'USD', lowStockThreshold: 0.5 });
    }

    // Products API
    const Products = {
        getAll: () => load(KEYS.PRODUCTS),
        getById: (id) => load(KEYS.PRODUCTS).find(p => p.id === id),
        getByCategory: (catId) => load(KEYS.PRODUCTS).filter(p => p.category === catId),
        getLowStock: () => load(KEYS.PRODUCTS).filter(p => p.stock <= p.minStock),
        getOutOfStock: () => load(KEYS.PRODUCTS).filter(p => p.stock === 0),
        create: (product) => {
            const products = load(KEYS.PRODUCTS);
            const newProduct = {
                ...product,
                id: generateId('prod'),
                createdAt: new Date().toISOString()
            };
            products.push(newProduct);
            save(KEYS.PRODUCTS, products);
            return newProduct;
        },
        update: (id, updates) => {
            const products = load(KEYS.PRODUCTS);
            const index = products.findIndex(p => p.id === id);
            if (index === -1) return null;
            products[index] = { ...products[index], ...updates };
            save(KEYS.PRODUCTS, products);
            return products[index];
        },
        delete: (id) => {
            const products = load(KEYS.PRODUCTS);
            const filtered = products.filter(p => p.id !== id);
            if (filtered.length === products.length) return false;
            save(KEYS.PRODUCTS, filtered);
            return true;
        },
        search: (query) => {
            const q = query.toLowerCase();
            return load(KEYS.PRODUCTS).filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.sku.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q)
            );
        },
        getTotalStockValue: () => {
            return load(KEYS.PRODUCTS).reduce((sum, p) => sum + (p.price * p.stock), 0);
        },
        getTotalCostValue: () => {
            return load(KEYS.PRODUCTS).reduce((sum, p) => sum + (p.cost * p.stock), 0);
        }
    };

    // Categories API
    const Categories = {
        getAll: () => load(KEYS.CATEGORIES),
        getById: (id) => load(KEYS.CATEGORIES).find(c => c.id === id),
        create: (category) => {
            const categories = load(KEYS.CATEGORIES);
            const newCat = { ...category, id: generateId('cat') };
            categories.push(newCat);
            save(KEYS.CATEGORIES, categories);
            return newCat;
        },
        update: (id, updates) => {
            const categories = load(KEYS.CATEGORIES);
            const index = categories.findIndex(c => c.id === id);
            if (index === -1) return null;
            categories[index] = { ...categories[index], ...updates };
            save(KEYS.CATEGORIES, categories);
            return categories[index];
        },
        delete: (id) => {
            const categories = load(KEYS.CATEGORIES);
            save(KEYS.CATEGORIES, categories.filter(c => c.id !== id));
        },
        getProductCount: (catId) => load(KEYS.PRODUCTS).filter(p => p.category === catId).length
    };

    // Movements API
    const Movements = {
        getAll: () => load(KEYS.MOVEMENTS),
        getByProduct: (productId) => load(KEYS.MOVEMENTS).filter(m => m.productId === productId),
        getRecent: (limit = 10) => {
            return load(KEYS.MOVEMENTS)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, limit);
        },
        getByDateRange: (startDate, endDate) => {
            return load(KEYS.MOVEMENTS).filter(m => {
                const d = new Date(m.date);
                return d >= new Date(startDate) && d <= new Date(endDate);
            });
        },
        getByType: (type) => load(KEYS.MOVEMENTS).filter(m => m.type === type),
        create: (movement) => {
            const movements = load(KEYS.MOVEMENTS);
            const products = load(KEYS.PRODUCTS);
            const product = products.find(p => p.id === movement.productId);

            if (!product) return { error: 'Producto no encontrado' };

            const newMovement = {
                ...movement,
                id: generateId('mov'),
                date: new Date().toISOString(),
                user: 'Admin'
            };

            if (movement.type === 'entrada') {
                product.stock += movement.quantity;
            } else if (movement.type === 'salida') {
                if (product.stock < movement.quantity) {
                    return { error: 'Stock insuficiente' };
                }
                product.stock -= movement.quantity;
            }

            save(KEYS.PRODUCTS, products);
            movements.push(newMovement);
            save(KEYS.MOVEMENTS, movements);
            return newMovement;
        },
        getTotalEntradas: () => {
            return load(KEYS.MOVEMENTS)
                .filter(m => m.type === 'entrada')
                .reduce((sum, m) => sum + m.quantity, 0);
        },
        getTotalSalidas: () => {
            return load(KEYS.MOVEMENTS)
                .filter(m => m.type === 'salida')
                .reduce((sum, m) => sum + m.quantity, 0);
        },
        delete: (id) => {
            const movements = load(KEYS.MOVEMENTS);
            save(KEYS.MOVEMENTS, movements.filter(m => m.id !== id));
            return true;
        }
    };

    // Settings API
    const Settings = {
        get: () => load(KEYS.SETTINGS, { theme: 'light', currency: 'USD' }),
        update: (updates) => {
            const settings = load(KEYS.SETTINGS, { theme: 'light', currency: 'USD' });
            save(KEYS.SETTINGS, { ...settings, ...updates });
            return { ...settings, ...updates };
        }
    };

    return { initialize, reset, Products, Categories, Movements, Settings, generateId };
})();