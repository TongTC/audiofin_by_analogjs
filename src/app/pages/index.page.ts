
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { addToCart } from '../cart.store';
import { RouterLink } from '@angular/router';
import { Product } from '../model';
import { ProductsService } from '../services/products.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Hero Section -->
    <header class="bg-gray-900 text-white py-20 px-6 text-center">
      <h1 class="text-5xl font-bold mb-4">Electronics Components</h1>
      <p class="text-xl mb-8">Invent Your Idea from today</p>
      <button class="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-semibold">Shop now</button>
    </header>

    <!-- Product Grid -->
    <main class="max-w-7xl mx-auto py-12 px-6">
      <h2 class="text-3xl font-bold mb-8">สินค้าใหม่</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        @for (item of products(); track item.id) {
          <div class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
             <a
               [routerLink]="['/products/details']"
               [queryParams]="{
                 id: item.id,
                 category: item.category || 'general',
                 name: item.name,
                 price: item.price,
                 image: item.image
               }"
             >
              <img
                [src]="item.image"
                [alt]="item.name"
                class="w-full h-48 object-contain bg-gray-50 p-2 cursor-pointer"
              >
            </a> 
            <div class="p-4">
              <h3 class="font-bold text-lg">{{ item.name }}</h3>
              <p class="text-blue-600 font-bold mt-2">{{ item.price }} บาท</p>
              <button class="mt-4 w-full bg-gray-800 text-white py-2 rounded hover:bg-black" (click)="addItem(item)">
                เพิ่มลงตะกร้า
              </button>
            </div>
          </div>
        }
      </div>
    </main>
  `
})
export default class IndexPage {
  private productsService = inject(ProductsService);
  products = toSignal(this.productsService.getProducts(), { initialValue: [] as Product[] });

  addItem(product: Product) {
    addToCart(product);
    alert(`เพิ่ม ${product.name} ลงตะกร้าแล้ว!`);
  }
}
