using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using CatFactGiphyAPI.Models;
using System;
using System.Linq;
using CatFactGiphyAPI.Data;

namespace CatFactGiphyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CatFactGiphyController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly AppDbContext _context;

        public CatFactGiphyController(IHttpClientFactory httpClientFactory, AppDbContext context)
        {
            _httpClientFactory = httpClientFactory;
            _context = context;
        }

        [HttpGet("fact")]
        public async Task<IActionResult> GetCatFact()
        {
            var client = _httpClientFactory.CreateClient();
            var response = await client.GetStringAsync("https://catfact.ninja/fact");
            if (string.IsNullOrEmpty(response))
                return NotFound("No se pudo obtener un dato de Cat Fact.");

            dynamic? catFact = JsonConvert.DeserializeObject(response);
            string fact = catFact?.fact ?? "Dato no disponible";

            // Guardar en historial con valores iniciales para Query y GifUrl
            var historyEntry = new SearchHistory
            {
                CatFact = fact,
                Query = string.Empty,
                GifUrl = string.Empty
            };

            _context.SearchHistories.Add(historyEntry);
            await _context.SaveChangesAsync();

            return Ok(new { fact });
        }

        [HttpGet("gif")]
        public async Task<IActionResult> GetGif([FromQuery] string query)
        {
            var client = _httpClientFactory.CreateClient();
            var apiKey = "voaNIOg1u7ONPbckzWK71C48YqCOkhVP";
            var requestUrl = $"https://api.giphy.com/v1/gifs/search?api_key={apiKey}&q={query}&limit=1";

            Console.WriteLine($"Giphy Request URL: {requestUrl}");

            var response = await client.GetStringAsync(requestUrl);

            if (string.IsNullOrEmpty(response))
            {
                Console.WriteLine("No se obtuvo respuesta de Giphy.");
                return NotFound("No se pudo obtener un GIF.");
            }

            Console.WriteLine($"Respuesta Giphy: {response}");

            dynamic? gifData = JsonConvert.DeserializeObject(response);

            if (gifData?.data?.Count == 0)
            {
                Console.WriteLine("No se encontró un GIF.");
                return NotFound("No se encontró un GIF.");
            }

            // Acceso a diferentes versiones del GIF
            var originalUrl = gifData.data[0].images.original.url;
            var downsizedUrl = gifData.data[0].images.downsized.url;
            var smallUrl = gifData.data[0].images.fixed_height_small.url;
            var previewUrl = gifData.data[0].images.preview_gif.url;

            Console.WriteLine($"Original: {originalUrl}");
            Console.WriteLine($"Downsized: {downsizedUrl}");
            Console.WriteLine($"Small: {smallUrl}");
            Console.WriteLine($"Preview: {previewUrl}");

            // Por ahora, retornaremos la versión `downsized` (más ligera y rápida de cargar)
            var gifUrl = downsizedUrl;

            // Actualizar el último registro con el GIF y query
            var lastEntry = _context.SearchHistories.OrderByDescending(h => h.Id).FirstOrDefault();
            if (lastEntry != null)
            {
                lastEntry.GifUrl = gifUrl;
                lastEntry.Query = query;
                await _context.SaveChangesAsync();
            }

            Console.WriteLine($"Valor de gifUrl antes de enviar la respuesta: {gifUrl}");

            return Ok(new
            {
                status = "success",
                gifUrl = gifUrl?.ToString(),
                message = gifUrl != null ? "GIF encontrado" : "No se encontró un GIF para el query especificado."
            });

        }

        [HttpGet("history")]
        public IActionResult GetHistory()
        {
            var history = _context.SearchHistories.ToList();
            return Ok(history);
        }
    }
}