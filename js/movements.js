/* ============================================
   MOVEMENTS MODULE
   Inventory Control System AAA
   ============================================ */

const Movements = (() => {
    let filterType = 'all';
    let searchQuery = '';

    function render() {
        const movements = getFilteredMovements();
        const products = DataStore.Products.getAll();

        const content = document.getElementById('content-area');
        content.innerHTML = `
            <div class="page-enter">
                <!-- Summary Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div class="kpi-card green slide-up" style="animation-delay:0ms">
                        <div class="flex items-center gap-3">
                            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
                                <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4"/></svg>
                            </div>
                            <div>
                                <p class="text-xl font-bold text-gray-900 dark:text-white">${DataStore.Movements.getTotalEntradas()}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Total entradas</p>
                            </div>
                        </div>
                    </div>
                    <div class="kpi-card slide-up" style="animation-delay:80ms; background: white; border: 1px solid #f1f5f9;">
                        <div class="kpi-card" style="padding:0;border:none;box-shadow:none;background:transparent;">
                            <div class="flex items-center gap-3">
                                <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10">
                                    <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                                </div>
                                <div>
                                    <p class="text-xl font-bold text-gray-900 dark:text-white">${DataStore.Movements.getTotalSalidas()}</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">Total salidas</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="kpi-card purple slide-up" style="animation-delay:160ms">
                        <div class="flex items-center gap-3">
                            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10">
                                <svg class="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                            </div>
                            <div>
                                <p class="text-xl font-bold text-gray-900 dark:text-white">${movements.length}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Movimientos registrados</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Controls -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div class="flex items-center gap-2 flex-wrap">
                        <button onclick="MovementsModule.filterBy('all')" class="btn ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm">Todos</button>
                        <button onclick="MovementsModule.filterBy('entrada')" class="btn ${filterType === 'entrada' ? 'btn-primary' : 'btn-secondary'} btn-sm">
                            <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4"/></svg>
                            Entradas
                        </button>
                        <button onclick="MovementsModule.filterBy('salida')" class="btn ${filterType === 'salida' ? 'btn-primary' : 'btn-secondary'} btn-sm">
                            <svg class="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                            Salidas
                        </button>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2 gap-2">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                            <input type="text" placeholder="Buscar..." value="${searchQuery}" oninput="MovementsModule.search(this.value)" class="bg-transparent text-sm outline-none w-32 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100">
                        </div>
                        <button onclick="MovementsModule.showNewModal()" class="btn btn-primary">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                            Nuevo
                        </button>
                    </div>
                </div>

                <!-- Table -->
                <div class="card p-0 overflow-hidden">
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Producto</th>
                                    <th>Tipo</th>
                                    <th>Cantidad</th>
                                    <th>Motivo</th>
                                    <th>Usuario</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${movements.length === 0 ? `
                                    <tr><td colspan="6">
                                        <div class="empty-state">
                                            <svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg>
                                            <p class="text-gray-500 dark:text-gray-400 font-medium">No hay movimientos</p>
                                        </div>
                                    </td></tr>
                                ` : movements.sort((a, b) => new Date(b.date) - new Date(a.date)).map(m => {
                                    const product = DataStore.Products.getById(m.productId);
                                    return `
                                        <tr>
                                            <td class="whitespace-nowrap">
                                                <p class="text-sm font-medium text-gray-900 dark:text-white">${formatDate(m.date)}</p>
                                                <p class="text-xs text-gray-400">${formatTime(m.date)}</p>
                                            </td>
                                            <td>
                                                <div>
                                                    <p class="font-medium text-gray-900 dark:text-white">${product ? product.name : 'Eliminado'}</p>
                                                    <p class="text-xs text-gray-400">${product ? product.sku : ''}</p>
                                                </div>
                                            </td>
                                            <td>
                                                <span class="badge ${m.type === 'entrada' ? 'badge-green' : 'badge-red'}">
                                                    ${m.type === 'entrada' ? 'Entrada' : 'Salida'}
                                                </span>
                                            </td>
                                            <td>
                                                <span class="font-bold text-sm ${m.type === 'entrada' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}">
                                                    ${m.type === 'entrada' ? '+' : '-'}${m.quantity}
                                                </span>
                                            </td>
                                            <td class="max-w-[200px] truncate text-gray-500 dark:text-gray-400 text-sm">${escapeHtml(m.reason)}</td>
                                            <td>
                                                <span class="badge badge-gray">${m.user}</span>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    function getFilteredMovements() {
        let movements = DataStore.Movements.getAll();
        if (filterType !== 'all') {
            movements = movements.filter(m => m.type === filterType);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            movements = movements.filter(m => {
                const product = DataStore.Products.getById(m.productId);
                return (product && product.name.toLowerCase().includes(q)) ||
                       m.reason.toLowerCase().includes(q) ||
                       m.user.toLowerCase().includes(q);
            });
        }
        return movements;
    }

    function filterBy(type) {
        filterType = type;
        render();
    }

    function search(query) {
        searchQuery = query;
        render();
    }

    function showNewModal() {
        const products = DataStore.Products.getAll();
        const modal = document.getElementById('modal-content');
        modal.innerHTML = `
            <div class="p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-lg font-bold text-gray-900 dark:text-white">Nuevo Movimiento</h2>
                    <button onclick="closeModal()" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
                <form onsubmit="MovementsModule.create(event)" class="space-y-4">
                    <div>
                        <label class="form-label">Producto *</label>
                        <select name="productId" required class="form-select" onchange="MovementsModule.updateStockInfo(this.value)">
                            <option value="">Seleccionar producto...</option>
                            ${products.map(p => `<option value="${p.id}">${p.name} (Stock: ${p.stock})</option>`).join('')}
                        </select>
                    </div>
                    <div id="mov-stock-info" class="hidden p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <p class="text-sm">Stock disponible: <span id="mov-stock-val" class="font-bold"></span></p>
                    </div>
                    <div>
                        <label class="form-label">Tipo *</label>
                        <select name="type" required class="form-select">
                            <option value="entrada">Entrada</option>
                            <option value="salida">Salida</option>
                        </select>
                    </div>
                    <div>
                        <label class="form-label">Cantidad *</label>
                        <input type="number" name="quantity" required min="1" class="form-input" placeholder="0">
                    </div>
                    <div>
                        <label class="form-label">Motivo *</label>
                        <input type="text" name="reason" required class="form-input" placeholder="Razon del movimiento">
                    </div>
                    <div class="flex justify-end gap-2 pt-2">
                        <button type="button" onclick="closeModal()" class="btn btn-secondary">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Registrar</button>
                    </div>
                </form>
            </div>
        `;
        openModal();
    }

    function updateStockInfo(productId) {
        const info = document.getElementById('mov-stock-info');
        const val = document.getElementById('mov-stock-val');
        if (productId) {
            const product = DataStore.Products.getById(productId);
            if (product) {
                val.textContent = `${product.stock} ${product.unit}`;
                info.classList.remove('hidden');
            }
        } else {
            info.classList.add('hidden');
        }
    }

    function create(e) {
        e.preventDefault();
        const form = e.target;
        const result = DataStore.Movements.create({
            productId: form.productId.value,
            type: form.type.value,
            quantity: parseInt(form.quantity.value),
            reason: form.reason.value.trim()
        });

        if (result.error) {
            showToast(result.error, 'error');
            return;
        }

        closeModal();
        showToast('Movimiento registrado exitosamente', 'success');
        render();
        updateAlertBadge();
    }

    return { render, filterBy, search, showNewModal, updateStockInfo, create };
})();

const MovementsModule = Movements;