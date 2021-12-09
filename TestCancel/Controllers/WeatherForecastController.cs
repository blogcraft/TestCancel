using Microsoft.AspNetCore.Mvc;

namespace TestCancel.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
                private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet("infiniteCancel")]
        public IActionResult InfiniteCancel()
        {
            CancellationToken cancellation = this.HttpContext.RequestAborted;
            while(true)
            {
                if (cancellation.CanBeCanceled)
                {
                    Console.WriteLine("ok...");
                    cancellation.ThrowIfCancellationRequested();
                }
                else
                {
                    Console.WriteLine("Nope!");
                }
            }
            return Ok();
        }
    }
}