using backend.Data;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Project
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Client { get; set; } // заказчик
        [Required]
        public string Performer { get; set; } // исполнитель

        [InverseProperty("WorkingProjects")]
        public List<Worker> Workers { get; set; }
        [ForeignKey("Manager")]
        public int? ManagerId { get; set; }
        [InverseProperty("ManagingProjects")]
        public Worker? Manager { get; set; } = null;
        [Required]
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        [Required]
        public int Priority { get; set; } = 0;
        public List<ProjectTask> Tasks { get; set; }

        public bool SetValuesFromDTO(ProjectDto dto, AppDbContext db, out object error)
        {
            Name = dto.Name;
            Client = dto.Client;
            Performer = dto.Performer;
            StartDate = dto.StartDate;
            EndDate = dto.EndDate;
            Priority = dto.Priority;

            List<Worker> newWorkers = new List<Worker>();
            foreach (int id in dto.WorkersIds)
            {
                Worker? worker = db.Workers.Find(id);
                if (worker == null)
                {
                    error = new { errorMessage = "not found worker id - " + id.ToString() };
                    return false;
                }
                newWorkers.Add(worker);
            }
            Worker? newManager = null;
            if (dto.ManagerId != null)
            {
                newManager = db.Workers.Find(dto.ManagerId);
                if (newManager == null)
                {
                    error = new { errorMessage = "not found worker id - " + dto.ManagerId.ToString() };
                    return false;
                }
            }

            Workers = newWorkers;
            Manager = newManager;
            error = new { };
            return true;
        }
    }
}
