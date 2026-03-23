import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../model';
import { addToCart } from '../cart.store';


@Component({
  selector: 'app-products-card',
  standalone: true,
  styleUrls: ['./productscard.css'],
  template: `
            <div class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
             <a
               [routerLink]="['/products/details']"
               [queryParams]="{
                 id: item().id,
                 category: item().category || 'general',
                 name: item().name,
                 price: item().price,
                 type: item().type || '',
                 image: item().image
               }"
             >
              <img
                [src]="item().image || 'vite.svg'"
                [alt]="item().name"
                class="w-full h-48 object-contain bg-gray-50 p-2 cursor-pointer"
              >
            </a> 
            <div class="p-4">
              <h3 class="font-bold text-lg">{{ item().name }}</h3>
              <p class="text-blue-600 font-bold mt-2">{{ item().price }} บาท</p>
              <button class="mt-4 w-full bg-gray-800 text-white py-2 rounded hover:bg-black" (click)="addItem()">
                เพิ่มลงตะกร้า
              </button>
            </div>
          </div>`,
  imports: [RouterLink],
})
export class ProductsCard {
  item = input.required<Product>();

  addItem() {
    const product = this.item();
    addToCart(product);
    alert(`เพิ่ม ${product.name} ลงตะกร้าแล้ว!`);
  }
}
