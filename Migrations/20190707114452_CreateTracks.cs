using Microsoft.EntityFrameworkCore.Migrations;

namespace MopidyFinder.Migrations
{
    public partial class CreateTracks : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tracks",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(nullable: false),
                    LowerName = table.Column<string>(nullable: false),
                    Uri = table.Column<string>(nullable: false),
                    AlbumId = table.Column<int>(nullable: false),
                    DiscNo = table.Column<int>(nullable: true),
                    TrackNo = table.Column<int>(nullable: true),
                    Date = table.Column<string>(nullable: true),
                    Comment = table.Column<string>(nullable: true),
                    Length = table.Column<int>(nullable: true),
                    BitRate = table.Column<int>(nullable: false),
                    LastModified = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tracks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tracks_albums_AlbumId",
                        column: x => x.AlbumId,
                        principalTable: "albums",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tracks_AlbumId",
                table: "tracks",
                column: "AlbumId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tracks");
        }
    }
}
