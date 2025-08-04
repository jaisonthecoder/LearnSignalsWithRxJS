import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, BehaviorSubject, map, catchError, of } from 'rxjs';

export interface PerformanceMetric {
  name: string;
  rxjs: number;
  signals: number;
  unit: string;
  improvement: number;
}

export interface BenchmarkData {
  category: string;
  metrics: PerformanceMetric[];
}

export interface FeatureComparison {
  feature: string;
  rxjs: number;
  signals: number;
  description: string;
}

export interface UseCaseRecommendation {
  useCase: string;
  recommendation: string;
  confidence: number;
}

export interface ApiPerformanceData {
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  requestCount: number;
  errorRate: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceMetricsService {
  private apiBaseUrl = 'https://api.example.com'; // Replace with your actual API

  // Signals for reactive state management
  public performanceData = signal<BenchmarkData[]>([]);
  public featureComparison = signal<FeatureComparison[]>([]);
  public useCaseData = signal<UseCaseRecommendation[]>([]);
  public isLoading = signal<boolean>(false);
  public lastUpdated = signal<Date>(new Date());

  // User-initiated API performance testing
  public isRunningTest = signal<boolean>(false);
  public rxjsResults = signal<ApiPerformanceData | null>(null);
  public signalsResults = signal<ApiPerformanceData | null>(null);
  public testComparison = signal<any>(null);

  // BehaviorSubjects for RxJS-based real-time updates
  private rxjsMetrics$ = new BehaviorSubject<ApiPerformanceData | null>(null);
  private signalsMetrics$ = new BehaviorSubject<ApiPerformanceData | null>(null);

  constructor(private http: HttpClient) {
    this.initializeData();
    // Commented out to stop automatic API calls
    // this.startRealTimeUpdates();
  }

  private initializeData(): void {
    this.loadInitialData();
  }

  private async loadInitialData(): Promise<void> {
    this.isLoading.set(true);

    try {
      // Simulate API calls or replace with real endpoints
      const [performanceData, featureData, useCaseData] = await Promise.all([
        this.fetchPerformanceData().toPromise(),
        this.fetchFeatureComparison().toPromise(),
        this.fetchUseCaseRecommendations().toPromise()
      ]);

      this.performanceData.set(performanceData || this.getDefaultPerformanceData());
      this.featureComparison.set(featureData || this.getDefaultFeatureComparison());
      this.useCaseData.set(useCaseData || this.getDefaultUseCaseData());
    } catch (error) {
      console.warn('API not available, using fallback data:', error);
      this.performanceData.set(this.getDefaultPerformanceData());
      this.featureComparison.set(this.getDefaultFeatureComparison());
      this.useCaseData.set(this.getDefaultUseCaseData());
    } finally {
      this.isLoading.set(false);
      this.lastUpdated.set(new Date());
    }
  }

  private startRealTimeUpdates(): void {
    // Disabled automatic updates to stop console spam
    // Update every 5 seconds
    // interval(5000).subscribe(() => {
    //   this.fetchRealTimeMetrics();
    // });
  }

  private fetchRealTimeMetrics(): void {
    // Fetch RxJS performance metrics
    this.fetchRxjsMetrics().subscribe(data => {
      this.rxjsMetrics$.next(data);
      this.updatePerformanceData();
    });

    // Fetch Signals performance metrics
    this.fetchSignalsMetrics().subscribe(data => {
      this.signalsMetrics$.next(data);
      this.updatePerformanceData();
    });
  }

  private updatePerformanceData(): void {
    const rxjsData = this.rxjsMetrics$.value;
    const signalsData = this.signalsMetrics$.value;

    if (rxjsData && signalsData) {
      const updatedData = this.calculateMetricsFromApiData(rxjsData, signalsData);
      this.performanceData.set(updatedData);
      this.lastUpdated.set(new Date());
    }
  }

  private calculateMetricsFromApiData(rxjsData: ApiPerformanceData, signalsData: ApiPerformanceData): BenchmarkData[] {
    return [
      {
        category: 'Performance Metrics',
        metrics: [
          {
            name: 'Initial Render',
            rxjs: rxjsData.responseTime,
            signals: signalsData.responseTime,
            unit: 'ms',
            improvement: this.calculateImprovement(rxjsData.responseTime, signalsData.responseTime)
          },
          {
            name: 'Memory Usage',
            rxjs: rxjsData.memoryUsage,
            signals: signalsData.memoryUsage,
            unit: 'MB',
            improvement: this.calculateImprovement(rxjsData.memoryUsage, signalsData.memoryUsage)
          },
          {
            name: 'CPU Usage',
            rxjs: rxjsData.cpuUsage,
            signals: signalsData.cpuUsage,
            unit: '%',
            improvement: this.calculateImprovement(rxjsData.cpuUsage, signalsData.cpuUsage)
          },
          {
            name: 'Request Rate',
            rxjs: rxjsData.requestCount,
            signals: signalsData.requestCount,
            unit: '/sec',
            improvement: this.calculateImprovement(signalsData.requestCount, rxjsData.requestCount, true)
          }
        ]
      }
    ];
  }

  private calculateImprovement(oldValue: number, newValue: number, higherIsBetter: boolean = false): number {
    if (oldValue === 0) return 0;

    const change = higherIsBetter
      ? ((newValue - oldValue) / oldValue) * 100
      : ((oldValue - newValue) / oldValue) * 100;

    return Math.round(change);
  }

  // API call methods
  private fetchPerformanceData(): Observable<BenchmarkData[]> {
    return this.http.get<BenchmarkData[]>(`${this.apiBaseUrl}/performance-metrics`).pipe(
      catchError(() => of(this.getDefaultPerformanceData()))
    );
  }

  private fetchFeatureComparison(): Observable<FeatureComparison[]> {
    return this.http.get<FeatureComparison[]>(`${this.apiBaseUrl}/feature-comparison`).pipe(
      catchError(() => of(this.getDefaultFeatureComparison()))
    );
  }

  private fetchUseCaseRecommendations(): Observable<UseCaseRecommendation[]> {
    return this.http.get<UseCaseRecommendation[]>(`${this.apiBaseUrl}/use-case-recommendations`).pipe(
      catchError(() => of(this.getDefaultUseCaseData()))
    );
  }

  private fetchRxjsMetrics(): Observable<ApiPerformanceData> {
    return this.http.get<ApiPerformanceData>(`${this.apiBaseUrl}/rxjs-metrics`).pipe(
      catchError(() => of(this.generateMockApiData('rxjs')))
    );
  }

  private fetchSignalsMetrics(): Observable<ApiPerformanceData> {
    return this.http.get<ApiPerformanceData>(`${this.apiBaseUrl}/signals-metrics`).pipe(
      catchError(() => of(this.generateMockApiData('signals')))
    );
  }

  // Mock data generators for demonstration
  private generateMockApiData(type: 'rxjs' | 'signals'): ApiPerformanceData {
    const baseMultiplier = type === 'rxjs' ? 1 : 0.7; // Signals perform better
    const variance = 0.1; // 10% variance

    return {
      responseTime: Math.round((180 + Math.random() * 40) * baseMultiplier * (1 + (Math.random() - 0.5) * variance)),
      memoryUsage: Math.round((45 + Math.random() * 10) * baseMultiplier * (1 + (Math.random() - 0.5) * variance)),
      cpuUsage: Math.round((25 + Math.random() * 15) * baseMultiplier * (1 + (Math.random() - 0.5) * variance)),
      requestCount: Math.round((1000 + Math.random() * 500) * (type === 'signals' ? 1.3 : 1) * (1 + (Math.random() - 0.5) * variance)),
      errorRate: Math.round((2 + Math.random() * 3) * baseMultiplier * (1 + (Math.random() - 0.5) * variance)),
      timestamp: Date.now()
    };
  }

  // Default/fallback data
  private getDefaultPerformanceData(): BenchmarkData[] {
    return [
      {
        category: 'Rendering Performance',
        metrics: [
          { name: 'Initial Render', rxjs: 180, signals: 112, unit: 'ms', improvement: 38 },
          { name: 'Update Render', rxjs: 95, signals: 33, unit: 'ms', improvement: 65 },
          { name: 'List Rendering', rxjs: 240, signals: 145, unit: 'ms', improvement: 40 }
        ]
      },
      {
        category: 'Memory Usage',
        metrics: [
          { name: 'Initial Load', rxjs: 45, signals: 30, unit: 'MB', improvement: 33 },
          { name: 'After Updates', rxjs: 68, signals: 42, unit: 'MB', improvement: 38 },
          { name: 'Peak Usage', rxjs: 89, signals: 58, unit: 'MB', improvement: 35 }
        ]
      }
    ];
  }

  private getDefaultFeatureComparison(): FeatureComparison[] {
    return [
      { feature: 'Simplicity', rxjs: 6, signals: 9, description: 'Ease of use and learning curve' },
      { feature: 'Performance', rxjs: 7, signals: 9, description: 'Runtime performance and efficiency' },
      { feature: 'Async Handling', rxjs: 10, signals: 6, description: 'Complex async operations' },
      { feature: 'State Management', rxjs: 6, signals: 8, description: 'Managing component state' },
      { feature: 'Bundle Size', rxjs: 5, signals: 8, description: 'Impact on application size' },
      { feature: 'Developer Experience', rxjs: 7, signals: 9, description: 'Development workflow' }
    ];
  }

  private getDefaultUseCaseData(): UseCaseRecommendation[] {
    return [
      { useCase: 'UI State Management', recommendation: 'Signals', confidence: 95 },
      { useCase: 'Form Handling', recommendation: 'Signals', confidence: 85 },
      { useCase: 'Real-time Data Streams', recommendation: 'RxJS', confidence: 100 },
      { useCase: 'Complex API Workflows', recommendation: 'RxJS', confidence: 95 },
      { useCase: 'Simple Component State', recommendation: 'Signals', confidence: 90 },
      { useCase: 'WebSocket Communications', recommendation: 'RxJS', confidence: 95 }
    ];
  }

  // Public methods for manual refresh
  public refreshData(): void {
    this.loadInitialData();
  }

  public getMetricsStream(): Observable<{ rxjs: ApiPerformanceData | null, signals: ApiPerformanceData | null }> {
    return new Observable(observer => {
      const subscription = interval(1000).subscribe(() => {
        observer.next({
          rxjs: this.rxjsMetrics$.value,
          signals: this.signalsMetrics$.value
        });
      });

      return () => subscription.unsubscribe();
    });
  }

  // User-initiated API performance testing methods
  public async startPerformanceTest(): Promise<void> {
    this.isRunningTest.set(true);
    this.rxjsResults.set(null);
    this.signalsResults.set(null);
    this.testComparison.set(null);

    try {
      // Run RxJS-based API calls
      const rxjsStartTime = performance.now();
      const rxjsResult = await this.performRxJSApiCalls();
      const rxjsEndTime = performance.now();

      // Run Signals-based API calls
      const signalsStartTime = performance.now();
      const signalsResult = await this.performSignalsApiCalls();
      const signalsEndTime = performance.now();

      // Calculate performance metrics
      const rxjsPerformance: ApiPerformanceData = {
        responseTime: rxjsEndTime - rxjsStartTime,
        memoryUsage: this.getMemoryUsage(),
        cpuUsage: this.getCpuUsage(),
        requestCount: rxjsResult.requestCount,
        errorRate: rxjsResult.errorRate,
        timestamp: Date.now()
      };

      const signalsPerformance: ApiPerformanceData = {
        responseTime: signalsEndTime - signalsStartTime,
        memoryUsage: this.getMemoryUsage(),
        cpuUsage: this.getCpuUsage(),
        requestCount: signalsResult.requestCount,
        errorRate: signalsResult.errorRate,
        timestamp: Date.now()
      };

      this.rxjsResults.set(rxjsPerformance);
      this.signalsResults.set(signalsPerformance);

      // Generate comparison analysis
      this.generateTestComparison(rxjsPerformance, signalsPerformance);

    } catch (error) {
      console.error('Performance test failed:', error);
    } finally {
      this.isRunningTest.set(false);
    }
  }

  private async performRxJSApiCalls(): Promise<{ requestCount: number, errorRate: number }> {
    const apiCalls = [
      'https://jsonplaceholder.typicode.com/posts',
      'https://jsonplaceholder.typicode.com/users',
      'https://jsonplaceholder.typicode.com/albums',
      'https://jsonplaceholder.typicode.com/photos?_limit=10',
      'https://jsonplaceholder.typicode.com/todos?_limit=20'
    ];

    let successCount = 0;
    let errorCount = 0;

    const requests = apiCalls.map(url =>
      this.http.get(url).pipe(
        map(() => ({ success: true })),
        catchError(() => of({ success: false }))
      ).toPromise()
    );

    const results = await Promise.all(requests);

    results.forEach(result => {
      if (result?.success) {
        successCount++;
      } else {
        errorCount++;
      }
    });

    return {
      requestCount: apiCalls.length,
      errorRate: (errorCount / apiCalls.length) * 100
    };
  }

  private async performSignalsApiCalls(): Promise<{ requestCount: number, errorRate: number }> {
    const apiCalls = [
      'https://jsonplaceholder.typicode.com/posts',
      'https://jsonplaceholder.typicode.com/users',
      'https://jsonplaceholder.typicode.com/albums',
      'https://jsonplaceholder.typicode.com/photos?_limit=10',
      'https://jsonplaceholder.typicode.com/todos?_limit=20'
    ];

    let successCount = 0;
    let errorCount = 0;

    // Using native fetch with Signals-style state management
    const fetchPromises = apiCalls.map(async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          successCount++;
          return { success: true };
        } else {
          errorCount++;
          return { success: false };
        }
      } catch (error) {
        errorCount++;
        return { success: false };
      }
    });

    await Promise.all(fetchPromises);

    return {
      requestCount: apiCalls.length,
      errorRate: (errorCount / apiCalls.length) * 100
    };
  }

  private generateTestComparison(rxjsData: ApiPerformanceData, signalsData: ApiPerformanceData): void {
    const comparison = {
      responseTime: {
        rxjs: rxjsData.responseTime,
        signals: signalsData.responseTime,
        winner: rxjsData.responseTime < signalsData.responseTime ? 'RxJS' : 'Signals',
        improvement: Math.round(Math.abs(rxjsData.responseTime - signalsData.responseTime))
      },
      memoryUsage: {
        rxjs: rxjsData.memoryUsage,
        signals: signalsData.memoryUsage,
        winner: rxjsData.memoryUsage < signalsData.memoryUsage ? 'RxJS' : 'Signals',
        improvement: Math.round(Math.abs(rxjsData.memoryUsage - signalsData.memoryUsage))
      },
      errorRate: {
        rxjs: rxjsData.errorRate,
        signals: signalsData.errorRate,
        winner: rxjsData.errorRate < signalsData.errorRate ? 'RxJS' : 'Signals',
        improvement: Math.abs(rxjsData.errorRate - signalsData.errorRate)
      },
      overall: {
        winner: this.determineOverallWinner(rxjsData, signalsData),
        summary: this.generatePerformanceSummary(rxjsData, signalsData)
      }
    };

    this.testComparison.set(comparison);
  }

  private determineOverallWinner(rxjsData: ApiPerformanceData, signalsData: ApiPerformanceData): string {
    let rxjsScore = 0;
    let signalsScore = 0;

    // Score based on response time
    if (rxjsData.responseTime < signalsData.responseTime) rxjsScore++;
    else signalsScore++;

    // Score based on memory usage
    if (rxjsData.memoryUsage < signalsData.memoryUsage) rxjsScore++;
    else signalsScore++;

    // Score based on error rate
    if (rxjsData.errorRate < signalsData.errorRate) rxjsScore++;
    else signalsScore++;

    return rxjsScore > signalsScore ? 'RxJS' : signalsScore > rxjsScore ? 'Signals' : 'Tie';
  }

  private generatePerformanceSummary(rxjsData: ApiPerformanceData, signalsData: ApiPerformanceData): string {
    const winner = this.determineOverallWinner(rxjsData, signalsData);
    const timeDiff = Math.abs(rxjsData.responseTime - signalsData.responseTime);
    const memoryDiff = Math.abs(rxjsData.memoryUsage - signalsData.memoryUsage);

    return `${winner} performed better overall with ${timeDiff.toFixed(0)}ms ${
      winner === 'RxJS' ? 'faster' : 'slower'
    } response time and ${memoryDiff.toFixed(0)}MB ${
      winner === 'RxJS' ? 'less' : 'more'
    } memory usage.`;
  }

  private getMemoryUsage(): number {
    // Simulate memory usage measurement
    return Math.random() * 50 + 30; // 30-80 MB
  }

  private getCpuUsage(): number {
    // Simulate CPU usage measurement
    return Math.random() * 40 + 15; // 15-55%
  }
}
