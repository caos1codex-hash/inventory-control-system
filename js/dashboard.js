/* ============================================
   DASHBOARD MODULE
   Inventory Control System AAA
   ============================================ */

const Dashboard = (() => {
    let charts = {};

    function render() {
        const products = DataStore.Products.getAll();
        const movements = DataStore.Movements.getAll();
        const lowStockProducts = DataStore.Products.getLowStock();
        const outOfStock = DataStore.Products.getOutOfStock();
        const recentMovements = DataStore.Movements.getRecent(8);

        const totalProducts = products.length;
        const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
        const totalValue = DataStore.Products.getTotalStockValue();
        const totalEntradas = DataStore.Movements.getTotalEntradas();
        const totalSalidas = DataStore.Movements.getTotalSalidas();

        const content = document.getElementById('content-area');
        content.innerHTML = `
            <div class="page-enter">
                <!-- KPI Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
                    <div class="kpi-card blue slide-up" style="animation-delay: 0ms">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10">
                                <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                            </div>
                            <span class="badge badge-blue">Total</span>
                        </div>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">${totalProducts}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Productos registrados</p>
                    </div>

                    <div class="kpi-card green slide-up" style="animation-delay: 80ms">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
                                <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>
                            </div>
                            <span class="badge badge-green">${totalStock} uds</span>
                        </div>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">$${formatNumber(totalValue)}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Valor total en stock</p>
                    </div>

                    <div class="kpi-card amber slide-up" style="animation-delay: 160ms">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10">
                                <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
                            </div>
                            <span class="badge ${lowStockProducts.length > 0 ? 'badge-amber' : 'badge-green'}">${lowStockProducts.length}</span>
                        </div>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">${lowStockProducts.length + outOfStock.length}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Productos con stock bajo</p>
                    </div>

                    <div class="kpi-card purple slide-up" style="animation-delay: 240ms">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10">
                                <svg class="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg>
                            </div>
                            <span class="badge badge-purple">Hoy</span>
                        </div>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">${movements.length}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Total movimientos</p>
                    </div>
                </div>

                <!-- Charts Row -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
                    <div class="card slide-up" style="animation-delay: 300ms">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-semibold text-gray-900 dark:text-white">Movimientos (Entradas vs Salidas)</h3>
                        </div>
                        <div class="chart-container">
                            <canvas id="chart-movements"></canvas>
                        </div>
                    </div>
                    <div class="card slide-up" style="animation-delay: 380ms">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-semibold text-gray-900 dark:text-white">Stock por Categoria</h3>
                        </div>
                        <div class="chart-container">
                            <canvas id="chart-categories"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Bottom Row -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                    <!-- Recent Movements -->
                    <div class="card lg:col-span-2 slide-up" style="animation-delay: 440ms">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-semibold text-gray-900 dark:text-white">Ultimos Movimientos</h3>
                            <button onclick="navigate('movements')" class="text-sm text-indigo-500 hover:text-indigo-600 font-medium transition-colors">Ver todos</button>
                        </div>
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Tipo</th>
                                        <th>Cantidad</th>
                                        <th>Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${recentMovements.map(m => {
                                        const product = DataStore.Products.getById(m.productId);
                                        return `
                                            <tr>
                                                <td class="font-medium">${product ? product.name : 'Desconocido'}</td>
                                                <td>
                                                    <span class="badge ${m.type === 'entrada' ? 'badge-green' : 'badge-red'}">
                                                        ${m.type === 'entrada' ? 'Entrada' : 'Salida'}
                                                    </span>
                                                </td>
                                                <td class="font-medium ${m.type === 'entrada' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}">
                                                    ${m.type === 'entrada' ? '+' : '-'}${m.quantity}
                                                </td>
                                                <td class="text-gray-500 dark:text-gray-400">${formatDate(m.date)}</td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Low Stock Alerts -->
                    <div class="card slide-up" style="animation-delay: 500ms">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-semibold text-gray-900 dark:text-white">Alertas de Stock</h3>
                            <span class="badge ${lowStockProducts.length > 0 ? 'badge-red' : 'badge-green'}">${lowStockProducts.length + outOfStock.length}</span>
                        </div>
                        <div class="space-y-3">
                            ${lowStockProducts.length === 0 && outOfStock.length === 0 ? `
                                <div class="text-center py-6 text-gray-400">
                                    <svg class="w-10 h-10 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    <p class="text-sm">Todo el stock esta OK</p>
                                </div>
                            ` : [
                                ...outOfStock.map(p => ({
                                    name: p.name, stock: 0, min: p.minStock, sku: p.sku
                                })),
                                ...lowStockProducts.filter(p => p.stock > 0).map(p => ({
                                    name: p.name, stock: p.stock, min: p.minStock, sku: p.sku
                                }))
                            ].slice(0, 6).map(p => `
                                <div class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer" onclick="navigate('products')">
                                    <span class="status-dot ${p.stock === 0 ? 'red' : 'amber'}"></span>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-gray-900 dark:text-white truncate">${p.name}</p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400">${p.sku}</p>
                                    </div>
                                    <div class="text-right flex-shrink-0">
                                        <p class="text-sm font-bold ${p.stock === 0 ? 'text-red-500' : 'text-amber-500'}">${p.stock}</p>
                                        <p class="text-xs text-gray-400">min: ${p.min}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        renderCharts(products, movements, totalEntradas, totalSalidas);
    }

    function renderCharts(products, movements, totalEntradas, totalSalidas) {
        // Destroy existing charts
        Object.values(charts).forEach(c => c.destroy());
        charts = {};

        const isDark = document.documentElement.classList.contains('dark');
        const gridColor = isDark ? 'rgba(148,163,184,0.08)' : 'rgba(0,0,0,0.06)';
        const textColor = isDark ? '#94a3b8' : '#64748b';

        Chart.defaults.color = textColor;
        Chart.defaults.font.family = "'Inter', sans-serif";

        // Movements bar chart
        const movCtx = document.getElementById('chart-movements');
        if (movCtx) {
            const last7Days = getLast7Days();
            const entradaData = last7Days.map(d => {
                return movements
                    .filter(m => m.type === 'entrada' && m.date.startsWith(d))
                    .reduce((sum, m) => sum + m.quantity, 0);
            });
            const salidaData = last7Days.map(d => {
                return movements
                    .filter(m => m.type === 'salida' && m.date.startsWith(d))
                    .reduce((sum, m) => sum + m.quantity, 0);
            });

            charts.movements = new Chart(movCtx, {
                type: 'bar',
                data: {
                    labels: last7Days.map(d => formatChartDate(d)),
                    datasets: [
                        {
                            label: 'Entradas',
                            data: entradaData,
                            backgroundColor: isDark ? 'rgba(52,211,153,0.7)' : 'rgba(16,185,129,0.7)',
                            borderRadius: 6,
                            borderSkipped: false,
                            barPercentage: 0.6,
                            categoryPercentage: 0.7
                        },
                        {
                            label: 'Salidas',
                            data: salidaData,
                            backgroundColor: isDark ? 'rgba(248,113,113,0.7)' : 'rgba(239,68,68,0.7)',
                            borderRadius: 6,
                            borderSkipped: false,
                            barPercentage: 0.6,
                            categoryPercentage: 0.7
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            align: 'end',
                            labels: {
                                usePointStyle: true,
                                pointStyle: 'circle',
                                padding: 16,
                                font: { size: 12, weight: '500' }
                            }
                        }
                    },
                    scales: {
                        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
                        y: {
                            grid: { color: gridColor },
                            ticks: { font: { size: 11 } },
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Category doughnut chart
        const catCtx = document.getElementById('chart-categories');
        if (catCtx) {
            const categories = DataStore.Categories.getAll();
            const catData = categories.map(cat => {
                return products
                    .filter(p => p.category === cat.id)
                    .reduce((sum, p) => sum + p.stock, 0);
            });

            charts.categories = new Chart(catCtx, {
                type: 'doughnut',
                data: {
                    labels: categories.map(c => c.name),
                    datasets: [{
                        data: catData,
                        backgroundColor: categories.map(c => c.color),
                        borderWidth: 0,
                        hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                usePointStyle: true,
                                pointStyle: 'circle',
                                padding: 12,
                                font: { size: 12, weight: '500' }
                            }
                        }
                    }
                }
            });
        }
    }

    function destroyCharts() {
        Object.values(charts).forEach(c => c.destroy());
        charts = {};
    }

    function getLast7Days() {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(d.toISOString().split('T')[0]);
        }
        return days;
    }

    function formatChartDate(dateStr) {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('es', { day: 'numeric', month: 'short' });
    }

    return { render, destroyCharts };
})();