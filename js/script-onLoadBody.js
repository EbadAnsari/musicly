
/**
 * @file will load when the body loads.
 * 
 * @file import from call on load.js
 * 
 */

root = document.querySelector(":root");


audio = document.getElementById("audio");

jsonReader.then(json => {
    songs = json;
    currentSongList = songs;
    // currentSong = parseInt(Math.random() * 100) % songs.length;
    currentSong = 0;
    totalSongs = songs.length;
    audio.src = songs[currentSong]['path'];
});

masterSeekbar = Array.from(document.getElementsByClassName("master-seekbar"));

setVolume(document.getElementById("volume").value);

let loadingProgress = new Loading({
    container: ['svg', 'circle'],
    strokeWidth: 2,
    height: 58,
    animationDuration: [2000, 2000],
    timingFunction: ["ease-out", "ease-in"],
    strokeLinecap: "butt",
});

// let loadingBoxes = new LoadingBoxes({
// 	container: 'loading',
// 	duration: '4s',
// 	color: 'hsl(88, 91%, 37%)',
// 	dimension: 20,
// 	margin: 2,
// 	borderRadius: 10
// });

changeSeekbar("volume", () => {
    setVolume(parseInt(document.getElementById("volume").value));
    volumeAnimation(parseInt(document.getElementById("volume").value));
});

img_secondaryCover = document.getElementById("img");

document.getElementById("right-frame").addEventListener("load", () => {
    // let element = document.getElementById("right-frame").attributes.src.ownerElement.contentDocument;
    // stack.push(element);
    setScrollBar(2, hsl(hsla, 0.045), hsl(hsla), "xy", (value) => {
        value.doc = document.getElementById("right-frame").attributes.src.ownerElement.contentDocument;
        let style = value.doc.createElement("style");
        value.scrollBar = style;
    });
});