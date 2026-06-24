# 🔥 Inventory Control System - AAA

<p align="center">
  <strong>Sistema Profesional de Control de Inventario</strong><br>
  <em>Gestion de stock en tiempo real con interfaz SaaS moderna</em>
</p>

<p align="center">
  <a href="https://caos1codex-hash.github.io/inventory-control-system/" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20Site-4f46e5?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo">
  </a>
  <img src="https://img.shields.io/badge/Status-Production%20Ready-10b981?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Version-1.0.0-6366f1?style=for-the-badge" alt="Version">
</p>

---

## 📋 Descripcion

Sistema completo de gestion de inventario disenado con estandares de calidad AAA. Aplicacion web SPA (Single Page Application) con persistencia de datos en LocalStorage, interfaz moderna tipo SaaS empresarial, y funcionalidades profesionales de control de stock.

## 🚀 Demo en Vivo

👉 **[https://caos1codex-hash.github.io/inventory-control-system/](https://caos1codex-hash.github.io/inventory-control-system/)**

**Credenciales de acceso:**
- Usuario: `admin`
- Contrasena: `admin123`

## ✨ Caracteristicas Principales

### 📊 Dashboard Profesional
- KPIs en tiempo real (productos, valor total, alertas, movimientos)
- Graficos interactivos con Chart.js
- Vista rapida de ultimos movimientos
- Panel de alertas de stock integrado

### 📦 Gestion de Productos
- CRUD completo (crear, editar, eliminar)
- Codigo SKU unico por producto
- Categorias con colores asignados
- Control de stock minimo por producto
- Busqueda en tiempo real
- Filtros por categoria
- Movimiento rapido de stock desde la vista de producto

### 🔁 Movimientos de Inventario
- Registro de entradas y salidas
- Historial completo con fechas y usuarios
- Filtros por tipo (entrada/salida)
- Validacion de stock disponible
- Busqueda por producto o motivo

### ⚠️ Alertas Inteligentes
- Deteccion automatica de stock bajo
- Alertas criticas para productos agotados
- Indicador visual con badge de notificaciones
- Accion directa de reabastecimiento desde alertas

### 📈 Reportes Profesionales
- 3 tipos de reporte: Inventario, Movimientos, Valoracion
- Filtros por fecha y categoria
- Graficos de distribucion por categoria
- Exportacion a CSV descargable
- Calculos de margen bruto

### 🎨 Diseno UI/UX
- Estilo SaaS moderno (inspirado en Stripe, Vercel, Linear)
- Dark mode / Light mode con persistencia
- Animaciones suaves y microinteracciones
- Sidebar profesional responsive
- 100% responsive (mobile, tablet, desktop)
- Tipografia Inter
- Iconografia SVG consistente

## 🛠 Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 | Estructura semantica |
| CSS3 | Design system personalizado |
| JavaScript ES6+ | Logica de aplicacion SPA |
| TailwindCSS | Utilidades de estilos |
| Chart.js 4 | Graficos interactivos |
| LocalStorage | Persistencia de datos |

## 📁 Estructura del Proyecto

```
inventory-control-system/
├── index.html          # Entry point - SPA shell
├── css/
│   └── styles.css      # Design system completo
├── js/
│   ├── data.js         # DataStore + modelos + seed data
│   ├── auth.js         # Autenticacion simple
│   ├── app.js          # Controlador principal + routing
│   ├── dashboard.js    # Dashboard + KPIs + graficos
│   ├── products.js     # CRUD de productos
│   ├── movements.js    # Movimientos de inventario
│   └── reports.js      # Reportes + exportacion CSV
├── assets/             # Assets estaticos
└── README.md           # Documentacion
```

## 🧠 Modelo de Datos

### Productos
```json
{
  "id": "prod-001",
  "name": "Monitor Dell 27\"",
  "sku": "MON-DLL-27",
  "category": "cat-1",
  "price": 349.99,
  "cost": 220.00,
  "stock": 45,
  "minStock": 10,
  "unit": "unidad",
  "description": "Monitor IPS 27 pulgadas...",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

### Movimientos
```json
{
  "id": "mov-001",
  "productId": "prod-001",
  "type": "entrada",
  "quantity": 50,
  "reason": "Compra inicial proveedor",
  "user": "Admin",
  "date": "2025-01-15T10:35:00Z"
}
```

## 🔐 Seguridad

El sistema implementa autenticacion basica para proteccion del panel administrativo. Las credenciales se validan del lado del cliente. Para produccion, se recomienda integrar un backend con autenticacion robusta.

## 📱 Responsive

La aplicacion esta optimizada para todos los dispositivos:
- **Desktop**: Layout completo con sidebar fijo
- **Tablet**: Sidebar colapsable con overlay
- **Mobile**: Navegacion hamburguesa, tablas scrollables

## 🚀 Como Ejecutar Localmente

1. Clonar el repositorio
```bash
git clone https://github.com/caos1codex-hash/inventory-control-system.git
cd inventory-control-system
```

2. Abrir `index.html` en un navegador o usar un servidor local
```bash
npx serve .
# o
python -m http.server 8080
```

## 📄 Licencia

Este proyecto es de uso libre para fines educativos y profesionales.

---

<p align="center">
  Desarrollado con nivel AAA ⚡
</p>