import { Routes } from '@angular/router';
import { RxjsDemoComponent } from './components/rxjs-demo/rxjs-demo.component';
import { DetailedProductListComponent } from './components/detailed-product-list/detailed-product-list.component';
import { DetailedProductListSignalComponent } from './components/detailed-product-list/detailed-product-list-signal.component';
import { ComparisonDashboardComponent } from './components/comparison-dashboard/comparison-dashboard.component';
import { InterviewPrepComponent } from './components/interview-prep/interview-prep.component';

export const routes: Routes = [{
  path:"rxjs-operators",
  component:DetailedProductListComponent
},
{
  path:"rxjs-base",
  component:RxjsDemoComponent
},
{
  path:"signals",
  component:DetailedProductListSignalComponent
},
{
  path:"dashboard",
  component:ComparisonDashboardComponent
},
{
  path:"interview",
  component:InterviewPrepComponent
},
{
  path:"",
  redirectTo:"/dashboard",
  pathMatch:"full"
}


];
