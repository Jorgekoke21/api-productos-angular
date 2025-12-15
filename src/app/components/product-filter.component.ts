import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form #filterForm="ngForm" (ngSubmit)="applyFilters(filterForm)">
      <div class="row g-3">
        <div class="col-md-3">
          <label class="form-label" for="name">Nombre</label>
          <input
            id="name"
            name="name"
            type="text"
            class="form-control"
            [(ngModel)]="filters.name"
            (ngModelChange)="applyFilters(filterForm)"
            placeholder="Buscar por nombre"
          />
        </div>

        <div class="col-md-3">
          <label class="form-label" for="category">Categoría</label>
          <input
            id="category"
            name="category"
            type="text"
            class="form-control"
            [(ngModel)]="filters.category"
            (ngModelChange)="applyFilters(filterForm)"
            placeholder="Ej: Tecnología"
          />
        </div>

        <div class="col-md-3">
          <label class="form-label" for="maxPrice">Precio máximo</label>
          <input
            id="maxPrice"
            name="maxPrice"
            type="number"
            min="0"
            step="0.01"
            class="form-control"
            [(ngModel)]="filters.maxPrice"
            (ngModelChange)="applyFilters(filterForm)"
          />
        </div>

        <div class="col-md-3">
          <label class="form-label" for="active">Activo</label>
          <select
            id="active"
            name="active"
            class="form-select"
            [(ngModel)]="filters.active"
            (ngModelChange)="applyFilters(filterForm)"
          >
            <option [ngValue]="null">Todos</option>
            <option [ngValue]="true">Solo activos</option>
            <option [ngValue]="false">Solo inactivos</option>
          </select>
        </div>
      </div>
    </form>
  `
})
export class ProductFilterComponent {
  private productService = inject(ProductService);

  // Modelo simple para template-driven forms.
  filters = {
    name: '',
    category: '',
    maxPrice: null as number | null,
    active: null as boolean | null
  };

  // Cada cambio llama al servicio para actualizar filtros y recalcular.
  applyFilters(form: NgForm): void {
    // maxPrice puede venir como string; lo convertimos con Number.
    const maxPriceValue = form.value.maxPrice;
    const parsedMaxPrice =
      maxPriceValue === null || maxPriceValue === undefined || maxPriceValue === ''
        ? null
        : Number(maxPriceValue);

    this.productService.updateFilters({
      name: this.filters.name,
      category: this.filters.category,
      maxPrice: Number.isFinite(parsedMaxPrice) ? parsedMaxPrice : null,
      active: this.filters.active
    });
  }
}
