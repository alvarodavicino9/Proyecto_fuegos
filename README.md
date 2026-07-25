# Fuegos — sitio web + pedidos

Sitio web para Fuegos (Ceres, Santa Fe): menú navegable, carrito de compras
y checkout de pedidos vía WhatsApp. Construido con React + TypeScript + Vite.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre en `http://localhost:5173`.

Para generar la versión de producción:

```bash
npm run build
npm run preview
```

## Estructura del proyecto

```
src/
  components/
    brand/     -> Logo (recreado en código, ver public/images/brand/README.md)
    cart/      -> Carrito lateral (CartDrawer) y línea de producto
    icons/     -> Íconos SVG propios (sin dependencias externas)
    layout/    -> Header, Footer, botón flotante de WhatsApp
    menu/      -> Tarjetas de producto, tabs de categoría, grilla
    ui/        -> Botón y campo de formulario reutilizables
  context/     -> CartContext (estado global del carrito, persiste en localStorage)
  data/        -> business.ts (datos del local) y menu.ts (productos y precios)
  pages/       -> Home.tsx (arma todas las secciones)
  sections/    -> Hero, historia de marca, sección de menú, ubicación
  types/       -> Tipos de TypeScript (menú y carrito)
  utils/       -> formatCurrency y generación del mensaje de WhatsApp
```

## Contenido pendiente de confirmar con el dueño

- **Nombres, descripciones y precios del menú**: son placeholders en
  `src/data/menu.ts`, marcados con un comentario al inicio del archivo.
  Editar ahí directamente (no hace falta tocar ningún componente).
- **Fotos de productos**: ver `public/images/menu/README.md`.
- **Logo en alta calidad**: ver `public/images/brand/README.md`.
- **Costo de envío / zonas de cobertura**: todavía no está definido en el
  checkout; por ahora el cliente escribe su dirección y el costo se
  coordina por WhatsApp.

## Cómo funciona el pedido

1. El cliente agrega productos al carrito desde el menú.
2. Elige retiro en el local o envío (con dirección) y método de pago
   (efectivo o transferencia).
3. Al confirmar, se abre WhatsApp con un mensaje ya redactado con el
   detalle del pedido, listo para enviar al número del local.

No hay pasarela de pago online todavía: el pago se coordina directamente
por WhatsApp, según lo definido para esta primera versión.

## Próximos pasos sugeridos

- Panel de administración para que el dueño edite menú/precios y vea
  pedidos entrantes sin tocar código (quedó pendiente para una siguiente
  etapa).
- Definir costos de envío por zona.
- Reemplazar contenido placeholder una vez que el dueño apruebe la página.
