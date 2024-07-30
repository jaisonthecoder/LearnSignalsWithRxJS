import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RxjsDemoComponent } from './components/rxjs-demo/rxjs-demo.component';
import { DetailedProductListComponent } from './components/detailed-product-list/detailed-product-list.component';
import { DetailedProductListSignalComponent } from './components/detailed-product-list/detailed-product-list-signal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RxjsDemoComponent, DetailedProductListComponent, DetailedProductListSignalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'demoapp';
}
