using Microsoft.EntityFrameworkCore;
using CatFactGiphyAPI.Models;

namespace CatFactGiphyAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<SearchHistory> SearchHistories { get; set; }
    }
}