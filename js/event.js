audio.addEventListener("loadstart", () => {
    // averageColor(audio.src).then(songInfo => {

    const songInfo = currentSongList[currentSong];
    const imageData = songInfo.cover;

    hsla = songInfo.color;

    Array.from(document.getElementsByClassName("cover-image")).forEach(
        (element) => {
            element.style.backgroundImage = url(imageData);
        }
    );

    loadingProgress
        .change({
            backgroundImage: imageData,
            color: hsl(songInfo.color),
        })
        .make()
        .animate();

    document.getElementById("icon").href = imageData;

    document.getElementById("song-cover-blured").style.backgroundImage =
        url(imageData);
    document.getElementById("cover-photo").style.backgroundImage =
        url(imageData);

    document.getElementById("cover-photo").style.backgroundImage =
        url(imageData);
    document.getElementById("song-cover-blured").style.backgroundImage =
        url(imageData);

    {
        if (volumeLevel != 0)
            document.getElementById("icon-body").style.fill = hsl(hsla);
        else document.getElementById("icon-body").style.fill = hsl(hsla, 0.7);

        Array.from(document.getElementsByClassName("st1")).forEach(
            (element) => {
                element.style.stroke = hsl(hsla);
            }
        );
        Array.from(document.getElementsByClassName("point-null")).forEach(
            (element) => {
                element.style.stroke = hsl(hsla, 0.7);
            }
        );

        Array.from(document.getElementsByClassName("range")).forEach(
            (element) => {
                element.style.backgroundColor = hsl(hsla);
            }
        );

        Array.from(document.getElementsByClassName("play-pause")).forEach(
            (element) => {
                element.style.backgroundColor = hsl(hsla);
            }
        );

        document.getElementById("style").innerHTML = thumbColor(
            hsl(songInfo.color)
        );

        setScrollBar(2, hsl(hsla, 0.045), hsl(hsla), "xy", (value) => {
            value.doc = document;
            value.scrollBar = document.getElementById("style");
        });

        setPropertyValue("color-theme", hsl(hsla));
        setPropertyValue("color-theme-dim", hsl(hsla, 0.7));
        setPropertyValue("color-theme-dimer", hsl(hsla, 0.2));

        document.getElementById("app-title").style.color = hsl({
            h: hsla.h,
            s: hsla.s,
            l: 40,
            a: 1,
        });

        setTab(lastClick, hsla);

        setScrollBar(2, hsl(hsla, 0.1), hsl(hsla), "xy", (value) => {
            value.doc =
                document.getElementById(
                    "right-frame"
                ).attributes.src.ownerElement.contentDocument;
            let style = value.doc.createElement("style");
            value.scrollBar = style;
        });

        document.getElementById("main-body").style.backgroundColor = hsl(hsla);
    }

    {
        const artist = songInfo.artist;
        document.getElementById("name").innerText =
            songInfo.title.length >= 15
                ? songInfo.title.substr(0, 12) + "..."
                : songInfo.title;
        document.getElementById("artist").innerText =
            artist.length >= 20 ? artist.substr(0, 17) + "..." : artist;

        document.getElementById("song-title").innerText =
            songInfo.title.length >= 21
                ? songInfo.title.substr(0, 18) + "..."
                : songInfo.title;
        document.getElementById("song-artist").innerText =
            artist.length >= 30 ? artist.substr(0, 27) + "..." : artist;

        document.getElementsByTagName(
            "title"
        )[0].innerText = `${songInfo.title}`;
    }

    clicked.song = songInfo;
    createLyric(songInfo.lyrics);

    colorSong(songInfo);
});
audio.addEventListener("loadeddata", () => {
    totalTime = audio.duration;
    Array.from(document.getElementsByClassName("duration")).forEach(
        (element) =>
            (element.innerText = absoluteTimeToRelative(audio.duration))
    );
});
audio.addEventListener("ended", () => {
    switch (repeat) {
        case 0:
            audio.loop = false;
            audio.currentTime = 0;
            playAnimate();
            break;
        case 1:
            playNext();
            audio.src = currentSongList[currentSong]["path"];
            play();
            audio.loop = false;
            paleSong(clicked.song);
            break;
        case 2:
            audio.loop = true;
            break;
    }
});
audio.addEventListener("pause", () => {
    pause();
});
audio.addEventListener("play", () => {
    play();
});

Array.from(document.getElementsByClassName("previous")).forEach((element) => {
    element.addEventListener("click", () => {
        playPrevious();
        audio.src = currentSongList[currentSong]["path"];
        play();

        paleSong(clicked.song);
    });
});

Array.from(document.getElementsByClassName("play-pause")).forEach((element) =>
    element.addEventListener("click", () => {
        play_pause();
    })
);

document.getElementById("playing-cover").addEventListener("click", () => {
    play_pause();
});

Array.from(document.getElementsByClassName("next")).forEach((element) => {
    element.addEventListener("click", () => {
        playNext();
        audio.src = currentSongList[currentSong]["path"];
        play();

        paleSong(clicked.song);
    });
});

