using System;
using System.Collections.Generic;

namespace AppExamen_BackEnd.Models;

using System.Text.Json.Serialization;

public partial class Categoria
{
    public int Id { get; set; }
    public string Nombre { get; set; } = null!;

    [JsonIgnore] // Esto evita la referencia circular
    public virtual ICollection<Producto> Productos { get; set; } = new List<Producto>();
}