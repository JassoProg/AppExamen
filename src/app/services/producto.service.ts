import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProducto } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private endPoint: string = environment.endPoint;
  private apiUrl: string = this.endPoint + 'Productos';

  constructor(private http: HttpClient) { }

  // Metodo para invocar el endPoint de GET api/Productos 
  getList(): Observable<IProducto[]> {
    return this.http.get<IProducto[]>(`${this.apiUrl}`);
  }

  // Metodo para invocar el endPoint de GET api/Productos/categoria/{categoriaId}
  getByCategoria(categoriaId: number): Observable<IProducto[]> {
    return this.http.get<IProducto[]>(`${this.apiUrl}/categoria/${categoriaId}`);
  }

  // Metodo para invocar el endPoint de GET api/Productos/buscar/{termino}
  buscar(termino: string): Observable<IProducto[]> {
    return this.http.get<IProducto[]>(`${this.apiUrl}/buscar/${termino}`);
  }

  // Metodo para invocar el endPoint de POST api/Productos 
  add(request: IProducto): Observable<IProducto> {
    // Crear el objeto con los nombres exactos que espera el backend
    const backendRequest: any = {
      nombre: request.nombre,
      precio: request.precio,
      categoriaId: request.categoriaId
    };
    
    // Solo agregar campos opcionales si tienen valor
    if (request.descripcion && request.descripcion.trim()) {
      backendRequest.descripcion = request.descripcion;
    }
    
    if (request.imagenUrl && request.imagenUrl.trim()) {
      backendRequest.imagenUrl = request.imagenUrl;
    }
    
    console.log('Enviando al backend (sin categoria requerida):', backendRequest);
    return this.http.post<IProducto>(`${this.apiUrl}`, backendRequest);
  }

  // Metodo para invocar el endPoint de PUT api/Productos/{id}
  update(request: IProducto): Observable<void> {
    // Crear el objeto con los nombres exactos que espera el backend
    const backendRequest: any = {
      id: request.id,
      nombre: request.nombre,
      precio: request.precio,
      categoriaId: request.categoriaId
    };
    
    // Solo agregar campos opcionales si tienen valor
    if (request.descripcion && request.descripcion.trim()) {
      backendRequest.descripcion = request.descripcion;
    }
    
    if (request.imagenUrl && request.imagenUrl.trim()) {
      backendRequest.imagenUrl = request.imagenUrl;
    }
    
    console.log('Actualizando en backend (sin categoria requerida):', backendRequest);
    return this.http.put<void>(`${this.apiUrl}/${request.id}`, backendRequest);
  }

  // Metodo para invocar el endPoint de DELETE api/Productos/{id}
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
