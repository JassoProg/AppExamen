import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio';
import { ProductosComponent } from './components/productos/productos';
import { AdminComponent } from './components/admin/admin';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];
