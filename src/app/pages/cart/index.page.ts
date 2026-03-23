import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  cartItems,
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from '../../cart.store';
import { isLoggedIn } from '../../auth.store';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="cart-page">
      <div class="cart-header">
        <h1>รายละเอียดตะกร้าสินค้า</h1>
        <a routerLink="/" class="back-link">เลือกซื้อสินค้าต่อ</a>
      </div>

      @if (items().length > 0) {
        <section class="cart-list">
          @for (item of items(); track item.id) {
            <article class="cart-item">
              <img [src]="item.image || 'vite.svg'" [alt]="item.name" class="item-image" />
              <div class="item-info">
                <h3>{{ item.name }}</h3>
                <p>หมวดหมู่: {{ item.category || 'general' }}</p>
                <div class="qty-controls">
                  <button class="qty-btn" (click)="decrease(item.id)">-</button>
                  <span class="qty-value">{{ item.quantity }}</span>
                  <button class="qty-btn" (click)="increase(item.id)">+</button>
                </div>
              </div>
              <div class="item-actions">
                <p class="item-price">{{ item.price * item.quantity }} บาท</p>
                <button class="remove-btn" (click)="remove(item.id)">ลบสินค้า</button>
              </div>
            </article>
          }
        </section>

        <section class="cart-summary">
          <p>จำนวนสินค้า: <strong>{{ totalItems() }}</strong> ชิ้น</p>
          <p>ยอดรวมทั้งหมด: <strong>{{ totalPrice() }}</strong> บาท</p>
          <div class="summary-actions">
            <button class="clear-btn" (click)="clearAll()">ล้างตะกร้าทั้งหมด</button>
            <button class="checkout-btn" (click)="checkout()">ยืนยันสั่งซื้อ</button>
          </div>
        </section>
      } @else {
        <section class="empty-cart">
          <p>ตะกร้าของคุณยังว่างอยู่</p>
          <a routerLink="/" class="shop-button">ไปเลือกสินค้า</a>
        </section>
      }
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        padding: 1.5rem;
        background: linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%);
      }

      .cart-page {
        max-width: 960px;
        margin: 1.5rem auto;
        background: #fff;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
        color: #111;
      }

      .cart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .cart-header h1 {
        margin: 0;
        font-size: 1.5rem;
      }

      .back-link,
      .shop-button {
        text-decoration: none;
        color: #fff;
        background: #1f2937;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        display: inline-block;
      }

      .cart-list {
        display: grid;
        gap: 0.75rem;
      }

      .cart-item {
        display: grid;
        grid-template-columns: 80px 1fr auto;
        align-items: center;
        gap: 1rem;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 0.75rem;
      }

      .item-image {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        object-fit: cover;
        background: #f1f5f9;
      }

      .item-info h3 {
        margin: 0 0 0.25rem;
      }

      .item-info p,
      .item-price {
        margin: 0;
      }

      .qty-controls {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }

      .qty-btn {
        width: 28px;
        height: 28px;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        background: #f8fafc;
        cursor: pointer;
        color: #111;
      }

      .qty-value {
        min-width: 20px;
        text-align: center;
        font-weight: 700;
      }

      .item-actions {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.5rem;
      }

      .item-price {
        font-weight: 700;
      }

      .remove-btn,
      .clear-btn {
        border: 1px solid #d1d5db;
        background: #fff;
        color: #111;
        border-radius: 8px;
        padding: 0.4rem 0.7rem;
        cursor: pointer;
      }

      .clear-btn {
        margin-top: 0.75rem;
      }

      .summary-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 0.75rem;
      }

      .checkout-btn {
        border: 1px solid #1f2937;
        background: #1f2937;
        color: #fff;
        border-radius: 8px;
        padding: 0.4rem 0.7rem;
        cursor: pointer;
      }

      .cart-summary {
        margin-top: 1rem;
        border-top: 1px solid #e5e7eb;
        padding-top: 1rem;
        text-align: right;
      }

      .empty-cart {
        text-align: center;
        padding: 2rem 1rem;
      }

      @media (max-width: 720px) {
        .cart-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .cart-item {
          grid-template-columns: 64px 1fr;
        }

        .item-image {
          width: 64px;
          height: 64px;
        }

        .item-price {
          grid-column: 1 / -1;
          text-align: right;
        }

        .item-actions {
          grid-column: 1 / -1;
          align-items: flex-end;
        }

        .summary-actions {
          justify-content: flex-start;
        }
      }
    `,
  ],
})
export default class CartPage {
  private router = inject(Router);
  items = cartItems;
  isLoggedIn = isLoggedIn;

  totalItems = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.items().reduce(
      (sum, item) => sum + Number(item.price || 0) * item.quantity,
      0
    )
  );

  increase(productId: number) {
    increaseQuantity(productId);
  }

  decrease(productId: number) {
    decreaseQuantity(productId);
  }

  remove(productId: number) {
    removeFromCart(productId);
  }

  clearAll() {
    clearCart();
  }

  checkout() {
    if (this.items().length === 0) {
      return;
    }

    if (!this.isLoggedIn()) {
      alert('กรุณาเข้าสู่ระบบก่อนยืนยันสั่งซื้อ');
      this.router.navigateByUrl('/member');
      return;
    }

    const total = this.totalPrice();
    clearCart();
    alert(`สั่งซื้อสำเร็จ ยอดรวม ${total} บาท`);
  }
}
