using backend.Data;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public enum ProjectTaskStatus { ToDo, InProgress, Done };
    public class ProjectTask
    {
        public int Id { get; set; }
        public string Name { get; set; }
        [ForeignKey("Author")]
        public int AuthorId { get; set; }
        public Worker Author { get; set; }
        [ForeignKey("Implementer")]
        public int? ImplementerId { get; set; }
        public Worker? Implementer { get; set; }
        public ProjectTaskStatus Status { get; set; }
        public string? Comment { get; set; }
        public int Priority { get; set; }
        [ForeignKey("Project")]
        public int ProjectId { get; set; }
        public Project Project { get; set; }

        public ProjectTask() { }

        public void SetValuesFromDTO(ProjectTaskDto taskDto, AppDbContext db)
        {
            Name = taskDto.Name;
            AuthorId = taskDto.AuthorId;
            Author = db.Workers.Single(w => w.Id == taskDto.AuthorId);
            ImplementerId = taskDto.ImplementerId;
            Implementer = db.Workers.SingleOrDefault(w => w.Id == taskDto.ImplementerId);
            Status = (ProjectTaskStatus)Enum.Parse(typeof(ProjectTaskStatus), taskDto.Status);
            Comment = taskDto.Comment;
            //TODO: эти поля в DTO nullable для того, чтобы их заваливл ModelState, надо как-то сделать нормально
            Priority = (int)taskDto.Priority;
            ProjectId = (int)taskDto.ProjectId;
            Project = db.Projects.Single(p => p.Id == taskDto.ProjectId);
        }
    }
}
