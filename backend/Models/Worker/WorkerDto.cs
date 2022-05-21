using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class WorkerDto
    {
        public WorkerDto() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string? Surname { get; set; }
        public string? Patronymic { get; set; }
        [EmailAddress]
        public string? Email { get; set; }

        public int[] WorkingProjectsIds { get; set; } = Array.Empty<int>();
        public int[] ManagingProjectsIds { get; set; } = Array.Empty<int>();

        public WorkerDto(Worker worker)
        {
            Id = worker.Id;
            Name = worker.Name;
            Surname = worker.Surname;
            Patronymic = worker.Patronymic;
            Email = worker.Email;
            WorkingProjectsIds = worker.WorkingProjects?.Select(x => x.Id).ToArray() ?? Array.Empty<int>();
            ManagingProjectsIds = worker.ManagingProjects?.Select(x => x.Id).ToArray() ?? Array.Empty<int>();
        }
    }
}
