import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { addToCart } from '../../cart.store';
import { Product } from '../../model';

@Component({
  standalone: true,
  template: `
  <main class="product-detail-container">
    <h2 style="text-align: start;"><b>รายละเอียดสินค้า</b></h2>

    @if (product) {
      <section class="product-layout">
        <div class="image-pane">
          <img [src]="product.image" alt="{{ product.name }}" class="product-image">
        </div>

        <div class="info-pane">
          <h2>{{ product.name }}</h2>
          <p>หมวดหมู่: {{ product.category }}</p>
          <p>ราคา: {{ product.price }} บาท</p>
          <div class="action-row">
            <button (click)="addToCart()">เพิ่มลงตะกร้า</button>
          </div>
        </div>
      </section>
    }

    @if (!product) {
      <div>
        <p>ไม่พบข้อมูลสินค้า</p>
      </div>
    }
  </main>
  `,
  styleUrls: ['details.page.scss']
})
export default class ProductDetailsPage {
  private route = inject(ActivatedRoute);
  queryParams = toSignal(this.route.queryParams);
  product: Product | null = null;

  ngOnInit() {
    const params = this.queryParams();
    if (!params?.['id']) {
      this.product = null;
      return;
    }

    this.product = {
      id: Number(params['id']),
      name: params['name'] || `สินค้า ${params['id']}`,
      price: Number(params['price'] ?? 0),
      category: params['category'] || 'general',
      image: params['image'] || 'vite.svg'
    };
  }

  addToCart() {
    if (this.product) {
      addToCart(this.product);
    }
  }
}
