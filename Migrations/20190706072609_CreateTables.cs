using Microsoft.EntityFrameworkCore.Migrations;

namespace MusicFront.Migrations
{
    public partial class CreateTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "albums",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(nullable: false),
                    LowerName = table.Column<string>(nullable: false),
                    Uri = table.Column<string>(nullable: false),
                    Year = table.Column<int>(nullable: true),
                    ImageUri = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_albums", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "artists",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(nullable: false),
                    LowerName = table.Column<string>(nullable: false),
                    Uri = table.Column<string>(nullable: false),
                    ImageUri = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_artists", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "genres",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(nullable: false),
                    LowerName = table.Column<string>(nullable: false),
                    Uri = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_genres", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "artist_albums",
                columns: table => new
                {
                    ArtistId = table.Column<int>(nullable: false),
                    AlbumId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_artist_albums", x => new { x.ArtistId, x.AlbumId });
                    table.ForeignKey(
                        name: "FK_artist_albums_albums_AlbumId",
                        column: x => x.AlbumId,
                        principalTable: "albums",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_artist_albums_artists_ArtistId",
                        column: x => x.ArtistId,
                        principalTable: "artists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "genre_albums",
                columns: table => new
                {
                    GenreId = table.Column<int>(nullable: false),
                    AlbumId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_genre_albums", x => new { x.GenreId, x.AlbumId });
                    table.ForeignKey(
                        name: "FK_genre_albums_albums_AlbumId",
                        column: x => x.AlbumId,
                        principalTable: "albums",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_genre_albums_genres_GenreId",
                        column: x => x.GenreId,
                        principalTable: "genres",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "genre_artists",
                columns: table => new
                {
                    GenreId = table.Column<int>(nullable: false),
                    ArtistId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_genre_artists", x => new { x.GenreId, x.ArtistId });
                    table.ForeignKey(
                        name: "FK_genre_artists_artists_ArtistId",
                        column: x => x.ArtistId,
                        principalTable: "artists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_genre_artists_genres_GenreId",
                        column: x => x.GenreId,
                        principalTable: "genres",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tracks",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(nullable: false),
                    LowerName = table.Column<string>(nullable: false),
                    Uri = table.Column<string>(nullable: false),
                    DiscNo = table.Column<int>(nullable: true),
                    TrackNo = table.Column<int>(nullable: true),
                    Date = table.Column<string>(nullable: true),
                    Comment = table.Column<string>(nullable: true),
                    Length = table.Column<int>(nullable: true),
                    BitRate = table.Column<int>(nullable: false),
                    LastModified = table.Column<long>(nullable: true),
                    GenreId = table.Column<int>(nullable: false),
                    AlbumId = table.Column<int>(nullable: false)
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
                    table.ForeignKey(
                        name: "FK_tracks_genres_GenreId",
                        column: x => x.GenreId,
                        principalTable: "genres",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "track_artists",
                columns: table => new
                {
                    TrackId = table.Column<int>(nullable: false),
                    ArtistId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_track_artists", x => new { x.TrackId, x.ArtistId });
                    table.ForeignKey(
                        name: "FK_track_artists_artists_ArtistId",
                        column: x => x.ArtistId,
                        principalTable: "artists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_track_artists_tracks_TrackId",
                        column: x => x.TrackId,
                        principalTable: "tracks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "track_composers",
                columns: table => new
                {
                    TrackId = table.Column<int>(nullable: false),
                    ComposerId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_track_composers", x => new { x.TrackId, x.ComposerId });
                    table.ForeignKey(
                        name: "FK_track_composers_artists_ComposerId",
                        column: x => x.ComposerId,
                        principalTable: "artists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_track_composers_tracks_TrackId",
                        column: x => x.TrackId,
                        principalTable: "tracks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "track_performers",
                columns: table => new
                {
                    TrackId = table.Column<int>(nullable: false),
                    PerformerId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_track_performers", x => new { x.TrackId, x.PerformerId });
                    table.ForeignKey(
                        name: "FK_track_performers_artists_PerformerId",
                        column: x => x.PerformerId,
                        principalTable: "artists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_track_performers_tracks_TrackId",
                        column: x => x.TrackId,
                        principalTable: "tracks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_albums_Uri",
                table: "albums",
                column: "Uri");

            migrationBuilder.CreateIndex(
                name: "IX_artist_albums_AlbumId",
                table: "artist_albums",
                column: "AlbumId");

            migrationBuilder.CreateIndex(
                name: "IX_artist_albums_ArtistId",
                table: "artist_albums",
                column: "ArtistId");

            migrationBuilder.CreateIndex(
                name: "IX_artists_Uri",
                table: "artists",
                column: "Uri");

            migrationBuilder.CreateIndex(
                name: "IX_genre_albums_AlbumId",
                table: "genre_albums",
                column: "AlbumId");

            migrationBuilder.CreateIndex(
                name: "IX_genre_albums_GenreId",
                table: "genre_albums",
                column: "GenreId");

            migrationBuilder.CreateIndex(
                name: "IX_genre_artists_ArtistId",
                table: "genre_artists",
                column: "ArtistId");

            migrationBuilder.CreateIndex(
                name: "IX_genre_artists_GenreId",
                table: "genre_artists",
                column: "GenreId");

            migrationBuilder.CreateIndex(
                name: "IX_genres_Uri",
                table: "genres",
                column: "Uri");

            migrationBuilder.CreateIndex(
                name: "IX_track_artists_ArtistId",
                table: "track_artists",
                column: "ArtistId");

            migrationBuilder.CreateIndex(
                name: "IX_track_artists_TrackId",
                table: "track_artists",
                column: "TrackId");

            migrationBuilder.CreateIndex(
                name: "IX_track_composers_ComposerId",
                table: "track_composers",
                column: "ComposerId");

            migrationBuilder.CreateIndex(
                name: "IX_track_composers_TrackId",
                table: "track_composers",
                column: "TrackId");

            migrationBuilder.CreateIndex(
                name: "IX_track_performers_PerformerId",
                table: "track_performers",
                column: "PerformerId");

            migrationBuilder.CreateIndex(
                name: "IX_track_performers_TrackId",
                table: "track_performers",
                column: "TrackId");

            migrationBuilder.CreateIndex(
                name: "IX_tracks_AlbumId",
                table: "tracks",
                column: "AlbumId");

            migrationBuilder.CreateIndex(
                name: "IX_tracks_GenreId",
                table: "tracks",
                column: "GenreId");

            migrationBuilder.CreateIndex(
                name: "IX_tracks_Uri",
                table: "tracks",
                column: "Uri");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "artist_albums");

            migrationBuilder.DropTable(
                name: "genre_albums");

            migrationBuilder.DropTable(
                name: "genre_artists");

            migrationBuilder.DropTable(
                name: "track_artists");

            migrationBuilder.DropTable(
                name: "track_composers");

            migrationBuilder.DropTable(
                name: "track_performers");

            migrationBuilder.DropTable(
                name: "artists");

            migrationBuilder.DropTable(
                name: "tracks");

            migrationBuilder.DropTable(
                name: "albums");

            migrationBuilder.DropTable(
                name: "genres");
        }
    }
}
