using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WorkersController : ControllerBase
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
                .Include(w => w.ManagingProjects)
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

        [HttpPost]
        [Route("UpdateWorker")]
        public IActionResult UpdateWorker(WorkerDto data)
        {
            if (data.Id == null)
            {
                return BadRequest(new { errorMessage = "worker's id to update is required" });
            }
            //includes?
            Worker? workerToUpdate = db.Workers.SingleOrDefault(p => p.Id == data.Id);
            if (workerToUpdate == null)
            {
                return BadRequest(new { errorMessage = "unable to find given id" });
            }

            workerToUpdate.SetValuesFromDTO(data);

            db.SaveChanges();
            return Ok();
        }

        [HttpDelete]
        [Route("DeleteWorker")]
        public IActionResult DeleteWorker([FromQuery, Required] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            Worker? workerToDel = db.Workers
                .Include(w => w.WorkingProjects)
                .Include(w => w.ManagingProjects)
                .SingleOrDefault(w => w.Id == id);
            if (workerToDel == null)
            {
                return BadRequest(new { errorMessage = "unable to find given id" });
            }

            db.Workers.Remove(workerToDel);
            db.SaveChanges();
            return Ok();
        }

    }
}
