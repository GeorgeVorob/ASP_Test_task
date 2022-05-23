using backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TasksController : ControllerBase
    {
        AppDbContext db;
        public TasksController(AppDbContext _db)
        {
            db = _db;
        }

        private List<ProjectTaskDto> TasksToDTOs(List<ProjectTask> tasks)
        {
            List<ProjectTaskDto> result = new List<ProjectTaskDto>();
            foreach (var task in tasks)
            {
                result.Add(new ProjectTaskDto(task));
            }

            return result;
        }

        [HttpGet]
        public IActionResult Index([FromQuery] int? projectId)
        {
            IQueryable<ProjectTask> query = db.ProjectTasks.AsQueryable();
            if (projectId != null) query = query.Where(t => t.ProjectId == projectId);
            return Ok(TasksToDTOs(query.ToList()));
        }

        [Route("AddTask")]
        [HttpPost]
        public IActionResult AddTask([FromBody] ProjectTaskDto data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            if (data.Id != null)
            {
                return BadRequest(new { errorMessage = "id of new task must not be defined." });
            }

            ProjectTask task = new ProjectTask();
            task.SetValuesFromDTO(data, db);

            db.ProjectTasks.Add(task);
            db.SaveChanges();
            return Ok(new { InsertedId = task.Id });
        }

        // тасков у проекта обычно много, поэтому вместо точечного обновления метод принимает массив
        // массив DTO переводит в модели EF и заменяет ими старый список
        // TODO: вместо этого усложнить обновление проектов и обновлять таски там?
        [HttpPost]
        [Route("UpdateTasks")]
        public IActionResult UpdateTasks([FromBody, Required] ProjectTaskDto[] tasks, [FromQuery, Required] int projectId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            Project? projToUpdate = db.Projects
                .Include(p => p.Tasks)
                .Include(p => p.Workers)
                .SingleOrDefault(p => p.Id == projectId);
            if (projToUpdate == null)
                return BadRequest(new { message = "could not find project id: " + projectId });

            List<ProjectTask> newTasks = new List<ProjectTask>();
            foreach (var taskDto in tasks)
            {
                ProjectTask newTask = new ProjectTask();
                if (taskDto.ProjectId != projectId)
                    return BadRequest(new
                    {
                        message = "existing taks's id and project's id does not match. t: "
                                                        + taskDto.Id.ToString() + " p: " + projectId.ToString()
                    });

                newTask.SetValuesFromDTO(taskDto, db);
                newTasks.Add(newTask);
            }
            projToUpdate.Tasks = newTasks;
            db.SaveChanges();
            return Ok();
        }
    }
}
