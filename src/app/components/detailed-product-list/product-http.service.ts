import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
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
export class ProductHttpService {
  private apiUrl = 'https://fakestoreapi.com/products';
  private http = inject(HttpClient);

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }



  getAllProductsWithDetails(): Observable<Product[]> {
    return this.getAllProducts().pipe(
      mergeMap(products => {
        const productDetailsRequests = products.map(product =>
          this.getProduct(product.id)
        );
        return forkJoin(productDetailsRequests).pipe(
          map(detailedProducts => {
            return products.map((product, index) => ({
              ...product,
              details: detailedProducts[index]
            }));
          })
        );
      }),
      catchError(this.handleError)
    );
  }



  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Product>(this.apiUrl, product, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduct(id: number): Observable<Product> {
    return this.http.delete<Product>(`${this.apiUrl}/${id}`).pipe(
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
    return this.http.get<Product[]>(this.apiUrl).pipe(
      map((products: Product[]) => products.map(product => product.id)),
      catchError(this.handleError)
    );
  }
}
