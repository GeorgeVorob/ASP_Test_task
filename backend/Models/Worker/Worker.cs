using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Worker
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string? Surname { get; set; }
        public string? Patronymic { get; set; }
        [EmailAddress]
        public string? Email { get; set; }

        [InverseProperty("Workers")]
        public List<Project> WorkingProjects { get; set; } = new List<Project>();

        [InverseProperty("Manager")]
        public List<Project> ManagingProjects { get; set; } = new List<Project>();

        public void SetValuesFromDTO(WorkerDto dto)
        {
            Name = dto.Name;
            Surname = dto.Surname;
            Patronymic = dto.Patronymic;
            Email = dto.Email;
        }

    }
}
