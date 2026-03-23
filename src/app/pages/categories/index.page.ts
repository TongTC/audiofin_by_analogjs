import { Component, inject, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Product } from 'src/app/model';
import { addToCart } from '../../cart.store';
import { ProductsService } from '../../services/products.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  template: `<main class="max-w-7xl mx-auto px-4 py-10 md:py-12">
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <!-- Sidebar Categories -->
      <aside class="lg:col-span-1">
        <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 class="font-bold text-lg text-gray-800 mb-4">หมวดหมู่</h2>
          <nav class="space-y-2">
            <a
              routerLink="/categories"
              [ngClass]="{
                'bg-blue-600 text-white': !selectedCategory(),
                'text-gray-700 hover:bg-blue-600 hover:text-white': selectedCategory()
              }"
              class="block px-4 py-2 rounded-lg transition-colors"
            >
              ทั้งหมด
            </a>
            @for (cat of categories; track cat) {
              <a
                [routerLink]="'/categories/' + cat"
                [ngClass]="{
                  'bg-blue-600 text-white': selectedCategory() === cat,
                  'text-gray-700 hover:bg-blue-600 hover:text-white': selectedCategory() !== cat
                }"
                class="block px-4 py-2 rounded-lg transition-colors capitalize"
              >
                {{ cat }}
              </a>
            }
          </nav>
        </div>
      </aside>

      <!-- Main Content -->
      <section class="lg:col-span-4">
        <header class="mb-8 md:mb-10">
          <h1 class="text-3xl font-bold text-gray-800 capitalize">
            @if (selectedCategory()) {
              หมวดหมู่: <span class="text-blue-600">{{ selectedCategory() }}</span>
            } @else {
              <span class="text-white">สินค้าทั้งหมด</span>
            }
          </h1>
          <p class="text-gray-500 mt-2">พบสินค้าทั้งหมด {{ filteredProducts().length }} รายการ</p>

          <form class="mt-5 flex flex-col sm:flex-row gap-3" (submit)="$event.preventDefault()">
            <input
              name="search"
              type="text"
              [ngModel]="searchTerm()"
              (ngModelChange)="searchTerm.set($event)"
              placeholder="ค้นหาสินค้า เช่น transistor, utility, 1200"
              class="w-full sm:flex-1 rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="button"
              class="rounded-xl border border-slate-900 bg-slate-900 px-4 py-2.5 text-white hover:bg-blue-600 hover:border-blue-600 transition-colors"
            >
              ค้นหา
            </button>
            <button
              type="button"
              (click)="clearSearch()"
              class="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ล้าง
            </button>
          </form>
        </header>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (product of filteredProducts(); track product.id) {
            <article class="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300">
              <img
                [src]="product.image || 'vite.svg'"
                [alt]="product.name"
                class="h-44 w-full object-contain bg-gray-50 p-3"
              />
              <div class="p-5">
                <h3 class="font-bold text-lg text-gray-800 line-clamp-2">{{ product.name }}</h3>
                <p class="text-blue-600 font-bold mt-2">{{ product.price }} บาท</p>
                <button
                  (click)="addItem(product)"
                  class="mt-4 w-full py-2 bg-gray-900 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  เพิ่มลงตะกร้า
                </button>
              </div>
            </article>
          } @empty {
            <div class="col-span-full rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
              ไม่พบสินค้าในหมวดหมู่นี้
            </div>
          }
        </div>
      </section>
    </div>
  </main>`,
})
export default class CategoriesPage {
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  
  // ดึง Param ชื่อ categoryName จาก URL
  categoryName = toSignal(this.route.params);
  allProducts = toSignal(this.productsService.getProducts(), { initialValue: [] as Product[] });
  selectedCategory = computed(() => this.categoryName()?.['categoryName'] as string | undefined);
  searchTerm = signal('');
  categories = ['utility', 'components', 'electronics', 'power', 'sensors'];

  // กรองสินค้าตามหมวดหมู่จาก URL และคำค้นจากฟอร์ม
  filteredProducts = computed(() => {
    const cat = this.selectedCategory();
    const keyword = this.searchTerm().trim().toLowerCase();

    let products = this.allProducts();
    if (cat) {
      products = products.filter((product) => product.category === cat);
    }

    if (!keyword) {
      return products;
    }

    return products.filter((product) => {
      const name = product.name.toLowerCase();
      const category = (product.category ?? '').toLowerCase();
      const price = String(product.price);
      return name.includes(keyword) || category.includes(keyword) || price.includes(keyword);
    });
  });

  clearSearch() {
    this.searchTerm.set('');
  }

  addItem(product: Product) {
    addToCart(product);
    alert(`เพิ่ม ${product.name} ลงตะกร้าแล้ว!`);
  }
}
