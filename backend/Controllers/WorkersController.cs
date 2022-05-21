using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WorkersController : Controller
    {
        AppDbContext db;
        public WorkersController(AppDbContext _db)
        {
            db = _db;
        }

        private List<WorkerDto> WorkersToDTOS(List<Worker> workers)
        {
            List<WorkerDto> result = new List<WorkerDto>();
            foreach (var worker in workers)
            {
                result.Add(new WorkerDto(worker));
            }

            return result;
        }

        [HttpGet]
        public IActionResult Index()
        {
            List<Worker> workers = db.Workers
                .Include(w => w.WorkingProjects)
                .Include(w=>w.ManagingProjects)
                .ToList();
            return Ok(WorkersToDTOS(workers));
        }

        [Route("AddWorker")]
        [HttpPost]
        public IActionResult AddWorker([FromBody] WorkerDto data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            if (data.Id != null)
            {
                return BadRequest(new { errorMessage = "id of new worker must not be defined." });
            }

            Worker wk = new Worker()
            {
                Name = data.Name,
                Surname = data.Surname,
                Patronymic = data.Patronymic,
                Email = data.Email
            };
            db.Workers.Add(wk);
            db.SaveChanges();
            return Ok(new { InsertedId = wk.Id });
        }

    }
}
