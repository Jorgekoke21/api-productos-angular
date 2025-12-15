import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { ProductCardComponent } from './product-card.component';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <div class="mb-3">
      @if (loading()) {
        <div class="alert alert-info mb-0">Cargando productos desde la API...</div>
      } @else {
        @if (errorMessage()) {
          <div class="alert alert-warning mb-3">{{ errorMessage() }}</div>
        }

        @if (products().length === 0) {
          <p class="text-muted mb-0">No hay productos que cumplan los filtros.</p>
        } @else {
          <div class="row g-3">
            @for (product of products(); track product._id) {
              <div class="col-12 col-md-6 col-lg-4">
                <app-product-card
                  [product]="product"
                  (deleteProduct)="handleDelete($event)"
                ></app-product-card>
              </div>
            }
          </div>
        }
      }
    </div>
  `
})
export class ProductsListComponent implements OnInit {
  private productService = inject(ProductService);

  // Signals locales para estado de carga y error.
  loading = signal(true);
  errorMessage = signal('');

  // Computed para leer directamente la lista filtrada del servicio.
  products = computed<Product[]>(() => this.productService.products());

  async ngOnInit(): Promise<void> {
    try {
      await this.productService.loadProducts();
    } catch (error) {
      this.errorMessage.set('No se pudieron cargar productos.');
    } finally {
      this.loading.set(false);
    }
  }

  // Recibe el id desde la tarjeta y delega en el servicio.
  handleDelete(productId: string): void {
    this.productService.deleteProduct(productId);
  }
}
