import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="productForm" (ngSubmit)="onSubmit()" novalidate>
      <div class="row g-3">
        <div class="col-md-6">
          <label for="name" class="form-label">Nombre</label>
          <input
            id="name"
            type="text"
            class="form-control"
            formControlName="name"
            required
          />
          @if (productForm.controls.name.invalid && productForm.controls.name.touched) {
            <small class="text-danger">El nombre es obligatorio.</small>
          }
        </div>

        <div class="col-md-6">
          <label for="category" class="form-label">Categoría</label>
          <input
            id="category"
            type="text"
            class="form-control"
            formControlName="category"
            required
          />
          @if (productForm.controls.category.invalid && productForm.controls.category.touched) {
            <small class="text-danger">La categoría es obligatoria.</small>
          }
        </div>

        <div class="col-md-12">
          <label for="description" class="form-label">Descripción</label>
          <textarea
            id="description"
            rows="2"
            class="form-control"
            formControlName="description"
            required
          ></textarea>
          @if (productForm.controls.description.invalid && productForm.controls.description.touched) {
            <small class="text-danger">La descripción es obligatoria.</small>
          }
        </div>

        <div class="col-md-4">
          <label for="price" class="form-label">Precio (€)</label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            class="form-control"
            formControlName="price"
            required
          />
          @if (productForm.controls.price.invalid && productForm.controls.price.touched) {
            <small class="text-danger">Debe ser mayor que 0.</small>
          }
        </div>

        <div class="col-md-8">
          <label for="image" class="form-label">URL Imagen (opcional)</label>
          <input
            id="image"
            type="url"
            class="form-control"
            formControlName="image"
            placeholder="https://..."
          />
        </div>

        <div class="col-md-12 form-check mt-2">
          <input
            id="active"
            type="checkbox"
            class="form-check-input"
            formControlName="active"
          />
          <label for="active" class="form-check-label">Activo</label>
        </div>
      </div>

      <div class="mt-3">
        <button class="btn btn-primary" type="submit" [disabled]="productForm.invalid">
          Añadir producto
        </button>
      </div>
    </form>
  `
})
export class ProductFormComponent {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);

  // Formulario reactivo con validaciones básicas.
  productForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    category: ['', Validators.required],
    image: [''],
    active: [true]
  });

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    // Generamos el producto con UUID.
    const newProduct = {
      _id: uuid(),
      name: this.productForm.value.name ?? '',
      description: this.productForm.value.description ?? '',
      price: Number(this.productForm.value.price) || 0,
      category: this.productForm.value.category ?? '',
      image: this.productForm.value.image?.trim() || 'https://via.placeholder.com/200x150?text=Producto',
      active: !!this.productForm.value.active
    };

    this.productService.addProduct(newProduct);
    this.productForm.reset({
      name: '',
      description: '',
      price: 0,
      category: '',
      image: '',
      active: true
    });
  }
}
