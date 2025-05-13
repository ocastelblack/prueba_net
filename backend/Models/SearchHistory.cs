using System;

namespace CatFactGiphyAPI.Models
{
    public class SearchHistory
    {
        public int Id { get; set; }
        public DateTime SearchDate { get; set; }
        public required string CatFact { get; set; }
        public required string Query { get; set; }
        public required string GifUrl { get; set; }
    }
}