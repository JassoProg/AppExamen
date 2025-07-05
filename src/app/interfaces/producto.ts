export interface IProducto {
    id?: number; // Opcional para POST (se auto-genera)
    nombre: string;
    descripcion?: string; // Opcional como en el backend
    precio: number;
    imagenUrl?: string; // Opcional como en el backend
    categoriaId: number;
    categoria?: {
        id: number;
        nombre: string;
    }; // Objeto categoria completo del backend
}