let lastNum = 0;
const lyric = document.getElementById("lyrics");
audio.addEventListener("timeupdate", () => {
    if (invoke) {
        let num = colorLyrics(Array.from(lyric.children), audio.currentTime);
        if (lastNum != num) {
            try {
                lyric.scrollTo(0, lyric.childNodes[num - 2].dataset.scrollTop);
            } catch (error) {}
            lastNum = num;
        }

        masterSeekbar.forEach((element) => {
            element.value = valueToPercentage(audio.currentTime, totalTime);
            element.nextElementSibling.style.width = `${element.value}%`;
            document.getElementById(
                "secondary-Seekbar"
            ).style.width = `${element.value}%`;
        });

        loadingProgress.progress(
            valueToPercentage(audio.currentTime, totalTime)
        );

        Array.from(document.getElementsByClassName("current-time")).forEach(
            (element) =>
                (element.innerText = absoluteTimeToRelative(audio.currentTime))
        );
    }
});
masterSeekbar.forEach((element) => {
    element.addEventListener("mousedown", () => (invoke = false));
    element.addEventListener("mouseup", () => {
        invoke = true;
        audio.currentTime = percentageToValue(element.value, totalTime);
    });

    element.addEventListener("input", () => {
        element.nextElementSibling.style.width = `${element.value}%`;

        document.getElementById(
            "secondary-Seekbar"
        ).style.width = `${element.value}%`;
        Array.from(document.getElementsByClassName("current-time")).forEach(
            (currentTimeElement) =>
                (currentTimeElement.innerText = absoluteTimeToRelative(
                    percentageToValue(element.value, totalTime)
                ))
        );
        loadingProgress.progress(element);

        let num = colorLyrics(
            Array.from(lyric.children),
            percentageToValue(element.value, audio.duration)
        );
        if (lastNum != num) {
            try {
                lyric.scrollTo(0, lyric.childNodes[num - 2].dataset.scrollTop);
            } catch (error) {}
            lastNum = num;
        }
    });
});

/**
 * @example Single/Linear/No Repeat Song.
 *. 0 -----> Only One
 *. 1 -----> Repeat Queue
 *. 2 -----> Repeat Single
 */
document.getElementById("repeat-icon").addEventListener("click", () => {
    let repeatIcon = document.getElementById("repeat-icon");

    let repeatOne = document.getElementById("repeat-one");
    let oneRepeat = document.getElementById("one-repeat");
    let noRepeat = document.getElementById("no-repeat");

    switch (repeat) {
        case 0:
            repeatIcon.style.transform = "rotate(360deg)";
            repeatOne.style.visibility = "visible";
            oneRepeat.style.visibility = "hidden";
            noRepeat.style.visibility = "hidden";
            audio.loop = false;
            break;
        case 1:
            repeatIcon.style.transform = "rotate(720deg)";
            repeatOne.style.visibility = "visible";
            oneRepeat.style.visibility = "visible";
            noRepeat.style.visibility = "hidden";
            audio.loop = true;
            break;
        case 2:
            repeatIcon.style.transform = "rotate(0deg)";
            repeatOne.style.visibility = "hidden";
            oneRepeat.style.visibility = "hidden";
            noRepeat.style.visibility = "visible";
            audio.loop = false;
            break;
    }
    repeat = ++repeat % 3;
});

document.getElementById("soundControl").addEventListener("click", () => {
    volumeLevel = (volumeLevel + 1) % 5;

    if (volumeLevel == 4) setVolume(100);
    else if (volumeLevel == 3) setVolume(80);
    else if (volumeLevel == 2) setVolume(40);
    else if (volumeLevel == 1) setVolume(15);
    else if (volumeLevel == 0) setVolume(0);
    volumeAnimation(valueToPercentage(audio.volume, 1));
});

document.getElementById("arrow").addEventListener("click", () => {
    if (up) {
        document.getElementById("left").style.transform = "rotate(45deg)";
        document.getElementById("right").style.transform = "rotate(-45deg)";
        up = false;

        document.getElementById("bottom-pannel").style.top = "100%";
        document.getElementById("full-seekbar").style.top = "100%";
        document.getElementById("arrow").style.top = "95%";
        document.getElementById("left-pannel").style.height = "100%";
        document.getElementById("right-pannel").style.height = "100%";
        document.getElementById("secondary-cover").style.top = "90%";
        document.getElementById("right-frame").style.height = "100%";

        if (identifyPage == "musicly-home") {
            documentCurrent.getElementById(
                "artist-bar-container"
            ).style.height = "50%";
        } else if (identifyPage == "musicly-album-listing") {
            documentCurrent.getElementById("song-list-container").style.height =
                "67vh";
        }

        root.style.setProperty("--seekbar-height", "10px");
    } else {
        document.getElementById("left").style.transform = "rotate(-45deg)";
        document.getElementById("right").style.transform = "rotate(45deg)";
        up = true;

        root.style.setProperty("--seekbar-height", "1px");
        document.getElementById("bottom-pannel").style.top = "90%";
        document.getElementById("full-seekbar").style.top = "90%";
        document.getElementById("arrow").style.top = "88.5%";
        document.getElementById("left-pannel").style.height = "90%";
        document.getElementById("right-pannel").style.height = "90%";
        document.getElementById("secondary-cover").style.top = "100%";
        document.getElementById("right-frame").style.height = "100%";

        if (identifyPage == "musicly-home") {
            documentCurrent.getElementById(
                "artist-bar-container"
            ).style.height = "46%";
        } else if (identifyPage == "musicly-album-listing") {
            documentCurrent.getElementById("song-list-container").style.height =
                "64vh";
        }
    }
});
document.getElementById("playing").addEventListener("click", () => {
    document.getElementById("main-body").style.top = "0%";
});

Array.from(document.getElementById("tab").children).forEach((element) => {
    element.addEventListener("click", (event) => {
        setTab(event.target.id);
    });
});

document.getElementById("down").addEventListener("click", () => {
    document.getElementById("main-body").style.top = "100%";
});
