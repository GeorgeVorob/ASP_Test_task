﻿using backend.Data;
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
        private List<ProjectDto> ProjectsToDTOS(List<Project> projects)
        {
            List<ProjectDto> result = new List<ProjectDto>();
            foreach (var project in projects)
            {
                result.Add(new ProjectDto());
            }

            return result;
        }


        AppDbContext db;
        public ProjectsController(AppDbContext _db)
        {
            db = _db;
        }

        [HttpGet]
        public IActionResult Index()
        {
            List<Project> projects = db.Projects.ToList();
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

            List<Project> projects = filter.GetModelFilter(db.Projects).ToList();

            return Ok(ProjectsToDTOS(projects));
        }

        [HttpPost]
        [Route("UpdateProject")]
        public IActionResult UpdateProject(ProjectDto data)
        {
            if (data.Id == null)
            {
                return BadRequest("project's id to update is required");
            }
            Project? projToUpdate = db.Projects.Find(data.Id);
            if (projToUpdate == null)
            {
                return BadRequest("unable to find given id");
            }
            List<Worker> newWorkers = new List<Worker>();
            foreach (int id in data.WorkersIds)
            {
                Worker? worker = db.Workers.Find(id);
                if (worker == null) return BadRequest("not found worker id - " + id.ToString());
                newWorkers.Add(worker);
            }
            Worker? newManager = null;
            if (data.ManagerId != null)
            {
                newManager = db.Workers.Find(data.ManagerId);
                if (newManager == null) return BadRequest("not found worker id - " + data.ManagerId.ToString());
            }

            projToUpdate.Name = data.Name;
            projToUpdate.Client = data.Client;
            projToUpdate.Performer = data.Performer;
            projToUpdate.Workers = newWorkers;
            projToUpdate.Manager = newManager;
            projToUpdate.StartDate = data.StartDate;
            projToUpdate.EndDate = data.EndDate;
            projToUpdate.Priority = data.Priority;

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
                return BadRequest("unable to find given id");
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
                return BadRequest("id of new project must not be defined.");
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
