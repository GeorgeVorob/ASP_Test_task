﻿using Microsoft.EntityFrameworkCore;
using backend.Models;


namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Worker> Workers { get; set; }
        public DbSet<ProjectTask> ProjectTasks { get; set; }
    }
}
