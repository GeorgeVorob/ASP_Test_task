namespace Tests
{
    public class WorkersControllerTests
    {
        private static AppDbContext getDb()
        {
            DbContextOptionsBuilder<AppDbContext> options = new DbContextOptionsBuilder<AppDbContext>();
            options.UseSqlite("Data Source=TestDb.db");
            return new AppDbContext(options.Options);
        }

        [Fact]
        public void AddWorkerTest()
        {
            try
            {
                using (var db = getDb())
                {
                    db.Database.EnsureDeleted();
                    db.Database.EnsureCreated();

                    WorkersController controller = new WorkersController(db);

                    db.Workers.Add(new Worker()
                    {
                        Name = "Ivan",
                        Surname = "Ivanov",
                        Patronymic = "Ivanovich"
                    });

                    db.SaveChanges();

                    Worker wk = db.Workers.First();
                    Assert.True(wk.Name.Equals("Ivan"));
                    Assert.True(wk.Surname.Equals("Ivanov"));
                    Assert.True(wk.Patronymic.Equals("Ivanovich"));

                    db.Database.EnsureDeleted();
                }
            }
            catch
            {
                Assert.True(false);
            }
        }

        [Fact]
        public void UpdateWorkerTest()
        {
            try
            {
                using (var db = getDb())
                {
                    db.Database.EnsureDeleted();
                    db.Database.EnsureCreated();

                    WorkersController controller = new WorkersController(db);

                    db.Workers.Add(new Worker()
                    {
                        Name = "Ivan",
                        Surname = "Ivanov",
                        Patronymic = "Ivanovich"
                    });

                    db.SaveChanges();

                    Worker wk = db.Workers.First();
                    wk.Name = "Ivan2";

                    db.SaveChanges();

                    Worker wk2 = db.Workers.First();
                    Assert.True(wk2.Name == "Ivan2");

                    db.Database.EnsureDeleted();
                }
            }
            catch
            {
                Assert.True(false);
            }
        }
    }
}