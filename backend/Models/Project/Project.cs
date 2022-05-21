﻿using System.ComponentModel.DataAnnotations;
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
        [InverseProperty("ManagingProjects")]
        public Worker? Manager { get; set; } = null;
        [Required]
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        [Required]
        public int Priority { get; set; } = 0;
    }
}
