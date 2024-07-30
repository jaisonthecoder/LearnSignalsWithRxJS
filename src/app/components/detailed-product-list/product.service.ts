import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, from, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://fakestoreapi.com/products';
  private http = inject(HttpClient);

  getAllProducts(): Observable<Product[]> {
    return from(fetch(this.apiUrl)).pipe(
      mergeMap(response => {
        if (!response.ok) throw new Error(response.statusText);
        return from(response.json() as Promise<Product[]>);
      }),
      catchError(this.handleError)
    );
  }

  getProduct(id: number): Observable<Product> {
    return from(fetch(`${this.apiUrl}/${id}`)).pipe(
      mergeMap(response => {
        if (!response.ok) throw new Error(response.statusText);
        return from(response.json() as Promise<Product>);
      }),
      catchError(this.handleError)
    );
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return from(fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    })).pipe(
      mergeMap(response => {
        if (!response.ok) throw new Error(response.statusText);
        return from(response.json() as Promise<Product>);
      }),
      catchError(this.handleError)
    );
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return from(fetch(`${this.apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    })).pipe(
      mergeMap(response => {
        if (!response.ok) throw new Error(response.statusText);
        return from(response.json() as Promise<Product>);
      }),
      catchError(this.handleError)
    );
  }

  deleteProduct(id: number): Observable<Product> {
    return from(fetch(`${this.apiUrl}/${id}`, { method: 'DELETE' })).pipe(
      mergeMap(response => {
        if (!response.ok) throw new Error(response.statusText);
        return from(response.json() as Promise<Product>);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('An error occurred; please try again later.'));
  }




  getAllProductsDetailed(): Observable<Product[]> {
    return this.getAllProductIds().pipe(
      mergeMap(ids => forkJoin(ids.map(id => this.getProduct(id)))),
      catchError(this.handleError)
    );
  }

  private getAllProductIds(): Observable<number[]> {
    return from(fetch(`${this.apiUrl}`)).pipe(
      map((response:any) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      }),
      map((products: Product[]) => products.map(product => product.id)),
      catchError(this.handleError)
    );
  }

}
