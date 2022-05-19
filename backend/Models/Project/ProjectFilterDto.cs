using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace backend.Models.Project
{
    // объект фильтра от UI
    public class ProjectFilterDto
    {
        public string? Name { get; set; }
        public string? Client { get; set; }
        public string? Performer { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public int? PriorityFrom { get; set; }
        public int? PriorityTo { get; set; }

        public IQueryable<Project> GetModelFilter(DbSet<Project> table)
        {
            IQueryable<Project> query = table.AsQueryable();
            return this.SetModelFilter(query);
        }
        public IQueryable<Project> SetModelFilter (IQueryable<Project> query)
        {
            // TODO: looks bad
            if (this.Name != null) query = query.Where(el => el.Name == this.Name);
            if (this.Client != null) query = query.Where(el => el.Client == this.Client);
            if (this.Performer != null) query = query.Where(el => el.Performer == this.Performer);
            if (this.DateFrom != null) query = query.Where(el => el.StartDate >= this.DateFrom);
            if (this.DateTo != null) query = query.Where(el => el.StartDate <= this.DateTo);
            if (this.PriorityFrom != null) query = query.Where(el => el.Priority >= this.PriorityFrom);
            if (this.PriorityTo != null) query = query.Where(el => el.Priority <= this.PriorityTo);

            return query;
        }

    }
}
