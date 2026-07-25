import type { MenuCategory, MenuItem } from '@/types/menu'

// ─────────────────────────────────────────────────────────────────────────
// ⚠️ CONTENIDO PROVISORIO
// Nombres, descripciones y precios son placeholders para poder mostrarle
// una versión navegable y funcional al dueño. Reemplazar acá una vez que
// confirme el menú definitivo. Las fotos reales van en /public/images/menu
// (ver README) y se enlazan seteando el campo `image` de cada item.
// El campo `ingredients` alimenta el checkbox "Quitar ingredientes" del
// modal de personalización (ver components/menu/ProductModal.tsx).
// ─────────────────────────────────────────────────────────────────────────

export const categories: MenuCategory[] = [
  { id: 'hamburguesas', label: 'Hamburguesas' },
  { id: 'sandwiches', label: 'Sandwiches' },
  { id: 'para-picar', label: 'Para picar' },
]

export const menuItems: MenuItem[] = [
  // Hamburguesas
  {
    id: 'burger-clasica',
    categoryId: 'hamburguesas',
    name: 'Clásica',
    description: 'Doble medallón smash, cheddar, cebolla y salsa de la casa.',
    price: 6500,
    tags: ['más pedida'],
    image: '/images/menu/clasica.png',
    ingredients: ['Cheddar', 'Cebolla', 'Salsa de la casa'],
  },
  {
    id: 'burger-doble-cheddar',
    categoryId: 'hamburguesas',
    name: 'Doble Cheddar',
    description: 'Doble medallón smash, doble cheddar y cebolla caramelizada.',
    price: 7200,
    image: '/images/menu/doble-cheddar.jpg.png',
    ingredients: ['Cheddar', 'Cebolla caramelizada'],
  },
  {
    id: 'burger-bacon-huevo',
    categoryId: 'hamburguesas',
    name: 'Bacon & Huevo',
    description: 'Medallón smash, bacon crocante, huevo frito y cheddar.',
    price: 7800,
    image: '/images/menu/bacon-huevo.jpg.png',
    ingredients: ['Bacon', 'Huevo frito', 'Cheddar'],
  },
  {
    id: 'burger-crispy-onion',
    categoryId: 'hamburguesas',
    name: 'Crispy Onion',
    description: 'Doble medallón, cheddar, bacon, cebolla crispy y salsa ahumada.',
    price: 7900,
    image: '/images/menu/crispy-onion.jpg.png',
    ingredients: ['Cheddar', 'Bacon', 'Cebolla crispy', 'Salsa ahumada'],
  },
  {
    id: 'burger-blue-cheese',
    categoryId: 'hamburguesas',
    name: 'Blue Cheese',
    description: 'Medallón smash, salsa de queso azul, morrones asados y provolone.',
    price: 8200,
    tags: ['especial'],
    image: '/images/menu/blue-cheese.png',
    ingredients: ['Salsa de queso azul', 'Morrones asados', 'Provolone'],
  },
  {
    id: 'burger-black',
    categoryId: 'hamburguesas',
    name: 'Black Fuegos',
    description: 'Pan negro de carbón activado, doble medallón y cheddar fundido.',
    price: 8500,
    tags: ['especial'],
    image: '/images/menu/black-fuegos.png',
    ingredients: ['Cheddar'],
  },
  {
    id: 'burger-smash-doble',
    categoryId: 'hamburguesas',
    name: 'Smash Doble',
    description: 'Doble medallón smash bien marcado, queso cheddar derretido y pan brioche tostado.',
    price: 6700,
    image: '/images/menu/smash-tecnica.jpg.png',
    ingredients: ['Cheddar'],
  },
  {
    id: 'burger-onion-cheddar',
    categoryId: 'hamburguesas',
    name: 'Onion Cheddar',
    description: 'Doble medallón smash, cebolla caramelizada y doble cheddar fundido.',
    price: 7100,
    image: '/images/menu/onion-cheddar.jpg.png',
    ingredients: ['Cheddar', 'Cebolla caramelizada'],
  },
  {
    id: 'burger-fresca',
    categoryId: 'hamburguesas',
    name: 'Fresca',
    description: 'Medallón smash, lechuga, tomate y salsa de la casa.',
    price: 6600,
    image: '/images/menu/napolitana-style.jpg.png',
    ingredients: ['Lechuga', 'Tomate', 'Salsa de la casa'],
  },

  // Sandwiches (lomos y milas)
  {
    id: 'lomito-clasico',
    categoryId: 'sandwiches',
    name: 'Lomito Clásico',
    description: 'Lomito de cerdo, jamón, queso, lechuga y tomate.',
    price: 7000,
    ingredients: ['Jamón', 'Queso', 'Lechuga', 'Tomate'],
  },
  {
    id: 'lomito-completo',
    categoryId: 'sandwiches',
    name: 'Lomito Completo',
    description: 'Lomito, jamón, queso, huevo, panceta, lechuga y tomate.',
    price: 8300,
    ingredients: ['Jamón', 'Queso', 'Huevo', 'Panceta', 'Lechuga', 'Tomate'],
  },
  {
    id: 'mila-napolitana',
    categoryId: 'sandwiches',
    name: 'Milanesa Napolitana',
    description: 'Milanesa de carne, salsa, jamón y muzzarella gratinada.',
    price: 7500,
    ingredients: ['Salsa', 'Jamón', 'Muzzarella'],
  },
  {
    id: 'mila-caballo',
    categoryId: 'sandwiches',
    name: 'Milanesa a Caballo',
    description: 'Milanesa de carne, huevos fritos, lechuga y tomate.',
    price: 7300,
    ingredients: ['Huevos fritos', 'Lechuga', 'Tomate'],
  },

  // Para picar
  {
    id: 'nuggets',
    categoryId: 'para-picar',
    name: 'Nuggets de Pollo',
    description: '10 unidades caseras con salsa a elección.',
    price: 5500,
    image: '/images/menu/nuggets.jpg.png',
  },
  {
    id: 'bastones-muzzarella',
    categoryId: 'para-picar',
    name: 'Bastones de Muzzarella',
    description: '8 unidades crocantes con salsa a elección.',
    price: 5200,
  },
  {
    id: 'papas-fritas',
    categoryId: 'para-picar',
    name: 'Papas Fritas',
    description: 'Porción grande, corte clásico.',
    price: 3800,
  },
  {
    id: 'papas-cheddar-bacon',
    categoryId: 'para-picar',
    name: 'Papas Cheddar & Bacon',
    description: 'Porción grande con cheddar fundido y bacon.',
    price: 5400,
    ingredients: ['Cheddar', 'Bacon'],
  },
]
