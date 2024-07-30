import { Component, CreateEffectOptions, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from './product.service';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { ProductHttpService } from './product-http.service';
import { catchError, of } from 'rxjs';


interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}


@Component({
  selector: 'app-detailed-product-list-signal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers:[ProductService, ProductHttpService],
  templateUrl: './detailed-product-list-signal.component.html',
  styleUrl: './detailed-product-list.component.scss'
})

export class DetailedProductListSignalComponent {
  private productService = inject(ProductHttpService);

  products = signal<Product[]>([]);
  selectedProduct = signal<Product | null>(null);
  newProduct = signal<Omit<Product, 'id'>>({ title: '', price: 0, description: '', category: '', image: '' });
  updatedProduct = signal<Partial<Product>>({});
  updateProductId = signal<number | null>(null);
  error = signal<string | null>(null);

  private productsSignal = toSignal(
    this.productService.getAllProducts().pipe(
      catchError(error => {
        this.handleError('Failed to fetch products', error);
        return of([]);
      })
    ),
    { initialValue: [] }
  );

  private productsWithDetailsSignal = toSignal(
    this.productService.getAllProductsWithDetails().pipe(
      catchError(error => {
        this.handleError('Failed to fetch products with details', error);
        return of([]);
      })
    ),
    { initialValue: [] }
  );

  constructor() {
    effect(() => {
      this.updateProductsWithDetails();
    }, { allowSignalWrites: true } as CreateEffectOptions);

    effect(() => {
      console.log('Products updated:', this.products());
    }, { allowSignalWrites: true } as CreateEffectOptions);
  }

  private handleError(message: string, error: any) {
    console.error(message, error);
    this.error.set(`${message}: ${error.message}`);
  }

  private updateProducts() {
    this.products.set(this.productsSignal());
    this.error.set(null);
  }

  private updateProductsWithDetails() {
    this.products.set(this.productsWithDetailsSignal());
    this.error.set(null);
  }

  loadProducts() {
    this.updateProducts();
  }

  loadProductsWithDetails() {
    this.updateProductsWithDetails();
  }

  viewProduct(id: number) {
    this.productService.getProduct(id).pipe(
      catchError(error => {
        this.handleError('Failed to fetch product', error);
        return of(null);
      })
    ).subscribe(product => {
      this.selectedProduct.set(product);
      if (product) {
        console.log('Fetched product:', product);
      }
    });
  }

  addProduct() {
    this.productService.addProduct(this.newProduct()).pipe(
      catchError(error => {
        this.handleError('Failed to add product', error);
        return of(null);
      })
    ).subscribe(product => {
      if (product) {
        console.log('Added product:', product);
        this.loadProducts();
        this.newProduct.set({ title: '', price: 0, description: '', category: '', image: '' });
      }
    });
  }

  updateProduct() {
    if (this.updateProductId()) {
      this.productService.updateProduct(this.updateProductId()!, this.updatedProduct()).pipe(
        catchError(error => {
          this.handleError('Failed to update product', error);
          return of(null);
        })
      ).subscribe(product => {
        if (product) {
          console.log('Updated product:', product);
          this.loadProducts();
          this.updateProductId.set(null);
          this.updatedProduct.set({});
        }
      });
    }
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).pipe(
      catchError(error => {
        this.handleError('Failed to delete product', error);
        return of(null);
      })
    ).subscribe(response => {
      if (response !== null) {
        console.log('Deleted product:', response);
        this.loadProducts();
      }
    });
  }
}
















// export class DetailedProductListSignalComponent {
//   private productService = inject(ProductHttpService);

//   products = signal<Product[]>([]);
//   selectedProduct = signal<Product | null>(null);
//   newProduct = signal<Omit<Product, 'id'>>({ title: '', price: 0, description: '', category: '', image: '' });
//   updatedProduct = signal<Partial<Product>>({});
//   updateProductId = signal<number | null>(null);

//   private productsSignal = toSignal(this.productService.getAllProducts(), { initialValue: [] });
//   private productsWithDetailsSignal = toSignal(this.productService.getAllProductsWithDetails(), { initialValue: [] });

//   constructor() {
//     effect(() => {
//       this.loadProductsWithDetails();
//     }, { allowSignalWrites: true } as CreateEffectOptions);
//   }

//   loadProducts() {
//     effect(() => {
//       this.products.set(this.productsSignal());
//       console.log('Fetched products:', this.productsSignal());
//     }, { allowSignalWrites: true } as CreateEffectOptions);
//   }

//   loadProductsWithDetails() {
//     effect(() => {
//       this.products.set(this.productsWithDetailsSignal());
//       console.log('Fetched products with details:', this.productsWithDetailsSignal());
//     }, { allowSignalWrites: true } as CreateEffectOptions);
//   }

//   viewProduct(id: number) {
//     const productSignal = toSignal(this.productService.getProduct(id), { initialValue: null });
//     effect(() => {
//       this.selectedProduct.set(productSignal());
//       console.log('Fetched product:', productSignal());
//     }, { allowSignalWrites: true } as CreateEffectOptions);
//   }

//   addProduct() {
//     this.productService.addProduct(this.newProduct()).subscribe({
//       next: (product) => {
//         console.log('Added product:', product);
//         this.loadProducts();
//         this.newProduct.set({ title: '', price: 0, description: '', category: '', image: '' });
//       },
//       error: (error) => console.error('Error adding product:', error)
//     });
//   }

//   updateProduct() {
//     if (this.updateProductId()) {
//       this.productService.updateProduct(this.updateProductId()!, this.updatedProduct()).subscribe({
//         next: (product) => {
//           console.log('Updated product:', product);
//           this.loadProducts();
//           this.updateProductId.set(null);
//           this.updatedProduct.set({});
//         },
//         error: (error) => console.error('Error updating product:', error)
//       });
//     }
//   }



//   deleteProduct(id: number) {
//     this.productService.deleteProduct(id).subscribe({
//       next: (response) => {
//         console.log('Deleted product:', response);
//         this.loadProducts();
//       },
//       error: (error) => console.error('Error deleting product:', error)
//     });
//   }

// }
