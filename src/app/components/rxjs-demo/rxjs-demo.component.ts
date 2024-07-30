import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { RxjsOperationsService } from './rxjs-operation.service';
import { RxjsDemoService } from './rxjs-demo.service';

@Component({
  selector: 'app-rxjs-demo',
  standalone: true,
  imports: [CommonModule],
  providers:[RxjsOperationsService, RxjsDemoService],
  template: `
    <h2>RxJS Demo</h2>
    <ul>
      <li *ngFor="let result of results">{{ result }}</li>
    </ul>
  `
})
export class RxjsDemoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  results: string[] = [];

  constructor(private rxjsService: RxjsOperationsService, private rxjsAPIService:RxjsDemoService) {}

  ngOnInit() {
    this.testBasicObservable();
    this.testSubject();
    this.testBehaviorSubject();
    this.testReplaySubject();
    this.testAsyncSubject();
    this.testOperators();

    this.testSearchApi();
    this.testFetchData();
    this.testNestedApiData();
    this.testBookReviews();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  testBasicObservable() {
    this.rxjsService.getBasicObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: number) => this.results.push(`Basic Observable: ${value}`));
  }

  testSubject() {
    this.rxjsService.getSubject()
      .pipe(takeUntil(this.destroy$))
      .subscribe((value:any) => this.results.push(`Subject: ${value}`));

    this.rxjsService.emitToSubject(1);
    this.rxjsService.emitToSubject(2);
    this.rxjsService.emitToSubject(3);
  }

  testBehaviorSubject() {
    this.rxjsService.getBehaviorSubject()
      .pipe(takeUntil(this.destroy$))
      .subscribe((value:any) => this.results.push(`BehaviorSubject: ${value}`));

    this.rxjsService.emitToBehaviorSubject(1);
    this.rxjsService.emitToBehaviorSubject(2);
  }

  testReplaySubject() {
    this.rxjsService.emitToReplaySubject(1);
    this.rxjsService.emitToReplaySubject(2);
    this.rxjsService.emitToReplaySubject(3);
    this.rxjsService.emitToReplaySubject(4);

    this.rxjsService.getReplaySubject()
      .pipe(takeUntil(this.destroy$))
      .subscribe((value:any) => this.results.push(`ReplaySubject: ${value}`));
  }

  testAsyncSubject() {
    this.rxjsService.getAsyncSubject()
      .pipe(takeUntil(this.destroy$))
      .subscribe((value:any) => this.results.push(`AsyncSubject: ${value}`));

    this.rxjsService.emitToAsyncSubject(1);
    this.rxjsService.emitToAsyncSubject(2);
    this.rxjsService.emitToAsyncSubject(3);
    this.rxjsService.completeAsyncSubject();
  }

  testOperators() {
    this.rxjsService.mapOperator()
      .pipe(takeUntil(this.destroy$))
      .subscribe((value:any) => this.results.push(`Map: ${value}`));

    this.rxjsService.filterOperator()
      .pipe(takeUntil(this.destroy$))
      .subscribe((value:any) => this.results.push(`Filter: ${value}`));

    this.rxjsService.tapOperator()
      .pipe(takeUntil(this.destroy$))
      .subscribe((value:any) => this.results.push(`Tap: ${value}`));

    this.rxjsService.mergeMapOperator()
      .pipe(takeUntil(this.destroy$))
      .subscribe((value:any) => this.results.push(`MergeMap: ${value}`));

    this.rxjsService.switchMapOperator()
      .pipe(takeUntil(this.destroy$))
      .subscribe((value:any) => this.results.push(`SwitchMap: ${value}`));

    this.rxjsService.catchErrorOperator()
      .pipe(takeUntil(this.destroy$))
      .subscribe((value:any) => this.results.push(`CatchError: ${value}`));
  }


  testForkJoin() {
    this.rxjsService.forkJoinOperator()
      .pipe(takeUntil(this.destroy$))
      .subscribe(([value1, value2, value3]: [string, number, boolean]) => {
        this.results.push(`ForkJoin: ${value1}, ${value2}, ${value3}`);
      });
  }




  testSearchApi() {
    this.rxjsAPIService.searchApi('RxJS')
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: string) => {
        this.results.push(`Search API: ${result}`);
      });
  }

  testFetchData() {
    this.rxjsAPIService.fetchData({ count: 5, term: 'Angular' })
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.results.push(`Fetch Data Error: ${error.message}`);
          return [];
        })
      )
      .subscribe((data: any) => {
        this.results.push(`Fetch Data: ${JSON.stringify(data)}`);
      });
  }

  testNestedApiData() {
    this.rxjsAPIService.getNestedApiData()
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.results.push(`Nested API Error: ${error.message}`);
          return [];
        })
      )
      .subscribe((data: any) => {
        this.results.push(`Nested API Data: ${JSON.stringify(data)}`);
      });
  }

  testBookReviews() {
    const bookIds = [1, 2, 3, 4, 5];
    this.rxjsAPIService.getBookReviews(bookIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe((reviews: any[]) => {
        reviews.forEach(review => {
          this.results.push(`Book Review: ${JSON.stringify(review)}`);
        });
      });
  }
}
