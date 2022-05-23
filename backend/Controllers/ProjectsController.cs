using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

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
        private List<ProjectDto> ProjectsToDTOS(List<Project> projects)
        {
            List<ProjectDto> result = new List<ProjectDto>();
            foreach (var project in projects)
            {
                result.Add(new ProjectDto(project));
            }
            return result;
        }

        [HttpGet]
        public IActionResult Index()
        {
            List<Project> projects = db.Projects.Include(w => w.Workers).ToList();
            return Ok(ProjectsToDTOS(projects));
        }

        [HttpGet]
        [Route("FilterProjects")]
        public IActionResult FilterProjects([FromQuery] ProjectFilterDto filter)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            List<Project> projects = filter.GetModelFilter(db.Projects.Include(p => p.Workers)).ToList();

            return Ok(ProjectsToDTOS(projects));
        }

        [HttpPost]
        [Route("UpdateProject")]
        public IActionResult UpdateProject(ProjectDto data)
        {
            if (data.Id == null)
            {
                return BadRequest(new { errorMessage = "project's id to update is required" });
            }
            Project? projToUpdate = db.Projects
                .Include(p => p.Workers)
                .Include(p => p.Tasks)
                .SingleOrDefault(p => p.Id == data.Id);

            if (projToUpdate == null)
            {
                return BadRequest(new { errorMessage = "unable to find given id" });
            }
            object errorMsg;
            if (projToUpdate.SetValuesFromDTO(data, db, out errorMsg) == false)
            {
                return BadRequest(errorMsg);
            }

            db.SaveChanges();
            return Ok();
        }

        [HttpDelete]
        [Route("DeleteProject")]
        public IActionResult DeleteProject([FromQuery, Required] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            Project? projToDel = db.Projects.Find(id);
            if (projToDel == null)
            {
                return BadRequest(new { errorMessage = "unable to find given id" });
            }

            db.Projects.Remove(projToDel);
            db.SaveChanges();
            return Ok();
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
                return BadRequest(new { errorMessage = "id of new project must not be defined." });
            }



            Project proj = new Project();
            object errorMsg;
            if (proj.SetValuesFromDTO(data, db, out errorMsg) == false)
            {
                return BadRequest(errorMsg);
            }

            db.Projects.Add(proj);
            db.SaveChanges();
            return Ok(new { InsertedId = proj.Id });
        }
    }
}
