using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    public partial class workerProjectsNavField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Workers_Projects_ProjectId",
                table: "Workers");

            migrationBuilder.DropIndex(
                name: "IX_Workers_ProjectId",
                table: "Workers");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "Workers");

            migrationBuilder.CreateTable(
                name: "ProjectWorker",
                columns: table => new
                {
                    WorkersId = table.Column<int>(type: "INTEGER", nullable: false),
                    WorkingProjectsId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectWorker", x => new { x.WorkersId, x.WorkingProjectsId });
                    table.ForeignKey(
                        name: "FK_ProjectWorker_Projects_WorkingProjectsId",
                        column: x => x.WorkingProjectsId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectWorker_Workers_WorkersId",
                        column: x => x.WorkersId,
                        principalTable: "Workers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorker_WorkingProjectsId",
                table: "ProjectWorker",
                column: "WorkingProjectsId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectWorker");

            migrationBuilder.AddColumn<int>(
                name: "ProjectId",
                table: "Workers",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Workers_ProjectId",
                table: "Workers",
                column: "ProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_Workers_Projects_ProjectId",
                table: "Workers",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id");
        }
    }
}
