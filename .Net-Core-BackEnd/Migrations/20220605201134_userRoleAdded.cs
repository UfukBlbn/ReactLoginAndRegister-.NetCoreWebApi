using Microsoft.EntityFrameworkCore.Migrations;

namespace IdentityServerTokenAuth.Migrations
{
    public partial class userRoleAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "userRole",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "userRole",
                table: "AspNetUsers");
        }
    }
}
