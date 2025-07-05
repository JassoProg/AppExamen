import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICategoria } from '../interfaces/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private endPoint: string = environment.endPoint;
  private apiUrl: string = this.endPoint + 'Categorias';

  constructor(private http: HttpClient) { }

  // Metodo para invocar el endPoint de GET api/Categorias 
  getList(): Observable<ICategoria[]> {
    return this.http.get<ICategoria[]>(`${this.apiUrl}`);
  }

  // Metodo para invocar el endPoint de POST api/Categorias 
  add(request: ICategoria): Observable<ICategoria> {
    // Crear el objeto con los nombres exactos que espera el backend
    const backendRequest: any = {
      nombre: request.nombre
    };
    
    console.log('Enviando categoría al backend:', backendRequest);
    return this.http.post<ICategoria>(`${this.apiUrl}`, backendRequest);
  }

  // Metodo para invocar el endPoint de PUT api/Categorias/{id}
  update(request: ICategoria): Observable<void> {
    const backendRequest: any = {
      id: request.id,
      nombre: request.nombre
    };
    
    console.log('Actualizando categoría en backend:', backendRequest);
    return this.http.put<void>(`${this.apiUrl}/${request.id}`, backendRequest);
  }

  // Metodo para invocar el endPoint de DELETE api/Categorias/{id}
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
