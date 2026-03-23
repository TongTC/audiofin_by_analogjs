import { Product } from '../model';

const CATEGORIES = [
  'utility',
  'components',
  'electronics',
  'power',
  'sensors',
] as const;

const BASE_PRODUCTS = [
  { name: 'MINI FUNCTION GENERATOR', image: 'mini_function_gen.webp' },
  { name: 'ตัวแยก ISOLATOR', image: 'test2.webp' },
  { name: '2N3055 Transistor', image: '2n3055.webp' },
  { name: 'Digital Multimeter', image: 'vite.svg' },
  { name: 'DC Power Supply', image: 'vite.svg' },
  { name: 'Soldering Station', image: 'vite.svg' },
  { name: 'Oscilloscope Probe', image: 'vite.svg' },
  { name: 'Breadboard Kit', image: 'vite.svg' },
  { name: 'Arduino Compatible Board', image: 'vite.svg' },
  { name: 'ESP32 Module', image: 'ESP32-D-share.jpg' },
] as const;

export const MOCK_PRODUCTS: Product[] = Array.from({ length: 20 }, (_, index) => {
  const id = index + 1;
  const template = BASE_PRODUCTS[index % BASE_PRODUCTS.length];
  const category = CATEGORIES[index % CATEGORIES.length];

  return {
    id,
    name: `${template.name} #${id}`,
    price: 100 + id * 15,
    image: template.image,
    category,
  };
});
