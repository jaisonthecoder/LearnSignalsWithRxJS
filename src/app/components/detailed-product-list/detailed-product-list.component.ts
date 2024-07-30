import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from './product.service';
import { ProductHttpService } from './product-http.service';
import { HttpErrorResponse } from '@angular/common/http';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

@Component({
  selector: 'app-detailed-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers:[ProductService, ProductHttpService],
  templateUrl: './detailed-product-list.component.html',
  styleUrls: ['./detailed-product-list.component.scss']
})
export class DetailedProductListComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  newProduct: Omit<Product, 'id'> = { title: '', price: 0, description: '', category: '', image: '' };
  updatedProduct: Partial<Product> = {};
  updateProductId: number | null = null;

  constructor(private productService: ProductHttpService) {}

  ngOnInit() {
   // this.loadProducts();
    this.loadProductsWithDetails();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        console.log('Fetched products:', products);
      },
      error: (error) => console.error('Error fetching products:', error)
    });
  }


  loadProductsWithDetails() {
    this.productService.getAllProductsWithDetails().subscribe({
      next: (productsWithDetails:any) => {
        this.products = productsWithDetails;
        console.log('Fetched products with details:', productsWithDetails);
      },
      error: (error:any) => console.error('Error fetching products with details:', error)
    });
  }



  viewProduct(id: number) {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.selectedProduct = product;
        console.log('Fetched product:', product);
      },
      error: (error) => console.error('Error fetching product:', error)
    });
  }

  addProduct() {
    this.productService.addProduct(this.newProduct).subscribe({
      next: (product) => {
        console.log('Added product:', product);
        this.loadProducts();
        this.newProduct = { title: '', price: 0, description: '', category: '', image: '' };
      },
      error: (error) => console.error('Error adding product:', error)
    });
  }

  updateProduct() {
    if (this.updateProductId) {
      this.productService.updateProduct(this.updateProductId, this.updatedProduct).subscribe({
        next: (product) => {
          console.log('Updated product:', product);
          this.loadProducts();
          this.updateProductId = null;
          this.updatedProduct = {};
        },
        error: (error) => console.error('Error updating product:', error)
      });
    }
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: (response) => {
        console.log('Deleted product:', response);
        this.loadProducts();
      },
      error: (error) => console.error('Error deleting product:', error)
    });
  }
}
