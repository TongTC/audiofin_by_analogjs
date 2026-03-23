import { signal } from '@angular/core';
import { Product } from './model';

const CART_STORAGE_KEY = 'analogjs_cart_items';

// 1. ประกาศตัวแปรไว้ข้างนอก Class เพื่อให้เป็น Global State
// ข้อมูลจะถูกสร้างทันทีที่ไฟล์นี้ถูกโหลด (เมื่อแอปเริ่มทำงาน)
export interface CartItem extends Product {
	quantity: number;
}

function canUseStorage(): boolean {
	return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function sanitizeCartItems(items: unknown): CartItem[] {
	if (!Array.isArray(items)) {
		return [];
	}

	return items
		.filter((item): item is CartItem => {
			return (
				typeof item === 'object' &&
				item !== null &&
				typeof (item as CartItem).id === 'number' &&
				typeof (item as CartItem).name === 'string' &&
				typeof (item as CartItem).price === 'number' &&
				typeof (item as CartItem).quantity === 'number'
			);
		})
		.map((item) => ({ ...item, quantity: Math.max(1, Math.trunc(item.quantity)) }));
}

function loadCartFromStorage(): CartItem[] {
	if (!canUseStorage()) {
		return [];
	}

	try {
		const raw = window.localStorage.getItem(CART_STORAGE_KEY);
		if (!raw) {
			return [];
		}
		return sanitizeCartItems(JSON.parse(raw));
	} catch {
		return [];
	}
}

function saveCartToStorage(items: CartItem[]) {
	if (!canUseStorage()) {
		return;
	}

	window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export const cartItems = signal<CartItem[]>(loadCartFromStorage());

export function addToCart(product: Product) {
	cartItems.update((items) => {
		const index = items.findIndex((item) => item.id === product.id);
		if (index === -1) {
			const updated = [...items, { ...product, quantity: 1 }];
			saveCartToStorage(updated);
			return updated;
		}

		const updated = items.map((item, i) =>
			i === index ? { ...item, quantity: item.quantity + 1 } : item
		);
		saveCartToStorage(updated);
		return updated;
	});
}

export function increaseQuantity(productId: number) {
	cartItems.update((items) => {
		const updated = items.map((item) =>
			item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
		);
		saveCartToStorage(updated);
		return updated;
	});
}

export function decreaseQuantity(productId: number) {
	cartItems.update((items) => {
		const updated = items
			.map((item) =>
				item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
			)
			.filter((item) => item.quantity > 0);
		saveCartToStorage(updated);
		return updated;
	});
}

export function removeFromCart(productId: number) {
	cartItems.update((items) => {
		const updated = items.filter((item) => item.id !== productId);
		saveCartToStorage(updated);
		return updated;
	});
}

export function clearCart() {
	cartItems.set([]);
	saveCartToStorage([]);
}
