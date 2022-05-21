using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    // Не уверен зачем именно DTO, разве что для отделения Сотрудников и Менеджера от данных самого проекта
    // Скорее просто захотелось сделать в рамках тестового задания.
    public class ProjectDto
    {
        public ProjectDto() { }


        public int? Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Client { get; set; }
        [Required]
        public string Performer { get; set; }
        public int[] WorkersIds { get; set; } = Array.Empty<int>();
        public int? ManagerId { get; set; }

        [Required]
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        [Required]
        public int Priority { get; set; }


        public ProjectDto(Project project)
        {
            Id = project.Id;
            Name = project.Name;
            Client = project.Client;
            Performer = project.Performer;
            WorkersIds = project.Workers?.Select(x => x.Id).ToArray() ?? Array.Empty<int>();
            ManagerId = project.Manager?.Id ?? null;
            StartDate = project.StartDate;
            EndDate = project.EndDate;
            Priority = project.Priority;
        }
    }
}
