import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { cartItems } from '../cart.store';
import { currentMember, isLoggedIn, logoutMember } from '../auth.store';

@Component({
  selector: 'app-nav',
  standalone: true,
  styleUrls: ['./navbar.component.css'],
  template: `<nav
      class="bg-white border-b border-gray-200 fixed w-full z-20 top-0 start-0"
    >
      <div
        class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
      >
        <!-- Logo -->
        <a
          routerLink="/"
          class="flex items-center space-x-3 text-blue-600 font-bold text-2xl"
        >
          Audio Fin
        </a>

        <!-- Right Side: Cart & Hamburger Button -->
        <div class="flex md:order-2 space-x-2">
          @if (isLoggedIn()) {
            <a
              routerLink="/member"
              class="hidden md:inline-flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              {{ currentMember()?.name }} ({{ currentMember()?.role === 'admin' ? 'admin' : 'user' }})
            </a>
            <a
              routerLink="/profile"
              class="hidden md:inline-flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              โปรไฟล์
            </a>
            <button
              type="button"
              (click)="onLogout()"
              class="hidden md:inline-flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              ออกจากระบบ
            </button>
          } @else {
            <a
              routerLink="/member"
              class="hidden md:inline-flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              เข้าสู่ระบบ
            </a>
          }

          <!-- Cart Icon -->
          <a
            routerLink="/cart"
            class="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            @if (cartCount() > 0) {
              <span
                class="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-1.5 rounded-full border-2 border-white"
              >
                {{ cartCount() }}
              </span>
            }
          </a>

          <!-- Hamburger Button (แสดงเฉพาะจอเล็ก) -->
          <!-- ปุ่ม Collapse แบบ Animated Hamburger -->
          <button
            (click)="toggleMenu()"
            class="md:hidden group relative w-10 h-10 flex flex-col justify-center items-center rounded-xl hover:bg-gray-100 transition-all"
          >
            <div class="space-y-1.5">
              <!-- เส้นบน -->
              <span
                class="block w-6 h-0.5 bg-gray-600 transition-all duration-300 ease-out"
                [class]="isMenuOpen() ? 'rotate-45 translate-y-2' : ''"
              ></span>
              <!-- เส้นกลาง -->
              <span
                class="block w-6 h-0.5 bg-gray-600 transition-all duration-300"
                [class]="isMenuOpen() ? 'opacity-0' : ''"
              ></span>
              <!-- เส้นล่าง -->
              <span
                class="block w-6 h-0.5 bg-gray-600 transition-all duration-300 ease-out"
                [class]="isMenuOpen() ? '-rotate-45 -translate-y-2' : ''"
              ></span>
            </div>
          </button>
        </div>

        <!-- Navigation Links (Collapsible) -->
        <div
          [class.hidden]="!isMenuOpen()"
          class="items-center justify-between w-full md:flex md:w-auto md:order-1"
        >
          <ul
            class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white"
          >
            <li>
              <a
                routerLink="/"
                (click)="closeMenu()"
                class="block py-2 px-3 text-gray-900 rounded hover:bg-blue-100 md:hover:bg-transparent md:hover:text-blue-700"
                >หน้าแรก</a
              >
            </li>
            <li>
              <a
                routerLink="/categories"
                (click)="closeMenu()"
                class="block py-2 px-3 text-gray-900 rounded hover:bg-blue-100 md:hover:bg-transparent md:hover:text-blue-700"
                >สินค้าตามหมวดหมู่</a
              >
            </li>
            <li>
              <a
                routerLink="/contact"
                (click)="closeMenu()"
                class="block py-2 px-3 text-gray-900 rounded hover:bg-blue-100 md:hover:bg-transparent md:hover:text-blue-700"
                >ติดต่อเรา</a
              >
            </li>
            <li>
              <a
                routerLink="/member"
                (click)="closeMenu()"
                class="block py-2 px-3 text-gray-900 rounded hover:bg-blue-100 md:hover:bg-transparent md:hover:text-blue-700"
                >สมาชิก</a
              >
            </li>
            @if (isLoggedIn()) {
              <li>
                <a
                  routerLink="/profile"
                  (click)="closeMenu()"
                  class="block py-2 px-3 text-gray-900 rounded hover:bg-blue-100 md:hover:bg-transparent md:hover:text-blue-700"
                  >โปรไฟล์</a
                >
              </li>
            }
          </ul>
        </div>
      </div>
    </nav>
    <div class="h-16"></div>`,
  imports: [RouterLink],
})
export class NavbarComponent {
  cartCount = computed(() =>
    cartItems().reduce((sum, item) => sum + (item.quantity ?? 1), 0)
  );

  // Signal สำหรับคุมการเปิด/ปิดเมนู
  isMenuOpen = signal(false);
  isLoggedIn = isLoggedIn;
  currentMember = currentMember;

  toggleMenu() {
    this.isMenuOpen.update((val) => !val);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  onLogout() {
    logoutMember();
    this.closeMenu();
  }
}
