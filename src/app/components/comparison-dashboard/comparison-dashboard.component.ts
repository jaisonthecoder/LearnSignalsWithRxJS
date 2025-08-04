import { Component, signal, computed, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PerformanceMetricsService,
  BenchmarkData,
  PerformanceMetric,
  FeatureComparison,
  UseCaseRecommendation
} from '../../services/performance-metrics.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comparison-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comparison-dashboard.component.html',
  styleUrls: ['./comparison-dashboard.component.scss']
})
export class ComparisonDashboardComponent implements OnInit, OnDestroy {
  private metricsService = inject(PerformanceMetricsService);
  private subscriptions: Subscription[] = [];

  // Math reference for template
  Math = Math;

  // Signal-based state for dashboard data
  selectedCategory = signal<string>('performance');
  isLoading = this.metricsService.isLoading;
  lastUpdated = this.metricsService.lastUpdated;

  // Performance data from service
  performanceData = this.metricsService.performanceData;
  featureComparison = this.metricsService.featureComparison;
  useCaseData = this.metricsService.useCaseData;

  // User-initiated performance testing
  isRunningTest = this.metricsService.isRunningTest;
  rxjsResults = this.metricsService.rxjsResults;
  signalsResults = this.metricsService.signalsResults;
  testComparison = this.metricsService.testComparison;

  // Computed metrics for overall comparison
  overallStats = computed(() => {
    const allMetrics = this.performanceData().flatMap((category: BenchmarkData) => category.metrics);
    if (allMetrics.length === 0) {
      return { avgImprovement: 0, maxImprovement: 0, timeSaved: 0, metricsCount: 0 };
    }

    const avgImprovement = allMetrics.reduce((sum: number, metric: PerformanceMetric) => sum + metric.improvement, 0) / allMetrics.length;
    const maxImprovement = Math.max(...allMetrics.map((m: PerformanceMetric) => m.improvement));
    const totalRxjsTime = allMetrics.filter((m: PerformanceMetric) => m.unit === 'ms').reduce((sum: number, m: PerformanceMetric) => sum + m.rxjs, 0);
    const totalSignalsTime = allMetrics.filter((m: PerformanceMetric) => m.unit === 'ms').reduce((sum: number, m: PerformanceMetric) => sum + m.signals, 0);

    return {
      avgImprovement: Math.round(avgImprovement),
      maxImprovement,
      timeSaved: Math.round(totalRxjsTime - totalSignalsTime),
      metricsCount: allMetrics.length
    };
  });

  // Safe access to performance metrics
  safePerformanceData = computed(() => {
    const data = this.performanceData();
    return data.length > 0 ? data[0] : { category: 'performance', metrics: [] };
  });

  ngOnInit(): void {
    // Initialize data if not already loaded
    this.refreshData();

    // Disabled automatic metrics stream to stop console spam
    // Subscribe to real-time metrics stream
    // const metricsStream = this.metricsService.getMetricsStream().subscribe({
    //   next: (data: any) => {
    //     console.log('Real-time metrics updated:', data);
    //   },
    //   error: (error: any) => {
    //     console.error('Error fetching metrics:', error);
    //   }
    // });

    // this.subscriptions.push(metricsStream);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  refreshData(): void {
    this.metricsService.refreshData();
  }

  async startPerformanceTest(): Promise<void> {
    await this.metricsService.startPerformanceTest();
  }

  selectCategory(category: string) {
    this.selectedCategory.set(category);
  }

  getSelectedCategoryData() {
    const data = this.performanceData();
    if (data.length === 0) {
      return { category: 'performance', metrics: [] };
    }
    return data.find((categoryData: BenchmarkData) =>
      categoryData.category.toLowerCase().includes(this.selectedCategory().toLowerCase())
    ) || data[0];
  }  getImprovementColor(improvement: number): string {
    if (improvement >= 70) return '#4CAF50'; // Green
    if (improvement >= 50) return '#FF9800'; // Orange
    if (improvement >= 30) return '#FFC107'; // Amber
    return '#F44336'; // Red
  }

  getRecommendationColor(recommendation: string): string {
    switch (recommendation.toLowerCase()) {
      case 'signals': return '#4CAF50';
      case 'rxjs': return '#2196F3';
      case 'hybrid': return '#FF9800';
      default: return '#757575';
    }
  }

  // Helper methods for CSS-based charts
  getPerformanceBarWidth(value: number, maxValue: number): number {
    return (value / maxValue) * 100;
  }

  getMaxValue(metrics: PerformanceMetric[]): number {
    if (!metrics || metrics.length === 0) {
      return 1; // Return 1 to avoid division by zero
    }
    return Math.max(...metrics.map(m => Math.max(m.rxjs, m.signals)));
  }

  getFeatureRadarPath(features: any[]): string {
    const centerX = 150;
    const centerY = 150;
    const radius = 120;
    const angleStep = (2 * Math.PI) / features.length;

    let path = '';
    features.forEach((feature, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const value = feature.signals / 10; // Normalize to 0-1
      const x = centerX + Math.cos(angle) * radius * value;
      const y = centerY + Math.sin(angle) * radius * value;

      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });

    return path + ' Z';
  }

  // Helper methods for radar chart calculations
  getRadarAngle(index: number, total: number): number {
    return (index * 2 * Math.PI / total) - Math.PI/2;
  }

  getRadarX(angle: number, radius: number): number {
    return 150 + Math.cos(angle) * radius;
  }

  getRadarY(angle: number, radius: number): number {
    return 150 + Math.sin(angle) * radius;
  }

  getRxjsPolygonPoints(): string {
    return this.featureComparison().map((feature: FeatureComparison, index: number) => {
      const angle = this.getRadarAngle(index, this.featureComparison().length);
      const x = this.getRadarX(angle, feature.rxjs * 12);
      const y = this.getRadarY(angle, feature.rxjs * 12);
      return `${x},${y}`;
    }).join(' ');
  }

  getSignalsPolygonPoints(): string {
    return this.featureComparison().map((feature: FeatureComparison, index: number) => {
      const angle = this.getRadarAngle(index, this.featureComparison().length);
      const x = this.getRadarX(angle, feature.signals * 12);
      const y = this.getRadarY(angle, feature.signals * 12);
      return `${x},${y}`;
    }).join(' ');
  }

  getFeatureLabelPosition(index: number): { x: number, y: number } {
    const angle = this.getRadarAngle(index, this.featureComparison().length);
    return {
      x: this.getRadarX(angle, 140),
      y: this.getRadarY(angle, 140)
    };
  }

  // Helper methods for filtering features by winner
  getRxjsStrongFeatures(): string[] {
    return this.featureComparison()
      .filter((feature: FeatureComparison) => feature.rxjs > feature.signals)
      .map((feature: FeatureComparison) => feature.feature);
  }

  getSignalsStrongFeatures(): string[] {
    return this.featureComparison()
      .filter((feature: FeatureComparison) => feature.signals > feature.rxjs)
      .map((feature: FeatureComparison) => feature.feature);
  }
}
