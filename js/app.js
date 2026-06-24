/* ============================================
   APP MODULE - Main Controller
   Inventory Control System AAA
   ============================================ */

let currentPage = 'dashboard';

const App = (() => {
    const pageTitles = {
        dashboard: 'Dashboard',
        products: 'Productos',
        movements: 'Movimientos',
        reports: 'Reportes',
        alerts: 'Alertas de Stock'
    };

    function init() {
        // Initialize data
        DataStore.initialize();

        // Load theme
        const settings = DataStore.Settings.get();
        applyTheme(settings.theme);

        // Navigate to dashboard
        navigate('dashboard');

        // Update alert badge
        updateAlertBadge();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    function navigate(page) {
        // Destroy dashboard charts if leaving
        if (currentPage === 'dashboard' && page !== 'dashboard') {
            Dashboard.destroyCharts();
        }

        currentPage = page;

        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.nav === page);
        });

        // Update page title
        const titleEl = document.getElementById('page-title');
        if (titleEl) titleEl.textContent = pageTitles[page] || page;

        // Close sidebar on mobile
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (window.innerWidth < 1024) {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        }

        // Render page
        const content = document.getElementById('content-area');
        if (content) content.scrollTop = 0;

        switch (page) {
            case 'dashboard': Dashboard.render(); break;
            case 'products': Products.render(); break;
            case 'movements': Movements.render(); break;
            case 'reports': Reports.render(); break;
            case 'alerts': renderAlertsPage(); break;
            default: Dashboard.render();
        }

        updateAlertBadge();
    }

    function renderAlertsPage() {
        const lowStock = DataStore.Products.getLowStock();
        const outOfStock = DataStore.Products.getOutOfStock();
        const allAlerts = [
            ...outOfStock.map(p => ({ ...p, alertLevel: 'critical' })),
            ...lowStock.filter(p => p.stock > 0).map(p => ({ ...p, alertLevel: 'warning' }))
        ];

        const content = document.getElementById('content-area');
        content.innerHTML = `
            <div class="page-enter">
                <!-- Summary -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div class="kpi-card slide-up" style="animation-delay:0ms">
                        <div class="flex items-center gap-3">
                            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10">
                                <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
                            </div>
                            <div>
                                <p class="text-xl font-bold text-red-500">${outOfStock.length}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Agotados</p>
                            </div>
                        </div>
                    </div>
                    <div class="kpi-card slide-up" style="animation-delay:80ms">
                        <div class="flex items-center gap-3">
                            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10">
                                <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01"/></svg>
                            </div>
                            <div>
                                <p class="text-xl font-bold text-amber-500">${lowStock.filter(p => p.stock > 0).length}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Stock bajo</p>
                            </div>
                        </div>
                    </div>
                    <div class="kpi-card slide-up" style="animation-delay:160ms">
                        <div class="flex items-center gap-3">
                            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
                                <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </div>
                            <div>
                                <p class="text-xl font-bold text-emerald-500">${DataStore.Products.getAll().length - allAlerts.length}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Sin alertas</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Alert List -->
                ${allAlerts.length === 0 ? `
                    <div class="card">
                        <div class="empty-state py-12">
                            <svg class="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <p class="text-lg font-medium text-gray-400">Sin alertas activas</p>
                            <p class="text-sm text-gray-400 mt-1">Todos los productos tienen stock suficiente</p>
                        </div>
                    </div>
                ` : `
                    <div class="space-y-3">
                        ${allAlerts.map(p => {
                            const cat = DataStore.Categories.getById(p.category);
                            const isCritical = p.alertLevel === 'critical';
                            return `
                                <div class="card ${isCritical ? 'border-red-200 dark:border-red-900/30' : 'border-amber-200 dark:border-amber-900/30'} flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div class="flex items-center gap-3 flex-1 min-w-0">
                                        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style="background: ${isCritical ? '#ef4444' : '#f59e0b'}">
                                            ${isCritical ? '!' : '!'}
                                        </div>
                                        <div class="min-w-0">
                                            <p class="font-semibold text-gray-900 dark:text-white truncate">${p.name}</p>
                                            <div class="flex items-center gap-2 mt-0.5">
                                                <code class="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">${p.sku}</code>
                                                ${cat ? `<span class="text-xs text-gray-400">${cat.name}</span>` : ''}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-6 flex-shrink-0">
                                        <div class="text-center">
                                            <p class="text-2xl font-bold ${isCritical ? 'text-red-500' : 'text-amber-500'}">${p.stock}</p>
                                            <p class="text-xs text-gray-400">actual</p>
                                        </div>
                                        <div class="text-gray-300 dark:text-gray-600">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                                        </div>
                                        <div class="text-center">
                                            <p class="text-2xl font-bold text-gray-400">${p.minStock}</p>
                                            <p class="text-xs text-gray-400">minimo</p>
                                        </div>
                                        <button onclick="ProductsModule.showMovementModal('${p.id}')" class="btn ${isCritical ? 'btn-primary' : 'btn-success'} btn-sm">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                                            Reabastecer
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `}
            </div>
        `;
    }

    // Theme Management
    function toggleTheme() {
        const html = document.documentElement;
        const isDark = html.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        applyTheme(newTheme);
        DataStore.Settings.update({ theme: newTheme });

        // Re-render current page for chart color update
        if (currentPage === 'dashboard') Dashboard.render();
    }

    function applyTheme(theme) {
        const html = document.documentElement;
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        html.setAttribute('data-theme', theme);
    }

    // Sidebar Toggle
    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
    }

    // Alert Badge
    function updateAlertBadge() {
        const lowStock = DataStore.Products.getLowStock().length;
        const outOfStock = DataStore.Products.getOutOfStock().length;
        const total = lowStock + outOfStock;

        const badge = document.getElementById('alert-badge');
        const dot = document.getElementById('notif-dot');

        if (total > 0) {
            if (badge) { badge.textContent = total; badge.classList.remove('hidden'); }
            if (dot) dot.classList.remove('hidden');
        } else {
            if (badge) badge.classList.add('hidden');
            if (dot) dot.classList.add('hidden');
        }
    }

    // Global Search
    function handleGlobalSearch(query) {
        if (!query || query.length < 2) return;
        // Search products and navigate
        const results = DataStore.Products.search(query);
        if (results.length > 0) {
            navigate('products');
            // Set search in products
            setTimeout(() => {
                const searchInput = document.querySelector('#content-area input[placeholder*="Buscar productos"]');
                if (searchInput) {
                    searchInput.value = query;
                    ProductsModule.search(query);
                }
            }, 100);
        }
    }

    return { init, navigate, toggleTheme, toggleSidebar, updateAlertBadge, handleGlobalSearch };
})();

/* ============================================
   UTILITY FUNCTIONS (Global)
   ============================================ */

function formatNumber(num) {
    return parseFloat(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Modal Management
function openModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
    document.body.style.overflow = '';
}

function closeModalOutside(e) {
    if (e.target === document.getElementById('modal-overlay')) {
        closeModal();
    }
}

// Toast Notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
        success: '<svg class="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        error: '<svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        warning: '<svg class="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>',
        info: '<svg class="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
    };

    toast.innerHTML = `${icons[type] || icons.info}<span class="flex-1 text-gray-700 dark:text-gray-200">${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Expose global functions
function navigate(page) { App.navigate(page); }
function toggleSidebar() { App.toggleSidebar(); }
function toggleTheme() { App.toggleTheme(); }
function logout() { Auth.logout(); }
function handleGlobalSearch(q) { App.handleGlobalSearch(q); }
function updateAlertBadge() { App.updateAlertBadge(); }

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    DataStore.initialize();
    Auth.init();
});