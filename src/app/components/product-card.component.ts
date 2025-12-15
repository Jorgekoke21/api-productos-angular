import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../models/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card h-100">
      <img [src]="product.image" [alt]="product.name" class="card-img-top">
      <div class="card-body">
        <h3 class="h6 mb-1">{{ product.name }}</h3>
        <p class="text-muted mb-2">{{ product.category }}</p>
        <p class="mb-2">{{ product.description }}</p>
        <p class="fw-semibold mb-2">{{ product.price | currency:'EUR':'symbol':'1.2-2' }}</p>
        <span class="badge" [class.bg-success]="product.active" [class.bg-secondary]="!product.active">
          {{ product.active ? 'Activo' : 'Inactivo' }}
        </span>
      </div>
      <div class="card-footer bg-transparent border-0">
        <button class="btn btn-sm btn-outline-danger w-100" (click)="onDelete()">
          Eliminar
        </button>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() deleteProduct = new EventEmitter<string>();

  // Emite el id al padre para que el servicio gestione la eliminación.
  onDelete(): void {
    this.deleteProduct.emit(this.product._id);
  }
}
