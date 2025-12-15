import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product';

// Estructura de los filtros activos.
export interface ProductFilters {
  name: string;
  category: string;
  maxPrice: number | null;
  active: boolean | null;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Lista filtrada para mostrar en pantalla.
  products = signal<Product[]>([]);

  // Lista completa sin filtrar.
  private allProducts = signal<Product[]>([]);

  // Filtros activos controlados por el componente de filtros.
  filters = signal<ProductFilters>({
    name: '',
    category: '',
    maxPrice: null,
    active: null
  });

  /**
   * JsonBlob bloquea peticiones desde localhost por CORS.
   * Según el enunciado, si la API falla, cargamos el JSON local como alternativa válida.
   * En Angular 18 los recursos estáticos se sirven desde public/, por eso colocamos el JSON ahí.
   * Así evitamos tocar configuración avanzada y mantenemos una solución académica y simple.
   */
  // Paso 4: carga inicial usando fetch tradicional. Si falla la API, se usa el JSON local.
  async loadProducts(): Promise<void> {
    try {
      const response = await fetch('https://jsonblob.com/api/1313446273633935360');
      if (!response.ok) {
        throw new Error('Respuesta no válida de la API');
      }
      const data = (await response.json()) as Product[];
      this.setProducts(data);
    } catch (error) {
      // Fallback simple a datos locales servidos desde public/.
      const localResponse = await fetch('products.json');
      const localData = (await localResponse.json()) as Product[];
      this.setProducts(localData);
    }
  }

  // Añadir un producto nuevo y refrescar el filtrado.
  addProduct(product: Product): void {
    const updated = [...this.allProducts(), product];
    this.allProducts.set(updated);
    this.filterProducts();
  }

  // Eliminar un producto por id.
  deleteProduct(id: string): void {
    const updated = this.allProducts().filter((p) => p._id !== id);
    this.allProducts.set(updated);
    this.filterProducts();
  }

  // Actualiza filtros y recalcula el listado visible.
  updateFilters(partial: Partial<ProductFilters>): void {
    this.filters.update((prev) => ({ ...prev, ...partial }));
    this.filterProducts();
  }

  // Aplica los filtros activos sobre la lista completa.
  filterProducts(): void {
    const { name, category, maxPrice, active } = this.filters();
    const filtered = this.allProducts().filter((product) => {
      const matchesName = product.name.toLowerCase().includes(name.toLowerCase().trim());
      const matchesCategory = category
        ? product.category.toLowerCase() === category.toLowerCase()
        : true;
      const matchesPrice = maxPrice !== null ? product.price <= maxPrice : true;
      const matchesActive = active !== null ? product.active === active : true;
      return matchesName && matchesCategory && matchesPrice && matchesActive;
    });
    this.products.set(filtered);
  }

  // Guardamos la lista original y recalculamos filtros.
  private setProducts(data: Product[]): void {
    this.allProducts.set(data);
    this.filterProducts();
  }
}
