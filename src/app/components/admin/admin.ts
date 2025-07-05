import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IProducto } from '../../interfaces/producto';
import { ICategoria } from '../../interfaces/categoria';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit {
  // Productos
  productos: IProducto[] = [];
  isResultLoaded = false;
  isUpdateActive = false;
  
  // Formulario producto
  nombreProducto: string = '';
  descripcionProducto: string = '';
  precioProducto: number = 0;
  imagenProducto: string = '';
  categoriaProducto: number = 0;
  IDProductoActual: number = 0;

  // Categorías
  categorias: ICategoria[] = [];
  
  // Formulario categoría
  nombreCategoria: string = '';
  IDCategoriaActual: number = 0;
  isUpdateCategoriaActive = false;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit() {
    this.obtenerProductos();
    this.obtenerCategorias();
  }

  // CRUD Productos
  obtenerProductos() {
    this.productoService.getList().subscribe({
      next: (data: IProducto[]) => {
        this.productos = data;
        this.isResultLoaded = true;
      },
      error: (error) => {
        console.log('Error al obtener los productos:', error);
      }
    });
  }

  agregarProducto() {
    // Validaciones básicas
    if (!this.nombreProducto || this.nombreProducto.trim() === '') {
      alert('El nombre del producto es obligatorio');
      return;
    }
    
    if (this.precioProducto <= 0) {
      alert('El precio debe ser mayor a 0');
      return;
    }
    
    if (this.categoriaProducto <= 0) {
      alert('Debe seleccionar una categoría válida');
      return;
    }

    const request: IProducto = {
      nombre: this.nombreProducto.trim(),
      descripcion: this.descripcionProducto?.trim() || undefined,
      precio: Number(this.precioProducto),
      imagenUrl: this.imagenProducto?.trim() || undefined,
      categoriaId: Number(this.categoriaProducto)
    };

    console.log('Datos del producto a enviar:', request);

    this.productoService.add(request).subscribe({
      next: (data) => {
        console.log('Producto agregado exitosamente:', data);
        alert('Producto agregado exitosamente');
        this.limpiarFormularioProducto();
        this.obtenerProductos();
      },
      error: (e) => { 
        console.error('Error completo al agregar producto:', e);
        
        let errorMessage = 'Error al agregar el producto';
        if (e.error) {
          if (typeof e.error === 'string') {
            errorMessage += ': ' + e.error;
          } else if (e.error.errors) {
            errorMessage += ':\n' + Object.values(e.error.errors).flat().join('\n');
          } else if (e.error.title) {
            errorMessage += ': ' + e.error.title;
          }
        }
        
        alert(errorMessage);
      }
    });
  }

  obtenerProducto(data: IProducto) {
    this.nombreProducto = data.nombre;
    this.descripcionProducto = data.descripcion || '';
    this.precioProducto = data.precio;
    this.imagenProducto = data.imagenUrl || '';
    this.categoriaProducto = data.categoriaId;
    this.IDProductoActual = data.id || 0;
    this.isUpdateActive = true;
  }

  modificarProducto() {
    const request: IProducto = {
      id: this.IDProductoActual,
      nombre: this.nombreProducto,
      descripcion: this.descripcionProducto || undefined,
      precio: this.precioProducto,
      imagenUrl: this.imagenProducto || undefined,
      categoriaId: this.categoriaProducto
    };

    this.productoService.update(request).subscribe({
      next: (data) => {
        this.limpiarFormularioProducto();
        this.obtenerProductos();
        this.isUpdateActive = false;
      },
      error: (e) => { 
        console.log('Error al modificar producto:', e);
        alert('Error al modificar el producto. Revisa la consola para más detalles.');
      }
    });
  }

  guardarProducto() {
    if (this.IDProductoActual == 0) {
      this.agregarProducto();
    } else {
      this.modificarProducto();
    }
  }

  eliminarProducto(producto: IProducto) {
    if (producto.id && confirm(`¿Estás seguro de eliminar el producto "${producto.nombre}"?`)) {
      this.productoService.delete(producto.id).subscribe({
        next: (data) => {
          this.obtenerProductos();
        },
        error: (e) => { console.log('Error al eliminar producto:', e); }
      });
    }
  }

  limpiarFormularioProducto() {
    this.nombreProducto = '';
    this.descripcionProducto = '';
    this.precioProducto = 0;
    this.imagenProducto = '';
    this.categoriaProducto = 0;
    this.IDProductoActual = 0;
    this.isUpdateActive = false;
  }

  // CRUD Categorías
  obtenerCategorias() {
    this.categoriaService.getList().subscribe({
      next: (data: ICategoria[]) => {
        this.categorias = data;
      },
      error: (error) => {
        console.log('Error al obtener las categorías:', error);
      }
    });
  }

  agregarCategoria() {
    const request: ICategoria = {
      nombre: this.nombreCategoria
    };

    this.categoriaService.add(request).subscribe({
      next: (data) => {
        this.limpiarFormularioCategoria();
        this.obtenerCategorias();
      },
      error: (e) => { 
        console.log('Error al agregar categoría:', e);
        alert('Error al agregar la categoría. Revisa la consola para más detalles.');
      }
    });
  }

  obtenerCategoria(data: ICategoria) {
    this.nombreCategoria = data.nombre;
    this.IDCategoriaActual = data.id || 0;
    this.isUpdateCategoriaActive = true;
  }

  modificarCategoria() {
    const request: ICategoria = {
      id: this.IDCategoriaActual,
      nombre: this.nombreCategoria
    };

    this.categoriaService.update(request).subscribe({
      next: (data) => {
        this.limpiarFormularioCategoria();
        this.obtenerCategorias();
        this.isUpdateCategoriaActive = false;
      },
      error: (e) => { console.log(e); }
    });
  }

  guardarCategoria() {
    if (this.IDCategoriaActual == 0) {
      this.agregarCategoria();
    } else {
      this.modificarCategoria();
    }
  }

  eliminarCategoria(categoria: ICategoria) {
    if (!categoria.id) {
      alert('Error: ID de categoría no válido');
      return;
    }
    
    if (confirm(`¿Estás seguro de eliminar la categoría "${categoria.nombre}"?`)) {
      this.categoriaService.delete(categoria.id).subscribe({
        next: (data) => {
          console.log('Categoría eliminada exitosamente');
          this.obtenerCategorias();
        },
        error: (e) => { 
          console.error('Error al eliminar categoría:', e);
          alert('Error al eliminar la categoría');
        }
      });
    }
  }

  limpiarFormularioCategoria() {
    this.nombreCategoria = '';
    this.IDCategoriaActual = 0;
    this.isUpdateCategoriaActive = false;
  }
}
