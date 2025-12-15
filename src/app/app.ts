import { Component } from '@angular/core';
import { ProductsListComponent } from './components/products-list.component';
import { ProductFormComponent } from './components/product-form.component';
import { ProductFilterComponent } from './components/product-filter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductsListComponent, ProductFormComponent, ProductFilterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {}
