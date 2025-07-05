using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppExamen_BackEnd.Models;

namespace AppExamen_BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly AppExamenBdContext _context;

        public ProductosController(AppExamenBdContext context)
        {
            _context = context;
        }

        // GET: api/Productos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductos()
        {
            return await _context.Productos
                .Include(p => p.Categoria)
                .ToListAsync();
        }

        // GET: api/Productos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetProducto(int id)
        {
            var producto = await _context.Productos
                .Include(p => p.Categoria)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (producto == null)
            {
                return NotFound();
            }

            return producto;
        }

        // GET: api/Productos/categoria/5
        [HttpGet("categoria/{categoriaId}")]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductosByCategoria(int categoriaId)
        {
            // Validar que la categoría existe
            var categoriaExiste = await _context.Categoria.AnyAsync(c => c.Id == categoriaId);
            if (!categoriaExiste)
            {
                return NotFound("La categoría especificada no existe.");
            }

            var productos = await _context.Productos
                .Include(p => p.Categoria)
                .Where(p => p.CategoriaId == categoriaId)
                .ToListAsync();

            return productos;
        }

        // GET: api/Productos/buscar/pizza
        [HttpGet("buscar/{termino}")]
        public async Task<ActionResult<IEnumerable<Producto>>> BuscarProductos(string termino)
        {
            if (string.IsNullOrWhiteSpace(termino))
            {
                return BadRequest("El término de búsqueda no puede estar vacío.");
            }

            var productos = await _context.Productos
                .Include(p => p.Categoria)
                .Where(p => p.Nombre.Contains(termino) || 
                           (p.Descripcion != null && p.Descripcion.Contains(termino)) ||
                           p.Categoria.Nombre.Contains(termino))
                .ToListAsync();

            return productos;
        }

        // PUT: api/Productos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProducto(int id, Producto producto)
        {
            if (id != producto.Id)
            {
                return BadRequest();
            }

            // Validar que la categoría existe
            var categoriaExiste = await _context.Categoria.AnyAsync(c => c.Id == producto.CategoriaId);
            if (!categoriaExiste)
            {
                return BadRequest("La categoría especificada no existe.");
            }

            _context.Entry(producto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Productos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Producto>> PostProducto(Producto producto)
        {
            // Validar que la categoría existe
            var categoriaExiste = await _context.Categoria.AnyAsync(c => c.Id == producto.CategoriaId);
            if (!categoriaExiste)
            {
                return BadRequest("La categoría especificada no existe.");
            }

            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();

            // Cargar el producto recién creado con la categoría incluida
            var productoConCategoria = await _context.Productos
                .Include(p => p.Categoria)
                .FirstOrDefaultAsync(p => p.Id == producto.Id);

            return CreatedAtAction("GetProducto", new { id = producto.Id }, productoConCategoria);
        }

        // DELETE: api/Productos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
            {
                return NotFound();
            }

            _context.Productos.Remove(producto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductoExists(int id)
        {
            return _context.Productos.Any(e => e.Id == id);
        }
    }
}
