import { Product } from '../model';

const CATEGORIES = [
  'utility',
  'components',
  'electronics',
  'power',
  'sensors',
] as const;


export const PRODUCTS: Product[] = [
  {name: 'MINI FUNCTION GENERATOR', price: 1500, category: 'utility', image: 'test2.webp', id: 1},
  {name: 'ตัวแยก ISOLATOR', price: 1200, category: 'components', image: 'test2.webp', id: 2},
  {name: '2N3055 Transistor', price: 50, category: 'components', image: '2n3055.webp', id: 3, type:'NPN', voltage: 60},
  {name: 'Arduino Uno R3', price: 300, category: 'electronics', image: '2n3055.webp', id: 4},
  {name: 'Raspberry Pi 4', price: 3500, category: 'electronics', image: '2n3055.webp', id: 5},
  {name: 'DC Power Supply', price: 2500, category: 'power', image: 'test2.webp', id: 6},
  {name: 'Multimeter', price: 800, category: 'utility', image: 'test2.webp', id: 7},
  {name: 'Ultrasonic Sensor HC-SR04', price: 150, category: 'sensors', image: 'test2.webp', id: 8},
 
]


