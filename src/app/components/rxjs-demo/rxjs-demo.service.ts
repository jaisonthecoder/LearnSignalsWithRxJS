// rxjs-demo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, forkJoin, from } from 'rxjs';
import {
  map,
  catchError,
  retry,
  shareReplay,
  switchMap,
  mergeMap,
  delay,
  take,
  toArray,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RxjsDemoService {
  constructor(private http: HttpClient) {}

  searchApi(term: string): Observable<string> {
    // Simulated API call
    return of(`Search result for: ${term}`).pipe(
      delay(500) // Simulate network delay
    );
  }

  fetchData(data: { count: number; term: string }): Observable<any> {
    // Mock data
    const mockResponse = {
      results: Array(data.count)
        .fill(null)
        .map((_, i) => ({
          id: i + 1,
          title: `${data.term} Item ${i + 1}`,
        })),
    };

    return of(mockResponse).pipe(
      delay(1000), // Simulate network delay
      catchError((error) => {
        console.error('API error:', error);
        return throwError(() => new Error('API request failed'));
      })
    );
  }

  getNestedApiData(): Observable<any> {
    // Mock initial items
    const mockItems = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ];

    return of(mockItems).pipe(
      delay(500), // Simulate initial API call delay
      mergeMap((items) => {
        const detailedCalls = items.map((item) =>
          of({
            id: item.id,
            name: item.name,
            details: `Details for ${item.name}`,
          }).pipe(
            delay(Math.random() * 1000) // Simulate random delay for each detail call
          )
        );
        return forkJoin(detailedCalls);
      }),
      map((detailedItems) =>
        detailedItems.map((item) => ({ ...item, processed: true }))
      ),
      catchError((error) => {
        console.error('Error in nested API calls:', error);
        return throwError(() => new Error('Nested API calls failed'));
      }),
      retry(3),
      shareReplay(1)
    );

    // Notes:
    // It starts with a mock list of items.
    // mergeMap() is used to create a new Observable for each item, simulating fetching details for each item.
    // forkJoin() waits for all these "detail" Observables to complete and emits their results as an array.
    // map() is then used to add a processed flag to each item.
    // retry(3) will retry the entire operation up to 3 times if it fails.
    // shareReplay(1) caches the last emitted value, allowing multiple subscribers to receive the same data without triggering multiple executions.
  }

  getBookReviews(bookIds: number[]): Observable<any> {
    return from(bookIds).pipe(
      mergeMap((id) => this.getBookReview(id)),
      take(bookIds.length),
      toArray()
    );
  }

  private getBookReview(id: number): Observable<any> {
    return of({ id, review: `Review for book ${id}` }).pipe(
      delay(Math.random() * 2000) // Random delay between 0-2 seconds
    );
  }

  // fetchData(data: { count: number, term: string }): Observable<any> {
  //   // Simulated API call
  //   return this.http.get(`https://api.example.com/data?count=${data.count}&term=${data.term}`).pipe(
  //     catchError(error => {
  //       console.error('API error:', error);
  //       return throwError(() => new Error('API request failed'));
  //     })
  //   );
  // }

  // getNestedApiData(): Observable<any> {
  //   return this.http.get<any[]>('https://api.example.com/items').pipe(
  //     mergeMap(items => {
  //       const detailedCalls = items.map(item =>
  //         this.http.get(`https://api.example.com/items/${item.id}/details`)
  //       );
  //       return forkJoin(detailedCalls);
  //     }),
  //     map(detailedItems => detailedItems.map(item => ({ ...item, processed: true }))),
  //     catchError(error => {
  //       console.error('Error in nested API calls:', error);
  //       return throwError(() => new Error('Nested API calls failed'));
  //     }),
  //     retry(3),
  //     shareReplay(1)
  //   );
  // }

  // getBookReviews(bookIds: number[]): Observable<any> {
  //   return of(...bookIds).pipe(
  //     mergeMap(id => this.getBookReview(id)),
  //     take(bookIds.length),
  //     toArray()
  //   );
  // }

  // private getBookReview(id: number): Observable<any> {
  //   // Simulating an API call with random delay
  //   return of({ id, review: `Review for book ${id}` }).pipe(
  //     delay(Math.random() * 2000) // Random delay between 0-2 seconds
  //   );
  // }
}
