/* ============================================
   REPORTS MODULE
   Inventory Control System AAA
   ============================================ */

const Reports = (() => {
    let activeTab = 'inventory';
    let reportChart = null;

    function render() {
        const content = document.getElementById('content-area');
        content.innerHTML = `
            <div class="page-enter">
                <!-- Tabs -->
                <div class="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-800">
                    <button onclick="ReportsModule.switchTab('inventory')" class="tab-btn ${activeTab === 'inventory' ? 'active' : ''}">Inventario</button>
                    <button onclick="ReportsModule.switchTab('movements')" class="tab-btn ${activeTab === 'movements' ? 'active' : ''}">Movimientos</button>
                    <button onclick="ReportsModule.switchTab('value')" class="tab-btn ${activeTab === 'value' ? 'active' : ''}">Valoracion</button>
                </div>

                <!-- Filters -->
                <div class="card mb-6">
                    <div class="flex flex-col sm:flex-row items-end gap-4">
                        <div class="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                            <div>
                                <label class="form-label">Desde</label>
                                <input type="date" id="report-from" class="form-input" value="${getDefaultDateFrom()}">
                            </div>
                            <div>
                                <label class="form-label">Hasta</label>
                                <input type="date" id="report-to" class="form-input" value="${getDefaultDateTo()}">
                            </div>
                            <div>
                                <label class="form-label">Categoria</label>
                                <select id="report-category" class="form-select">
                                    <option value="all">Todas</option>
                                    ${DataStore.Categories.getAll().map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="ReportsModule.generate()" class="btn btn-primary">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                                Generar
                            </button>
                            <button onclick="ReportsModule.exportCSV()" class="btn btn-secondary">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                CSV
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Report Content -->
                <div id="report-content"></div>
            </div>
        `;

        generate();
    }

    function switchTab(tab) {
        activeTab = tab;
        render();
    }

    function getFilters() {
        return {
            from: document.getElementById('report-from').value,
            to: document.getElementById('report-to').value,
            category: document.getElementById('report-category').value
        };
    }

    function generate() {
        const filters = getFilters();

        if (activeTab === 'inventory') {
            renderInventoryReport(filters);
        } else if (activeTab === 'movements') {
            renderMovementsReport(filters);
        } else if (activeTab === 'value') {
            renderValueReport(filters);
        }
    }

    function renderInventoryReport(filters) {
        let products = DataStore.Products.getAll();

        if (filters.category !== 'all') {
            products = products.filter(p => p.category === filters.category);
        }

        const totalValue = products.reduce((s, p) => s + (p.price * p.stock), 0);
        const totalCost = products.reduce((s, p) => s + (p.cost * p.stock), 0);
        const totalUnits = products.reduce((s, p) => s + p.stock, 0);
        const lowStock = products.filter(p => p.stock <= p.minStock).length;

        const el = document.getElementById('report-content');
        el.innerHTML = `
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="kpi-card blue"><p class="text-sm text-gray-500 dark:text-gray-400">Productos</p><p class="text-xl font-bold mt-1">${products.length}</p></div>
                <div class="kpi-card green"><p class="text-sm text-gray-500 dark:text-gray-400">Unidades totales</p><p class="text-xl font-bold mt-1">${totalUnits}</p></div>
                <div class="kpi-card purple"><p class="text-sm text-gray-500 dark:text-gray-400">Valor venta</p><p class="text-xl font-bold mt-1">$${formatNumber(totalValue)}</p></div>
                <div class="kpi-card amber"><p class="text-sm text-gray-500 dark:text-gray-400">Margen potencial</p><p class="text-xl font-bold mt-1 text-emerald-600">$${formatNumber(totalValue - totalCost)}</p></div>
            </div>
            <div class="card p-0 overflow-hidden">
                <div class="table-responsive">
                    <table class="data-table" id="report-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>SKU</th>
                                <th>Categoria</th>
                                <th>Stock</th>
                                <th>Precio</th>
                                <th>Costo</th>
                                <th>Valor Total</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${products.map(p => {
                                const cat = DataStore.Categories.getById(p.category);
                                const status = p.stock === 0 ? '<span class="badge badge-red">Agotado</span>' :
                                    p.stock <= p.minStock ? '<span class="badge badge-amber">Bajo</span>' :
                                    '<span class="badge badge-green">OK</span>';
                                return `
                                    <tr>
                                        <td class="font-medium">${p.name}</td>
                                        <td><code class="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md font-mono">${p.sku}</code></td>
                                        <td>${cat ? cat.name : '-'}</td>
                                        <td class="font-semibold">${p.stock} ${p.unit}</td>
                                        <td>$${formatNumber(p.price)}</td>
                                        <td>$${formatNumber(p.cost)}</td>
                                        <td class="font-medium">$${formatNumber(p.price * p.stock)}</td>
                                        <td>${status}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function renderMovementsReport(filters) {
        let movements = DataStore.Movements.getAll();

        if (filters.from && filters.to) {
            movements = movements.filter(m => {
                const d = m.date.split('T')[0];
                return d >= filters.from && d <= filters.to;
            });
        }

        if (filters.category !== 'all') {
            const catProducts = DataStore.Products.getByCategory(filters.category).map(p => p.id);
            movements = movements.filter(m => catProducts.includes(m.productId));
        }

        const entradas = movements.filter(m => m.type === 'entrada');
        const salidas = movements.filter(m => m.type === 'salida');
        const totalIn = entradas.reduce((s, m) => s + m.quantity, 0);
        const totalOut = salidas.reduce((s, m) => s + m.quantity, 0);

        const el = document.getElementById('report-content');
        el.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div class="card">
                    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Resumen</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between"><span class="text-gray-600 dark:text-gray-400">Total movimientos</span><span class="font-bold">${movements.length}</span></div>
                        <div class="flex justify-between"><span class="text-emerald-600 dark:text-emerald-400">Entradas</span><span class="font-bold text-emerald-600">+${totalIn}</span></div>
                        <div class="flex justify-between"><span class="text-red-600 dark:text-red-400">Salidas</span><span class="font-bold text-red-600">-${totalOut}</span></div>
                        <div class="flex justify-between border-t pt-2 dark:border-gray-700"><span class="text-gray-600 dark:text-gray-400">Balance neto</span><span class="font-bold ${totalIn - totalOut >= 0 ? 'text-emerald-600' : 'text-red-600'}">${totalIn - totalOut >= 0 ? '+' : ''}${totalIn - totalOut}</span></div>
                    </div>
                </div>
                <div class="card lg:col-span-2">
                    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Movimientos por Producto (Top 8)</h3>
                    <div class="chart-container" style="height: 220px;">
                        <canvas id="report-chart"></canvas>
                    </div>
                </div>
            </div>
            <div class="card p-0 overflow-hidden">
                <div class="table-responsive">
                    <table class="data-table" id="report-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Producto</th>
                                <th>Tipo</th>
                                <th>Cantidad</th>
                                <th>Motivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${movements.sort((a, b) => new Date(b.date) - new Date(a.date)).map(m => {
                                const product = DataStore.Products.getById(m.productId);
                                return `
                                    <tr>
                                        <td>${formatDate(m.date)}</td>
                                        <td class="font-medium">${product ? product.name : 'Eliminado'}</td>
                                        <td><span class="badge ${m.type === 'entrada' ? 'badge-green' : 'badge-red'}">${m.type === 'entrada' ? 'Entrada' : 'Salida'}</span></td>
                                        <td class="font-bold ${m.type === 'entrada' ? 'text-emerald-600' : 'text-red-600'}">${m.type === 'entrada' ? '+' : '-'}${m.quantity}</td>
                                        <td class="text-gray-500 dark:text-gray-400">${escapeHtml(m.reason)}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Render chart
        const prodMovements = {};
        movements.forEach(m => {
            const p = DataStore.Products.getById(m.productId);
            const name = p ? p.name : 'Desconocido';
            if (!prodMovements[name]) prodMovements[name] = { in: 0, out: 0 };
            if (m.type === 'entrada') prodMovements[name].in += m.quantity;
            else prodMovements[name].out += m.quantity;
        });

        const topProducts = Object.entries(prodMovements)
            .sort((a, b) => (b[1].in + b[1].out) - (a[1].in + a[1].out))
            .slice(0, 8);

        const ctx = document.getElementById('report-chart');
        if (ctx && reportChart) { reportChart.destroy(); reportChart = null; }
        if (ctx) {
            const isDark = document.documentElement.classList.contains('dark');
            reportChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: topProducts.map(([name]) => name.length > 18 ? name.substring(0, 18) + '...' : name),
                    datasets: [
                        { label: 'Entradas', data: topProducts.map(([, d]) => d.in), backgroundColor: 'rgba(16,185,129,0.7)', borderRadius: 4, barPercentage: 0.6 },
                        { label: 'Salidas', data: topProducts.map(([, d]) => d.out), backgroundColor: 'rgba(239,68,68,0.7)', borderRadius: 4, barPercentage: 0.6 }
                    ]
                },
                options: {
                    responsive: true, maintainAspectRatio: false, indexAxis: 'y',
                    plugins: { legend: { position: 'top', align: 'end', labels: { usePointStyle: true, pointStyle: 'circle', padding: 12, font: { size: 11 } } } },
                    scales: {
                        x: { grid: { color: isDark ? 'rgba(148,163,184,0.08)' : 'rgba(0,0,0,0.06)' }, beginAtZero: true, ticks: { font: { size: 11 } } },
                        y: { grid: { display: false }, ticks: { font: { size: 11 } } }
                    }
                }
            });
        }
    }

    function renderValueReport(filters) {
        let products = DataStore.Products.getAll();
        if (filters.category !== 'all') {
            products = products.filter(p => p.category === filters.category);
        }

        // Sort by value
        const byValue = [...products].sort((a, b) => (b.price * b.stock) - (a.price * a.stock));
        const totalValue = byValue.reduce((s, p) => s + (p.price * p.stock), 0);
        const totalCost = byValue.reduce((s, p) => s + (p.cost * p.stock), 0);

        const el = document.getElementById('report-content');
        el.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div class="card">
                    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Resumen de Valoracion</h3>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center"><span class="text-gray-600 dark:text-gray-400">Valor al costo</span><span class="text-lg font-bold">$${formatNumber(totalCost)}</span></div>
                        <div class="flex justify-between items-center"><span class="text-gray-600 dark:text-gray-400">Valor al precio de venta</span><span class="text-lg font-bold">$${formatNumber(totalValue)}</span></div>
                        <div class="flex justify-between items-center border-t pt-3 dark:border-gray-700"><span class="text-gray-600 dark:text-gray-400 font-medium">Margen bruto potencial</span><span class="text-lg font-bold text-emerald-600">$${formatNumber(totalValue - totalCost)}</span></div>
                        <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 mt-2">
                            <div class="bg-gradient-to-r from-violet-500 to-indigo-500 h-3 rounded-full transition-all" style="width: ${totalValue > 0 ? ((totalValue - totalCost) / totalValue * 100).toFixed(0) : 0}%"></div>
                        </div>
                        <p class="text-xs text-gray-400 text-right">${totalValue > 0 ? ((totalValue - totalCost) / totalValue * 100).toFixed(1) : 0}% margen promedio</p>
                    </div>
                </div>
                <div class="card">
                    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Distribucion por Categoria</h3>
                    <div class="chart-container" style="height: 200px;">
                        <canvas id="report-chart"></canvas>
                    </div>
                </div>
            </div>
            <div class="card p-0 overflow-hidden">
                <div class="table-responsive">
                    <table class="data-table" id="report-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Producto</th>
                                <th>Stock</th>
                                <th>Costo Unit.</th>
                                <th>Valor Costo</th>
                                <th>Precio Venta</th>
                                <th>Valor Venta</th>
                                <th>Margen %</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${byValue.map((p, i) => {
                                const costVal = p.cost * p.stock;
                                const saleVal = p.price * p.stock;
                                const margin = p.price > 0 ? ((p.price - p.cost) / p.price * 100) : 0;
                                return `
                                    <tr>
                                        <td class="text-gray-400 font-mono text-sm">${i + 1}</td>
                                        <td class="font-medium">${p.name}</td>
                                        <td>${p.stock} ${p.unit}</td>
                                        <td>$${formatNumber(p.cost)}</td>
                                        <td>$${formatNumber(costVal)}</td>
                                        <td>$${formatNumber(p.price)}</td>
                                        <td class="font-medium">$${formatNumber(saleVal)}</td>
                                        <td>
                                            <span class="badge ${margin >= 40 ? 'badge-green' : margin >= 20 ? 'badge-amber' : 'badge-red'}">${margin.toFixed(1)}%</span>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                        <tfoot>
                            <tr class="bg-gray-50 dark:bg-gray-800/50 font-bold">
                                <td colspan="2">TOTAL</td>
                                <td>${products.reduce((s, p) => s + p.stock, 0)}</td>
                                <td></td>
                                <td class="text-emerald-600">$${formatNumber(totalCost)}</td>
                                <td></td>
                                <td class="text-blue-600">$${formatNumber(totalValue)}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        `;

        // Pie chart
        const categories = DataStore.Categories.getAll();
        const catValues = categories.map(cat => {
            return products
                .filter(p => p.category === cat.id)
                .reduce((s, p) => s + (p.price * p.stock), 0);
        }).filter(v => v > 0);

        const catLabels = categories
            .map((cat, i) => catValues[i] > 0 ? cat.name : null)
            .filter(Boolean);
        const catColors = categories
            .map((cat, i) => catValues[i] > 0 ? cat.color : null)
            .filter(Boolean);

        const ctx = document.getElementById('report-chart');
        if (ctx && reportChart) { reportChart.destroy(); reportChart = null; }
        if (ctx) {
            reportChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: catLabels,
                    datasets: [{ data: catValues.filter(v => v > 0), backgroundColor: catColors, borderWidth: 0, hoverOffset: 6 }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false, cutout: '60%',
                    plugins: { legend: { position: 'right', labels: { usePointStyle: true, pointStyle: 'circle', padding: 10, font: { size: 11 } } } }
                }
            });
        }
    }

    function exportCSV() {
        const table = document.getElementById('report-table');
        if (!table) {
            showToast('Genera un reporte primero', 'warning');
            return;
        }

        const rows = Array.from(table.querySelectorAll('tr'));
        let csv = '';

        rows.forEach(row => {
            const cells = Array.from(row.querySelectorAll('th, td'));
            const rowText = cells.map(cell => `"${cell.textContent.trim().replace(/"/g, '""')}"`).join(',');
            csv += rowText + '\n';
        });

        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Reporte CSV descargado', 'success');
    }

    function getDefaultDateFrom() {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        return d.toISOString().split('T')[0];
    }

    function getDefaultDateTo() {
        return new Date().toISOString().split('T')[0];
    }

    return { render, switchTab, generate, exportCSV };
})();

const ReportsModule = Reports;