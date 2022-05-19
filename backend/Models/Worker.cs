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
        //TODO email property in model?
        [EmailAddress]
        public string? Email { get; set; }
    }
}
