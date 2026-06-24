/* ============================================
   PRODUCTS MODULE - Full CRUD
   Inventory Control System AAA
   ============================================ */

const Products = (() => {
    let currentFilter = 'all';
    let searchQuery = '';

    function render() {
        const products = getFilteredProducts();
        const categories = DataStore.Categories.getAll();

        const content = document.getElementById('content-area');
        content.innerHTML = `
            <div class="page-enter">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${products.length} producto${products.length !== 1 ? 's' : ''} encontrado${products.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2 gap-2">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                            <input type="text" placeholder="Buscar productos..." value="${searchQuery}" oninput="ProductsModule.search(this.value)" class="bg-transparent text-sm outline-none w-40 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100">
                        </div>
                        <select onchange="ProductsModule.filterCategory(this.value)" class="form-select py-2 w-auto text-sm">
                            <option value="all" ${currentFilter === 'all' ? 'selected' : ''}>Todas las categorias</option>
                            ${categories.map(c => `<option value="${c.id}" ${currentFilter === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                        </select>
                        <button onclick="ProductsModule.showCreateModal()" class="btn btn-primary">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                            Nuevo Producto
                        </button>
                    </div>
                </div>

                <!-- Products Table -->
                <div class="card p-0 overflow-hidden">
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>SKU</th>
                                    <th>Categoria</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Estado</th>
                                    <th class="text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${products.length === 0 ? `
                                    <tr>
                                        <td colspan="7">
                                            <div class="empty-state">
                                                <svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                                                <p class="text-gray-500 dark:text-gray-400 font-medium">No se encontraron productos</p>
                                                <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Crea un nuevo producto para comenzar</p>
                                            </div>
                                        </td>
                                    </tr>
                                ` : products.map(p => {
                                    const cat = DataStore.Categories.getById(p.category);
                                    const stockStatus = getStockStatus(p);
                                    return `
                                        <tr>
                                            <td>
                                                <div class="flex items-center gap-3">
                                                    <div class="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style="background: ${cat ? cat.color : '#6366f1'}">
                                                        ${p.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div class="min-w-0">
                                                        <p class="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">${p.name}</p>
                                                        <p class="text-xs text-gray-400 truncate max-w-[200px]">${p.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><code class="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md font-mono">${p.sku}</code></td>
                                            <td>
                                                ${cat ? `<span class="badge" style="background: ${cat.color}15; color: ${cat.color}">${cat.name}</span>` : '<span class="badge badge-gray">Sin categoria</span>'}
                                            </td>
                                            <td class="font-medium">$${formatNumber(p.price)}</td>
                                            <td>
                                                <span class="font-semibold ${stockStatus.colorClass}">${p.stock}</span>
                                                <span class="text-xs text-gray-400 ml-1">${p.unit}</span>
                                            </td>
                                            <td>
                                                <div class="flex items-center gap-1.5">
                                                    <span class="status-dot ${stockStatus.dotClass}"></span>
                                                    <span class="text-xs font-medium ${stockStatus.colorClass}">${stockStatus.label}</span>
                                                </div>
                                            </td>
                                            <td class="text-right">
                                                <div class="flex items-center justify-end gap-1">
                                                    <button onclick="ProductsModule.showEditModal('${p.id}')" class="btn btn-secondary btn-icon btn-sm" title="Editar">
                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                                    </button>
                                                    <button onclick="ProductsModule.showMovementModal('${p.id}')" class="btn btn-success btn-icon btn-sm" title="Movimiento">
                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg>
                                                    </button>
                                                    <button onclick="ProductsModule.confirmDelete('${p.id}')" class="btn btn-danger btn-icon btn-sm" title="Eliminar">
                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                    </button>
                                                </div>
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

    function getFilteredProducts() {
        let products = DataStore.Products.getAll();
        if (currentFilter !== 'all') {
            products = products.filter(p => p.category === currentFilter);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            products = products.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.sku.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q)
            );
        }
        return products;
    }

    function getStockStatus(product) {
        if (product.stock === 0) {
            return { label: 'Agotado', dotClass: 'red', colorClass: 'text-red-500', badge: 'badge-red' };
        }
        if (product.stock <= product.minStock) {
            return { label: 'Stock bajo', dotClass: 'amber', colorClass: 'text-amber-500', badge: 'badge-amber' };
        }
        return { label: 'Normal', dotClass: 'green', colorClass: 'text-emerald-600 dark:text-emerald-400', badge: 'badge-green' };
    }

    function search(query) {
        searchQuery = query;
        render();
    }

    function filterCategory(catId) {
        currentFilter = catId;
        render();
    }

    function showCreateModal() {
        const categories = DataStore.Categories.getAll();
        const modal = document.getElementById('modal-content');
        modal.innerHTML = `
            <div class="p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-lg font-bold text-gray-900 dark:text-white">Nuevo Producto</h2>
                    <button onclick="closeModal()" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
                <form onsubmit="ProductsModule.createProduct(event)" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2">
                            <label class="form-label">Nombre del producto *</label>
                            <input type="text" name="name" required class="form-input" placeholder="Ej: Monitor Dell 27 pulgadas">
                        </div>
                        <div>
                            <label class="form-label">SKU *</label>
                            <input type="text" name="sku" required class="form-input" placeholder="Ej: MON-DLL-27">
                        </div>
                        <div>
                            <label class="form-label">Categoria *</label>
                            <select name="category" required class="form-select">
                                <option value="">Seleccionar...</option>
                                ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="form-label">Precio de venta ($) *</label>
                            <input type="number" name="price" required step="0.01" min="0" class="form-input" placeholder="0.00">
                        </div>
                        <div>
                            <label class="form-label">Costo ($) *</label>
                            <input type="number" name="cost" required step="0.01" min="0" class="form-input" placeholder="0.00">
                        </div>
                        <div>
                            <label class="form-label">Stock inicial *</label>
                            <input type="number" name="stock" required min="0" class="form-input" placeholder="0" value="0">
                        </div>
                        <div>
                            <label class="form-label">Stock minimo *</label>
                            <input type="number" name="minStock" required min="0" class="form-input" placeholder="0" value="5">
                        </div>
                        <div>
                            <label class="form-label">Unidad</label>
                            <select name="unit" class="form-select">
                                <option value="unidad">Unidad</option>
                                <option value="par">Par</option>
                                <option value="caja">Caja</option>
                                <option value="metro">Metro</option>
                                <option value="kg">Kilogramo</option>
                                <option value="litro">Litro</option>
                                <option value="galon">Galon</option>
                                <option value="rollo">Rollo</option>
                            </select>
                        </div>
                        <div class="col-span-2">
                            <label class="form-label">Descripcion</label>
                            <textarea name="description" rows="2" class="form-input" placeholder="Descripcion del producto..."></textarea>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 pt-2">
                        <button type="button" onclick="closeModal()" class="btn btn-secondary">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Crear Producto</button>
                    </div>
                </form>
            </div>
        `;
        openModal();
    }

    function createProduct(e) {
        e.preventDefault();
        const form = e.target;
        const product = {
            name: form.name.value.trim(),
            sku: form.sku.value.trim().toUpperCase(),
            category: form.category.value,
            price: parseFloat(form.price.value),
            cost: parseFloat(form.cost.value),
            stock: parseInt(form.stock.value),
            minStock: parseInt(form.minStock.value),
            unit: form.unit.value,
            description: form.description.value.trim()
        };

        // Check duplicate SKU
        const existing = DataStore.Products.getAll().find(p => p.sku === product.sku);
        if (existing) {
            showToast('Ya existe un producto con ese SKU', 'error');
            return;
        }

        DataStore.Products.create(product);
        if (product.stock > 0) {
            DataStore.Movements.create({
                productId: DataStore.Products.getAll().find(p => p.sku === product.sku).id,
                type: 'entrada',
                quantity: product.stock,
                reason: 'Stock inicial del producto'
            });
        }

        closeModal();
        showToast('Producto creado exitosamente', 'success');
        render();
        updateAlertBadge();
    }

    function showEditModal(id) {
        const product = DataStore.Products.getById(id);
        if (!product) return;

        const categories = DataStore.Categories.getAll();
        const modal = document.getElementById('modal-content');
        modal.innerHTML = `
            <div class="p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Producto</h2>
                    <button onclick="closeModal()" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
                <form onsubmit="ProductsModule.updateProduct(event, '${id}')" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2">
                            <label class="form-label">Nombre del producto *</label>
                            <input type="text" name="name" required class="form-input" value="${escapeHtml(product.name)}">
                        </div>
                        <div>
                            <label class="form-label">SKU *</label>
                            <input type="text" name="sku" required class="form-input" value="${product.sku}">
                        </div>
                        <div>
                            <label class="form-label">Categoria *</label>
                            <select name="category" required class="form-select">
                                ${categories.map(c => `<option value="${c.id}" ${product.category === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="form-label">Precio de venta ($) *</label>
                            <input type="number" name="price" required step="0.01" min="0" class="form-input" value="${product.price}">
                        </div>
                        <div>
                            <label class="form-label">Costo ($) *</label>
                            <input type="number" name="cost" required step="0.01" min="0" class="form-input" value="${product.cost}">
                        </div>
                        <div>
                            <label class="form-label">Stock minimo *</label>
                            <input type="number" name="minStock" required min="0" class="form-input" value="${product.minStock}">
                        </div>
                        <div>
                            <label class="form-label">Unidad</label>
                            <select name="unit" class="form-select">
                                ${['unidad','par','caja','metro','kg','litro','galon','rollo'].map(u => `<option value="${u}" ${product.unit === u ? 'selected' : ''}>${u.charAt(0).toUpperCase() + u.slice(1)}</option>`).join('')}
                            </select>
                        </div>
                        <div class="col-span-2">
                            <label class="form-label">Descripcion</label>
                            <textarea name="description" rows="2" class="form-input">${escapeHtml(product.description)}</textarea>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 pt-2">
                        <button type="button" onclick="closeModal()" class="btn btn-secondary">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        `;
        openModal();
    }

    function updateProduct(e, id) {
        e.preventDefault();
        const form = e.target;

        // Check duplicate SKU (excluding current)
        const newSku = form.sku.value.trim().toUpperCase();
        const existing = DataStore.Products.getAll().find(p => p.sku === newSku && p.id !== id);
        if (existing) {
            showToast('Ya existe otro producto con ese SKU', 'error');
            return;
        }

        DataStore.Products.update(id, {
            name: form.name.value.trim(),
            sku: newSku,
            category: form.category.value,
            price: parseFloat(form.price.value),
            cost: parseFloat(form.cost.value),
            minStock: parseInt(form.minStock.value),
            unit: form.unit.value,
            description: form.description.value.trim()
        });

        closeModal();
        showToast('Producto actualizado', 'success');
        render();
        updateAlertBadge();
    }

    function showMovementModal(productId) {
        const product = DataStore.Products.getById(productId);
        if (!product) return;

        const modal = document.getElementById('modal-content');
        modal.innerHTML = `
            <div class="p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-lg font-bold text-gray-900 dark:text-white">Movimiento de Stock</h2>
                    <button onclick="closeModal()" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
                <div class="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p class="font-medium text-gray-900 dark:text-white">${product.name}</p>
                    <p class="text-sm text-gray-500">Stock actual: <span class="font-semibold text-gray-900 dark:text-white">${product.stock} ${product.unit}</span></p>
                </div>
                <form onsubmit="ProductsModule.processMovement(event, '${productId}')" class="space-y-4">
                    <div>
                        <label class="form-label">Tipo de movimiento *</label>
                        <select name="type" required class="form-select">
                            <option value="entrada">Entrada (incrementar stock)</option>
                            <option value="salida">Salida (decrementar stock)</option>
                        </select>
                    </div>
                    <div>
                        <label class="form-label">Cantidad *</label>
                        <input type="number" name="quantity" required min="1" max="${product.stock}" class="form-input" placeholder="0">
                    </div>
                    <div>
                        <label class="form-label">Motivo *</label>
                        <input type="text" name="reason" required class="form-input" placeholder="Razon del movimiento">
                    </div>
                    <div class="flex justify-end gap-2 pt-2">
                        <button type="button" onclick="closeModal()" class="btn btn-secondary">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Registrar Movimiento</button>
                    </div>
                </form>
            </div>
        `;
        openModal();
    }

    function processMovement(e, productId) {
        e.preventDefault();
        const form = e.target;
        const result = DataStore.Movements.create({
            productId: productId,
            type: form.type.value,
            quantity: parseInt(form.quantity.value),
            reason: form.reason.value.trim()
        });

        if (result.error) {
            showToast(result.error, 'error');
            return;
        }

        closeModal();
        showToast(`Movimiento de ${form.type.value} registrado`, 'success');
        render();
        updateAlertBadge();
    }

    function confirmDelete(id) {
        const product = DataStore.Products.getById(id);
        if (!product) return;

        const modal = document.getElementById('modal-content');
        modal.innerHTML = `
            <div class="p-6 text-center">
                <div class="flex items-center justify-center w-14 h-14 rounded-full bg-red-50 dark:bg-red-500/10 mx-auto mb-4">
                    <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
                </div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Eliminar Producto</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Esta a punto de eliminar:</p>
                <p class="font-medium text-gray-900 dark:text-white mb-4">${product.name}</p>
                <p class="text-xs text-gray-400 mb-6">Esta accion no se puede deshacer. Los movimientos asociados se conservaran.</p>
                <div class="flex justify-center gap-2">
                    <button onclick="closeModal()" class="btn btn-secondary">Cancelar</button>
                    <button onclick="ProductsModule.deleteProduct('${id}')" class="btn btn-danger">Eliminar</button>
                </div>
            </div>
        `;
        openModal();
    }

    function deleteProduct(id) {
        DataStore.Products.delete(id);
        closeModal();
        showToast('Producto eliminado', 'success');
        render();
        updateAlertBadge();
    }

    return {
        render, search, filterCategory,
        showCreateModal, createProduct, showEditModal, updateProduct,
        showMovementModal, processMovement, confirmDelete, deleteProduct
    };
})();

// Expose globally
const ProductsModule = Products;