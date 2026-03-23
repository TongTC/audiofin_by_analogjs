import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../model';
import { MOCK_PRODUCTS } from '../mocks/products.mock';

interface ProductDoc {
  id?: number;
  name?: string;
  price?: number;
  image?: string;
  category?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  getProducts(): Observable<Product[]> {
    return of(MOCK_PRODUCTS);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return of(MOCK_PRODUCTS.filter((product) => product.category === category));
  }
}
