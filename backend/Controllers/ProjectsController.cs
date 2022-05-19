using backend.Data;
using backend.Models;
using backend.Models.Project;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProjectsController : ControllerBase
    {
        AppDbContext db;
        public ProjectsController(AppDbContext _db)
        {
            db = _db;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return Ok(db.Projects.ToList());
        }


        [Route("AddProject")]
        [HttpPost]
        public IActionResult AddProject([FromBody] ProjectDto data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            if (data.Id != null)
            {
                return BadRequest("new project's id must not be defined.");
            }

            Project proj = new Project()
            {
                Name = data.Name,
                Client = data.Client,
                Performer = data.Performer,
                StartDate = data.StartDate,
                EndDate = data.EndDate,
                Priority = data.Priority
            };
            db.Projects.Add(proj);
            db.SaveChanges();
            return Ok(new { InsertedId = proj.Id });
        }
    }
}
