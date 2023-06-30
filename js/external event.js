const load = {
    home: () => {
        jsonReader.then((json) => {
            albums = searchAlbum(json);
            console.log(albums.length);
            for (let i = 0; i < 15 && albums.length; i++) {
                // debugger;
                const random = Math.floor((albums.length - 1) * Math.random());
                documentCurrent
                    .getElementById("album-bar")
                    .appendChild(createAlbum(albums[random]));
                albums.splice(random, 1);
                console.log(i);
            }

            const artist = searchArtist(json);
            for (let i = 0; i < 33 && artist.length; i++) {
                const random = Math.floor((artist.length - 1) * Math.random());
                documentCurrent
                    .getElementById("artist-bar")
                    .appendChild(createArtist(artist[random]));
                artist.splice(random, 1);
            }
        });

        documentCurrent
            .getElementById("album-bar-container")
            .addEventListener("wheel", (event) => {
                event.preventDefault();
                if (scrolling) return;
                documentCurrent.getElementById("album-bar-container").scrollBy({
                    left: event.deltaY < 0 ? -800 : 800,
                });
                scrolling = true;
                setTimeout(() => {
                    scrolling = false;
                }, 300);
            });
    },
    album: () => {
        albums = searchAlbum(songs);
        albums.forEach((songInfo) => {
            if (
                songInfo.albumArtist == null ||
                songInfo.albumArtist == undefined
            ) {
                songInfo.albumArtist = "Unknown Artist";
            }
            documentCurrent
                .getElementById("album-bar")
                .appendChild(createAlbum(songInfo));
        });

        for (let i = 0; i < 30; i++) {
            songInfo = {
                album: "New Blood",
                albumArtist: "Yellow Claw",
                path: "music/Yellow Claw, STORi - Both Of Us.m4a",
                color: hsla,
            };
        }
    },
    albumListing: () => {
        albums = songs.filter((element) => {
            return (
                clicked.album.album == element.album &&
                clicked.album.albumArtist == element.albumArtist
            );
        });

        documentCurrent.getElementById("album-info-bar").style.backgroundImage =
            linearGradient(90, [
                hsl(clicked.album.color, 0.8),
                hsl(clicked.album.color),
                hsl(clicked.album.color),
            ]);
        documentCurrent.getElementById("album-cover").style.backgroundImage =
            url(clicked.album.cover);
        documentCurrent.getElementById("album-title").innerText =
            clicked.album.album;
        documentCurrent.getElementById("album-artist").innerText =
            clicked.album.albumArtist;
        documentCurrent.getElementById("album-genre").innerText =
            clicked.album.genre;
        documentCurrent.getElementById("album-year").innerText =
            clicked.album.year;
        documentCurrent.getElementById("album-songs").innerText =
            albums.length + " song" + (albums.length == 1 ? "" : "s");

        for (const iterator in albums) {
            documentCurrent
                .getElementById("song-list")
                .appendChild(
                    createSong(albums[iterator], iterator, "album-listing")
                );
        }

        documentCurrent
            .getElementById("play-icon")
            .addEventListener("click", () => {
                currentSongList = albums;
                totalSongs = currentSongList.length;
                currentSong = 0;
                audio.src = currentSongList[0]["path"];
                audio.play();
            });
    },
    artist: () => {
        const artist = searchAlbum(songs);
        for (const iterator of artist) {
            documentCurrent
                .getElementById("artist-bar")
                .appendChild(createArtist(iterator));
        }
    },
    song: () => {
        // totalSongs = songs.length;
        Array.from(songs).forEach((element, index) => {
            documentCurrent
                .getElementById("song-list")
                .appendChild(createSong(element, index, "songs"));
        });
    },
    artistListing: () => {
        // const artistLong = songs.filter(element => {
        // 	return clicked.artist.album == element.album && clicked.album.albumArtist == element.albumArtist
        // });

        artists = songs.filter((element) => {
            return clicked.artist?.artist == element.artist;
        });

        if (artists.length) {
            documentCurrent.getElementById(
                "artist-cover"
            ).style.backgroundImage = url(clicked.artist.cover);
            documentCurrent.getElementById("artist-name").innerText = `${
                clicked.artist.artist?.length > 18
                    ? clicked.artist.artist?.substr(0, 18) + ".."
                    : clicked.artist.artist
            }`;
        }

        for (const iterator in artists) {
            documentCurrent
                .getElementById("song-list")
                .appendChild(
                    createSong(artists[iterator], iterator, "artist-listing")
                );
        }
    },
};

document.getElementById("right-frame").addEventListener("load", () => {
    identifyPage = document
        .getElementById("right-frame")
        .attributes.src.ownerElement.contentDocument.getElementsByTagName(
            "html"
        )[0].attributes.name.value;
    documentCurrent =
        document.getElementById("right-frame").attributes.src.ownerElement
            .contentDocument;

    // setScrollBar(2, hsl(hsla, 0.045), hsl(hsla), "xy", (value) => {
    // 	value.doc = document.getElementById("right-frame").attributes.src.ownerElement.contentDocument;
    // 	value.scrollBar = value.doc.createElement("style");
    // });

    switch (identifyPage) {
        case "musicly-home":
            setTab("tab-home");

            load.home();
            break;

        case "musicly-album":
            setTab("tab-album");

            load.album();
            break;

        case "musicly-artist":
            setTab("tab-artist");

            load.artist();
            break;

        case "musicly-album-listing":
            setTab("tab-album");

            load.albumListing();
            break;
        case "musicly-song":
            setTab("tab-song");

            load.song();
            break;
        case "musicly-artist-listing":
            setTab("tab-artist");
            load.artistListing();
            break;
    }
});
