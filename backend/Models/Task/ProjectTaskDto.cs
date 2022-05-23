using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class ProjectTaskDto
    {
        public int? Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int AuthorId { get; set; }
        public int? ImplementerId { get; set; }
        [Required]
        public string? Status { get; set; }
        public string? Comment { get; set; }
        [Required]
        public int? Priority { get; set; }
        [Required]
        public int? ProjectId { get; set;}

        public ProjectTaskDto() { }

        public ProjectTaskDto(ProjectTask task)
        {
            Id = task.Id;
            Name = task.Name;
            AuthorId = task.AuthorId;
            ImplementerId = task.ImplementerId;
            Status = task.Status.ToString();
            Comment = task.Comment;
            Priority = task.Priority;
            ProjectId = task.ProjectId;
        }
    }
}
