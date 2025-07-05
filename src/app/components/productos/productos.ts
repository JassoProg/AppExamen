import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IProducto } from '../../interfaces/producto';
import { ICategoria } from '../../interfaces/categoria';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']
})
export class ProductosComponent implements OnInit {
  productos: IProducto[] = [];
  productosFiltrados: IProducto[] = [];
  categorias: ICategoria[] = [];
  isResultLoaded = false;
  terminoBusqueda: string = '';
  categoriaSeleccionada: number = 0;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit() {
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarProductos() {
    this.productoService.getList().subscribe({
      next: (data: IProducto[]) => {
        this.productos = data;
        this.productosFiltrados = data;
        this.isResultLoaded = true;
      },
      error: (error) => {
        console.log('Error al obtener los productos:', error);
      }
    });
  }

  cargarCategorias() {
    this.categoriaService.getList().subscribe({
      next: (data: ICategoria[]) => {
        this.categorias = data;
      },
      error: (error) => {
        console.log('Error al obtener las categorías:', error);
      }
    });
  }

  buscarProductos() {
    if (this.terminoBusqueda.trim() === '') {
      // Si no hay término de búsqueda, aplicar solo filtro de categoría
      this.aplicarFiltros();
    } else if (this.categoriaSeleccionada === 0) {
      // Si busca en todas las categorías, usar el endpoint de búsqueda del backend
      this.productoService.buscar(this.terminoBusqueda).subscribe({
        next: (data: IProducto[]) => {
          this.productosFiltrados = data;
        },
        error: (error) => {
          console.log('Error en búsqueda:', error);
          // Fallback: usar filtrado local
          this.aplicarFiltros();
        }
      });
    } else {
      // Si hay categoría seleccionada y término de búsqueda, usar filtrado local
      this.aplicarFiltros();
    }
  }

  filtrarPorCategoria() {
    if (this.categoriaSeleccionada === 0) {
      // Si selecciona "todas", cargar todos los productos
      this.cargarProductos();
    } else {
      // Si selecciona una categoría específica, usar el endpoint del backend
      this.productoService.getByCategoria(this.categoriaSeleccionada).subscribe({
        next: (data: IProducto[]) => {
          this.productos = data;
          this.aplicarFiltros();
        },
        error: (error) => {
          console.log('Error al filtrar por categoría:', error);
          // Fallback: usar filtrado local
          this.aplicarFiltros();
        }
      });
    }
  }

  private aplicarFiltros() {
    let productosTemp = [...this.productos];

    // Aplicar filtro de categoría
    if (this.categoriaSeleccionada !== 0) {
      productosTemp = productosTemp.filter(producto =>
        producto.categoriaId === Number(this.categoriaSeleccionada)
      );
    }

    // Aplicar filtro de búsqueda
    if (this.terminoBusqueda.trim() !== '') {
      const termino = this.terminoBusqueda.toLowerCase().trim();
      productosTemp = productosTemp.filter(producto =>
        producto.nombre.toLowerCase().includes(termino) ||
        (producto.descripcion && producto.descripcion.toLowerCase().includes(termino)) ||
        (producto.categoria?.nombre && producto.categoria.nombre.toLowerCase().includes(termino))
      );
    }

    this.productosFiltrados = productosTemp;
    console.log('Productos filtrados:', this.productosFiltrados);
    console.log('Categoría seleccionada:', this.categoriaSeleccionada);
    console.log('Término de búsqueda:', this.terminoBusqueda);
  }

  limpiarFiltros() {
    this.terminoBusqueda = '';
    this.categoriaSeleccionada = 0;
    // Recargar todos los productos desde el backend
    this.cargarProductos();
  }

  obtenerNombreCategoria(): string {
    const categoria = this.categorias.find(c => c.id === this.categoriaSeleccionada);
    return categoria ? categoria.nombre : '';
  }
}
