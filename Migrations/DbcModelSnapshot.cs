﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MusicFront.Models;

namespace MusicFront.Migrations
{
    [DbContext(typeof(Dbc))]
    partial class DbcModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.4-servicing-10062");

            modelBuilder.Entity("MusicFront.Models.Albums.Album", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ImageUri");

                    b.Property<string>("LowerName")
                        .IsRequired();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("Uri")
                        .IsRequired();

                    b.Property<int?>("Year");

                    b.HasKey("Id");

                    b.HasIndex("Uri");

                    b.ToTable("albums");
                });

            modelBuilder.Entity("MusicFront.Models.Artists.Artist", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ImageUri");

                    b.Property<string>("LowerName")
                        .IsRequired();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("Uri")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("Uri");

                    b.ToTable("artists");
                });

            modelBuilder.Entity("MusicFront.Models.Genres.Genre", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("LowerName")
                        .IsRequired();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("Uri")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("Uri");

                    b.ToTable("genres");
                });

            modelBuilder.Entity("MusicFront.Models.Relations.ArtistAlbum", b =>
                {
                    b.Property<int>("ArtistId");

                    b.Property<int>("AlbumId");

                    b.HasKey("ArtistId", "AlbumId");

                    b.HasIndex("AlbumId");

                    b.HasIndex("ArtistId");

                    b.ToTable("artist_albums");
                });

            modelBuilder.Entity("MusicFront.Models.Relations.GenreAlbum", b =>
                {
                    b.Property<int>("GenreId");

                    b.Property<int>("AlbumId");

                    b.HasKey("GenreId", "AlbumId");

                    b.HasIndex("AlbumId");

                    b.HasIndex("GenreId");

                    b.ToTable("genre_albums");
                });

            modelBuilder.Entity("MusicFront.Models.Relations.GenreArtist", b =>
                {
                    b.Property<int>("GenreId");

                    b.Property<int>("ArtistId");

                    b.HasKey("GenreId", "ArtistId");

                    b.HasIndex("ArtistId");

                    b.HasIndex("GenreId");

                    b.ToTable("genre_artists");
                });

            modelBuilder.Entity("MusicFront.Models.Tracks.Track", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AlbumId");

                    b.Property<int>("BitRate");

                    b.Property<string>("Comment");

                    b.Property<string>("Date");

                    b.Property<int?>("DiscNo");

                    b.Property<long?>("LastModified");

                    b.Property<int?>("Length");

                    b.Property<string>("LowerName")
                        .IsRequired();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<int?>("TrackNo");

                    b.Property<string>("Uri")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("AlbumId");

                    b.ToTable("tracks");
                });

            modelBuilder.Entity("MusicFront.Models.Relations.ArtistAlbum", b =>
                {
                    b.HasOne("MusicFront.Models.Albums.Album", "Album")
                        .WithMany("ArtistAlbums")
                        .HasForeignKey("AlbumId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("MusicFront.Models.Artists.Artist", "Artist")
                        .WithMany("ArtistAlbums")
                        .HasForeignKey("ArtistId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MusicFront.Models.Relations.GenreAlbum", b =>
                {
                    b.HasOne("MusicFront.Models.Albums.Album", "Album")
                        .WithMany("GenreAlbums")
                        .HasForeignKey("AlbumId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("MusicFront.Models.Genres.Genre", "Genre")
                        .WithMany("GenreAlbums")
                        .HasForeignKey("GenreId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MusicFront.Models.Relations.GenreArtist", b =>
                {
                    b.HasOne("MusicFront.Models.Artists.Artist", "Artist")
                        .WithMany("GenreArtists")
                        .HasForeignKey("ArtistId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("MusicFront.Models.Genres.Genre", "Genre")
                        .WithMany("GenreArtists")
                        .HasForeignKey("GenreId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MusicFront.Models.Tracks.Track", b =>
                {
                    b.HasOne("MusicFront.Models.Albums.Album", "Album")
                        .WithMany()
                        .HasForeignKey("AlbumId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
