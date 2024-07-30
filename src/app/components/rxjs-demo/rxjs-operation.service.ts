import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, ReplaySubject, AsyncSubject, interval, of, from, forkJoin } from 'rxjs';
import { map, filter, tap, mergeMap, switchMap, catchError, debounceTime, distinctUntilChanged, take, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RxjsOperationsService {
  private subject = new Subject<number>();
  private behaviorSubject = new BehaviorSubject<number>(0);
  private replaySubject = new ReplaySubject<number>(3);
  private asyncSubject = new AsyncSubject<number>();



  constructor() { }

  // Basic Observable
  getBasicObservable(): Observable<number> {
    return interval(1000).pipe(take(5));
  }

  // Subject operations
  emitToSubject(value: number): void {
    this.subject.next(value);
  }

  getSubject(): Observable<number> {
    return this.subject.asObservable();
  }

  // BehaviorSubject operations
  emitToBehaviorSubject(value: number): void {
    this.behaviorSubject.next(value);
  }

  getBehaviorSubject(): Observable<number> {
    return this.behaviorSubject.asObservable();
  }

  // ReplaySubject operations
  emitToReplaySubject(value: number): void {
    this.replaySubject.next(value);
  }

  getReplaySubject(): Observable<number> {
    return this.replaySubject.asObservable();
  }

  // AsyncSubject operations
  emitToAsyncSubject(value: number): void {
    this.asyncSubject.next(value);
  }

  completeAsyncSubject(): void {
    this.asyncSubject.complete();
  }

  getAsyncSubject(): Observable<number> {
    return this.asyncSubject.asObservable();
  }

  // Operator examples
  mapOperator(): Observable<string> {
    return of(1, 2, 3, 4, 5).pipe(
      map(num => `Number ${num}`)
    );
  }

  filterOperator(): Observable<number> {
    return of(1, 2, 3, 4, 5).pipe(
      filter(num => num % 2 === 0)
    );
  }

  tapOperator(): Observable<number> {
    return of(1, 2, 3, 4, 5).pipe(
      tap(num => console.log(`Tapped number: ${num}`))
    );
  }

  mergeMapOperator(): Observable<string> {
    return from([1, 2, 3]).pipe(
      mergeMap(num => of(`Merged ${num}`))
    );
  }

  switchMapOperator(): Observable<string> {
    return interval(1000).pipe(
      take(3),
      switchMap(num => of(`Switched ${num}`))
    );
  }

  catchErrorOperator(): Observable<string> {
    return new Observable<string>(observer => {
      observer.error('Error occurred');
    }).pipe(
      catchError((error: any) => {
        // Here we return an Observable of string
        return of(`Caught error: ${error}`);
      })
    );
  }

  debounceTimeOperator(input$: Observable<string>): Observable<string> {
    return input$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    );
  }

  forkJoinOperator(): Observable<[string, number, boolean]> {
    const observable1 = of('Hello').pipe(delay(1000));
    const observable2 = of(42).pipe(delay(2000));
    const observable3 = of(true).pipe(delay(3000));

    return forkJoin([observable1, observable2, observable3]);
  }
}
