

/**
 * 
 * 
 * keywords to search
 * 
 * module: declare
 * variable: audio
 * variable: backward
 * variable: identifyPage
 * variable: img_animation_secondaryCover
 * variable: img_secondaryCover
 * variable: invoke
 * variable: lastClick
 * variable: repeat
 * variable: scrolling
 * variable: totalTime
 * variable: up
 * variable: vlm
 * variable: volumeLevel
 * variable: masterSeekbar
 * variable: documentCurrent
 * variable: clicked
 * variable: rgba
 * variable: hsla
 * variable: songInfo
 * variable: jsonReader
 * variable: currentSong
 * variable: stack
 * variable: root
 * 
 * 
 * ? All decleration of all variables are below.
 * 
 */

const musicly = {
	window: document,
	frame: new Document(),
	page: "musicly-home"
};

// document.getElementById("right-frame").addEventListener('load', (event) => {
// 	musicly.page = event.target.attributes.src.ownerElement.contentDocument.getElementsByTagName("html")[0].attributes.name.value;
// 	musicly.frame = event.target.attributes.src.ownerElement.contentDocument;
// });


const Color = {

	/**
	 * 
	 * @function rgb2hsl
	 * @param  {object} rgba rgba object containing color value of red as r, green as g, blue as b and alpha as a.
	 * @returns {string} an javascript object converting rgba color to hsla color.
	 * 
	*/
	rgb2hsl: (rgba) => {
		let hue = 0;
		let saturation = 0;
		let lightness = 0;

		let red = rgba.r / 255;
		let green = rgba.g / 255;
		let blue = rgba.b / 255;

		let max = Math.max(red, green, blue);
		let min = Math.min(red, green, blue);
		let delta = max - min;

		if (delta == 0)
			hue = 0;
		else if (max == red)
			hue = (green - blue) / delta % 6;
		else if (max == green)
			hue = (blue - red) / delta + 2;
		else if (max == blue)
			hue = (red - green) / delta + 4;

		hue = Math.round(hue * 60);

		if (hue < 0)
			hue += 360

		lightness = (max + min) / 2;

		if (delta != 0)
			saturation = delta / (1 - Math.abs(2 * lightness - 1));

		saturation = +(saturation * 100).toFixed(2);
		lightness = +(lightness * 100).toFixed(2);

		return { h: hue, s: saturation, l: lightness, a: 1 };
	},

	/**
	 * 
	 * @function hsl
	 * @param {object} hsla: hsla object containing color value of hue as h, saturation as s, lightness as l and alpha as a.
	 * @param {number} aplha: alpha holds aplha/opacity for color (Its defalut value is hsla.a).
	 * @returns {string} hsla css function as string which create using hsla (parameter).
	 * 
	*/
	hsl: ({h, s, l, a}) => {
		return `hsl(${h}, ${s}%, ${l}%, ${a})`;
	},

	/**
	 * 
	 * @function linearGradient
	 * @param {number} deg degree of rotation in css linear gradient function.
	 * @param {Array} colorArray array containing all colors (minimum color 2) to convert to css linear gradient color function.
	 * @returns {string} linear-gradient css function as string.
	 * 
	 * It will convert deg, colorArray to css linear-gradient function, ex: `deg` = 90 `colorArray` = ['red', 'green', 'blue'] @return linear-gradient(90deg, 'red', 'green', 'blue'); }
	 * 
	 */
	linearGradient: (deg, colorArray) => {
		if (colorArray.length <= 1) {
			console.error(new Error('Linear gradient color insufficient' + colorArray));
			return '';
		}

		let gradient = `linear-gradient(${deg}deg, `;

		let i = 0;
		while (i < colorArray.length - 1)
			gradient += Color.hsl(colorArray[i++]) + ', ';
		gradient += Color.hsl(colorArray[i]) + ')';

		return gradient;
	}
}

/**
 * {@link musiclyColor}
 */
const musiclyColor = {
	songColor: { h: 0, s: 0, l: 90, a: 1 },
	lightColorTheme: {
		leftPannel: { h: 0, s: 0, l: 90, a: 1 },
		bottomPannel: { h: 0, s: 0, l: 90, a: 1 },
		rightPannel: { h: 0, s: 0, l: 94, a: 1 }
	}
}

class Calculation {

	/**
	 * @param {number} start number to be generated (its range `start` with - inclusive)
	 * @param {number} end number to be generated (its range `end` with - exclusive)
	 * @returns {number} random number generated
	 */
	generateRandomNumberBetween(start, end) {
		return Math.floor(Math.random() * (end - start)) + start;
	}

	generateRandomNumberBetweenExcluding(start, end, numberArrayToBeExcluded) {
		let number = Math.floor(Math.random() * (end - start)) + start;
		if (Array.from(numberArrayToBeExcluded).includes(number)) {
			return this.generateRandomNumberBetweenExcluding(start, end, numberArrayToBeExcluded);
		}
		Array.from(numberArrayToBeExcluded).push(number);
		return number;
	}
}

const calculate = new Calculation();

/**
 * 
 * @description Song can be shuffled using `musiclyShuffle`.
 * 
 * * changeShuffleQueue
 * * nextShuffle
 * * previousShuffle
 * 
 */
class musiclyShuffle {
	constructor() {
		this.songWillPlayInFuture = new Array;
		this.songWhichArePlayed = new Array;
	}

	changeShuffleQueue(queue) {
		if (!(queue instanceof Array)) {
			console.error(new Error("queue is not an array"));
		}
		this.reshuffle(queue);
		this.shuffle = true;
	}

	nextShuffle(onNextShuffle) {
		if (this.songWillPlayInFuture.length == 0) {
			this.songWillPlayInFuture = this.songWhichArePlayed;
			this.songWhichArePlayed = new Array;
		}
		const index = calculate.generateRandomNumberBetween(0, this.songWillPlayInFuture.length);
		this.songWhichArePlayed.push(this.songWillPlayInFuture.splice(index, 1));
		onNextShuffle();
		return index;
	}

	previousShuffle(onPreviousShuffle) {
		if (this.songWhichArePlayed.length == 0) {
			return 0;
		}
		const index = this.songWhichArePlayed.pop();
		this.songWillPlayInFuture.push(index);
		onPreviousShuffle();
		return index;
	}
}

/**
 * 
 * 
 * `musiclySong` perform basic song operations such as play, pause and change the current playing song/queue. `extends` {@link musiclyShuffle}
 * 
 * **Functions:**
 * * changeQueue
 * * path
 * * play
 * * pause
 * * next
 * * previous
 * 
 * **Example**
 * ```javascript
 * const songQueue = {{...}, {...}, {...}, ...}
 * 
 * const song = musiclySong();
 * 
 * song.changeQueue(songQueue);
 * 
 * song.play(function () { ... });
 * song.pause(function () { ... });
 * ```
 * 
 */
class musiclySong extends musiclyShuffle {
	constructor() {
		super();

		this.song = new Audio();
		this.playingSongInQueue = new Number();
		this.songQueue = new Array();
		this.songQueueLength = new Number();
		this.shuffle = false;

		this.albums = new Array();
		this.artist = new Array();
	}

	/**
	 * 
	 * @param {Array} queue Load a new song queue.
	 */
	changeQueue(queue) {
		if (!(queue instanceof Array)) {
			console.error(new Error("queue is not an array"));
		}
		this.songQueue = queue;
		this.playingSongInQueue = this.songQueue.length;
		this.shuffle = false;
	}

	/**
	 * 
	 * @param {string} url Set a new `song` path.
	 * @param {callBackFunction} onSongLoadStart Call when the `song` start loading.
	 * @param {callBackFunction} onSongLoadFinish Call whtn the `song` end loading.
	 */
	path(url, onSongLoadStart, onSongLoadFinish) {
		this.song.src = url;
		this.song.addEventListener('loadstart', onSongLoadStart);
		this.song.addEventListener('loadedmetadata', onSongLoadFinish);
	}

	/**
	 * 
	 * @param {callBackFunction} onPlay Call when `song` start playing.
	 */
	play(onPlay) {
		this.song.play();
		onPlay();
	}

	/**
	 * 
	 * @param {callBackFunction} onPause Call when `song` pause.
	 */
	pause(onPause) {
		this.song.pause();
		onPause();
	}

	/**
	 * 
	 * @param {callBackFunction} onNext Call when next `song` is playing.
	 */
	next(onNext) {
		this.playingSongInQueue = ++this.playingSongInQueue % (this.songQueueLength - 1);
		onNext();
	}

	/**
	 * 
	 * @param {callBackFunction} onPrevious Call when previous `song` is playing.
	 */
	previous(onPrevious) {
		if (this.playingSongInQueue == 0) {
			this.playingSongInQueue = this.songQueueLength;
		}
		this.playingSongInQueue = --this.playingSongInQueue % this.songQueueLength;
		onPrevious();
	}
}

class musiclyTab {
	constructor() {
		this.activeTab = musicly.window.getElementById("tab-home");

		for (const element of this.element.children) {
			element.addEventListener("click", (event) => {
				this.activeTab.style.backgroundColor = "transparent";
				this.activeTab.style.borderColor = "transparent";
				this.activeTab.style.color = "black";


				this.activeTab = event.target;
				this.activeTab.style.backgroundColor = Color.linearGradient(90, [{ ...musiclyColor.songColor, a: 0.2 }, musiclyColor.lightColorTheme.leftPannel, musiclyColor.lightColorTheme.leftPannel]);
				this.activeTab.style.color = Color.hsl({ ...musiclyColor.songColor, l: 40 });
			});
		}
	}
}

const Song = new musiclySong();


/**
 * 
 * It creates SongElement
 * * Album
 * * Artist
 * * Song
 * 
 * #### Example
 * showing how to create song object in html page
 * ```javascript
 * SongElement.createSong({
 * 		album:'Final Song',
 * 		albumArtist: 'MQ',
 * 		artist: 'MQ',
 * 		color: { h: 88, s: 91, l: 37, a: 1 },
 * 		cover: 'sass/css/music record.svg',
 * 		duration: 178,
 * 		genre: 'Deep House',
 * 		lyric: null,
 * 		path: './MQ - Final Song.m4a',
 * 		title: Final Song,
 * 		track: 1,
 * 		year: 2020
 * 	});
 * ```
 * 
 * 
 */
const SongElement = {
	createSong: (songInfo) => {
		let anchor = true;

		const song = document.createElement('div');

		const songCover = document.createElement('div');
		const songTitle = document.createElement('div');
		const songArtist = document.createElement('a');
		const songAlbum = document.createElement('a');
		const songGenre = document.createElement('a');
		const songDuration = document.createElement('div');

		song.setAttribute('class', 'song');
		song.dataset.title = songInfo.title;
		song.dataset.artist = songInfo.artist;
		song.dataset.album = songInfo.album;
		song.dataset.genre = songInfo.genre;
		song.dataset.duration = songInfo.duration;
		song.dataset.path = songInfo.path;
		song.dataset.songNumber = number;

		songCover.setAttribute('class', 'song-cover');
		songTitle.setAttribute('class', 'song-title');
		songArtist.setAttribute('class', 'song-artist');
		songAlbum.setAttribute('class', 'song-album');
		songGenre.setAttribute('class', 'song-genre');
		songDuration.setAttribute('class', 'song-duration');

		songArtist.setAttribute('href', '#');

		songAlbum.setAttribute('href', 'album listing.html');
		songAlbum.setAttribute('target', 'master-frame');
		songAlbum.addEventListener('click', () => {
			clicked.album = songInfo;
			anchor = false;
		});

		[songAlbum, songArtist, songGenre].forEach((element) => {
			element.addEventListener('mousedown', () => {
				anchor = false;
			});
			element.addEventListener('mouseup', () => {
				anchor = true;
			});
		});

		songGenre.setAttribute('href', '#');

		let artist = songInfo.artist
		songCover.style.backgroundImage = url(songInfo.cover);
		songTitle.appendChild(document.createTextNode(songInfo.title));
		songArtist.appendChild(document.createTextNode(artist.substr(0, 37) + (artist.length >= 40
			? '...'
			: ''
		)));
		songAlbum.appendChild(document.createTextNode(songInfo.album));
		songGenre.appendChild(document.createTextNode(songInfo.genre));
		songDuration.appendChild(document.createTextNode(absoluteTimeToRelative(songInfo.duration)));

		song.appendChild(songCover);
		song.appendChild(songTitle);
		song.appendChild(songArtist);
		song.appendChild(songAlbum);
		song.appendChild(songGenre);
		song.appendChild(songDuration);

		song.addEventListener('click', () => {
			if (anchor) {
				if (stack.song != null || stack.song != undefined) {
					stack.song.style.backgroundColor = 'transparent';
					stack.song.style.color = 'black';
				}
				currentSong = song.dataset.songNumber;
				audio.src = songInfo['path'];
				song.style.color = 'white';
				song.style.backgroundColor = hsl(songInfo.color);
				audio.play();
				stack.song = song;

				switch (activeBody) {
					case 'songs':
						currentSongList = songs;
						break;
					case 'album-listing':
						currentSongList = albums;
						break;

					default:
						break;
				}
				totalSongs = currentSongList.length;
			}
		});

		if (clicked.song && songInfo.title == clicked.song.title && songInfo.artist == clicked.song.artist && songInfo.album == clicked.song.album) {
			song.style.backgroundColor = hsl(songInfo.color);
			song.style.color = 'white';
			stack.song = song;
		}

		return song;
	},


	createArtist: (songInfo) => {
		let artist = document.createElement('div');
		let artistImage = document.createElement('div');
		let artistInfo = document.createElement('div');
		let artistName = document.createElement('label');
		let artistGenreName = document.createElement('label');

		artistImage.style.backgroundImage = url(songInfo.cover);

		artistName.appendChild(document.createTextNode(songInfo.artist.length > 8 ? songInfo.artist.substr(0, 8) + '...' : songInfo.artist));
		artistGenreName.appendChild(document.createTextNode(songInfo.genre.length > 15 ? songInfo.genre.substr(0, 15) + '..' : songInfo.genre));

		artist.setAttribute('class', 'artist');
		artist.dataset.artist = songInfo.artist;

		artistImage.setAttribute('class', 'artist-image');
		artistInfo.setAttribute('class', 'artist-info');
		artistName.setAttribute('class', 'artist-name');
		artistGenreName.setAttribute('class', 'artist-genre-name');

		artistInfo.appendChild(artistName);
		artistInfo.appendChild(artistGenreName);

		artist.appendChild(artistImage);
		artist.appendChild(artistInfo);

		return artist;
	},

	/**
	 * 
	 * @param {object} songInfo Information about song ex: title, artist, album, etc.
	 * @returns {HTMLObjectElement} album
	 */
	createAlbum: (songInfo) => {
		let album = document.createElement('a');
		let albumImage = document.createElement('div');
		let playButton = document.createElement('div');
		let albumInfo = document.createElement('div');

		let albumTitle = document.createElement('label');
		let albumArtistName = document.createElement('a');

		if (songInfo.cover != undefined)
			albumImage.style.backgroundImage = url(songInfo.cover);
		albumImage.style.backgroundColor = hsl(songInfo.color);

		playButton.style.backgroundColor = hsl(songInfo.color);

		albumTitle.appendChild(document.createTextNode(songInfo.album.length >= 12 ? songInfo.album.substr(0, 11) + '...' : songInfo.album));

		if (songInfo.albumArtist == null)
			songInfo.albumArtist = songInfo.artist
		albumArtistName.appendChild(document.createTextNode(songInfo.albumArtist.length >= 25 ? songInfo.albumArtist.substr(0, 22) + '...' : songInfo.albumArtist));

		album.style.backgroundColor = hsl(songInfo.color);

		album.setAttribute('class', 'album');
		album.setAttribute('href', 'album listing.html');
		album.setAttribute('target', 'master-frame');

		album.dataset.path = '#';
		album.dataset.album = songInfo.album;
		album.dataset.album = songInfo.albumArtist;
		album.dataset.genre = songInfo.genre;
		album.dataset.year = songInfo.year;
		album.dataset.track = songInfo.track;

		albumImage.setAttribute('class', 'album-image');
		playButton.setAttribute('class', 'play-button');
		albumInfo.setAttribute('class', 'album-info');

		albumTitle.setAttribute('class', 'album-title');
		albumArtistName.setAttribute('class', 'album-artist-name');

		albumImage.appendChild(playButton);

		albumInfo.appendChild(albumTitle);
		albumInfo.appendChild(albumArtistName);

		album.appendChild(albumImage);
		album.appendChild(albumInfo);

		album.addEventListener('click', () => {
			clicked.album = songInfo;
		});

		return album;
	}
}


function requestFromDatabase(query) {
	return new Promise((resolve, reject) => {
		resolve(true);
	});
}


class Home {

	constructor() {
		// Fetch from database.
	}

	async loadAlbum() {
		const albums = await requestFromDatabase("query");
		const albumBar = musicly.frame.getElementById("album-bar");

		for (const album of albums) {
			albumBar.appendChild(SongElement.createAlbum(album));
		}
	}


	async loadArtist() {
		const artists = await requestFromDatabase("query");
		const artistBar = musicly.frame.getElementById("artist-bar");

		for (const artist of artists) {
			artistBar.appendChild(SongElement.createArtist(artist));
		}
	}

}


let audio = null;
let backward = false;
let identifyPage = new String;
let img_animation_secondaryCover = null;
let img_secondaryCover = null;
let invoke = true;
let lastClick = 'tab-home';
let repeat = 1;
let scrolling = false;
let totalTime = null;
let up = true;
let vlm = 0;
let volumeLevel = 3;

let masterSeekbar = null;
let documentCurrent = null;

let activeBody = "home";

const clicked = {
	artist: null,
	album: null,
	song: null,
};

let rgba = { r: 102, g: 181, b: 9, a: 1 };
let hsla = { h: 88, s: 91, l: 37, a: 1 };

/**
 * 
 * let songInfo = {
 *      album: 'Unknown Album',
 *      albumArtist: 'Unknown Artist',
 *      artist: 'Unknown Artist',
 *      color: { h: 88, s: 91, l: 37, a: 1 },
 *      cover: 'sass/css/music record.svg',
 *      duration: 0,
 *      genre: 'Unknown Genre',
 *      lyric: null,
 *      path: undefined,
 *      title: undefined,
 *      track: 0,
 *      year: '0000',
 * }
 * 
*/
let songInfo = null;

let currentSongList = null;
let songs = null;
let albums = null;
let artists = null;

let totalSongs = 0;

const jsonReader = fetch('../json/song-data.json').then(res => res.json());

let currentSong = 0;

const stack = {
	song: null,
	album: null,
	artist: null,
}

let root = null;


/**
 * 
 * from @file color function.js
 * 
 * keywords to search
 * function: color
 * function: rgb
 * function: rgb2hsl
 * function: defaultRun
 * function: url
 * function: thumbColor
 * function: copyColor
 * function: linearGradient
 * 
 * ? All the color related function are listed below and description.
 * 
 * @function rgb
 * @function rgb2hsl
 * @function defaultRun
 * @function url
 * @function thumbColor
 * @function copyColor
 * @function linearGradient
 * 
 */


/**
 * 
 * @function rgb
 * @param {object} rgba rgba object containing color value of red as r, green as g, blue as b and alpha as a.
 * @returns {string} rgba css function as string which create using rgba (parameter).
 * 
*/
function rgb(rgba) {
	return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
}

/**
 * 
 * @function hsl
 * @param {object} hsla: hsla object containing color value of hue as h, saturation as s, lightness as l and alpha as a.
 * @param {number} aplha: alpha holds aplha/opacity for color (Its defalut value is hsla.a).
 * @returns {string} hsla css function as string which create using hsla (parameter).
 * 
*/
function hsl(hsla, alpha = hsla.a) {
	return `hsl(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${alpha})`;
}

/**
 * 
 * @function defaultRun
 * @param {object} rgba rgba object containing color value of red as r, green as g, blue as b and alpha as a.
 * @param {object} hsla hsla object containing color value of hue as h, saturation as s, lightness as l and alpha as a.
 * 
 */
function defaultRun(rgba, hsla) {
	rgba = { r: 102, g: 181, b: 9, a: 1 };
	hsla = { h: 88, s: 91, l: 37, a: 1 };
}


/**
 * 
 * @function url
 * @param {string} link an url.
 * @returns {string} url css function as string.
 * 
 */
function url(link) {
	return `url('${link}')`;
}

/**
 * 
 * @function thumbColorlinearGradient
 * @param {string} color color as string in any format such as rgb(255, 255, 255), hsl(255, 255, 255), 'white'.
 * @returns {string} url css function as string.
 * 
 */
function thumbColor(color) {
	return `.seekbar-time .container .thumb::-webkit-slider-thumb { background-color: ${color}; }`
}

function copyColor(from, to) {
	for (let x in from)
		to[x] = from[x];
}


/**
 * 
 * @function linearGradient
 * @param {number} deg degree of rotation in css linear gradient function.
 * @param {Array} colorArray array containing all colors (minimum color 2) to convert to css linear gradient color function.
 * @returns {string} linear-gradient css function as string.
 * 
 * @description it will convert deg, colorArray to css linear-gradient function, ex: @var deg = 90 @var colorArray = ['red', 'green', 'blue'] @return linear-gradient(90deg, 'red', 'green', 'blue'); }
 * 
 */
function linearGradient(deg, colorArray) {
	if (colorArray.length <= 1) {
		console.error(new Error('Linear gradient color insufficient' + colorArray));
		return '';
	}

	let gradient = `linear-gradient(${deg}deg, `;

	let i = 0;
	while (i < colorArray.length - 1)
		gradient += colorArray[i++] + ', ';
	gradient += colorArray[i] + ')';

	return gradient;
}

/**
 * 
 * from @file 'color function.js'
 * 
 * keyword to search
 * module: math
 * 
 * ? All the math related function.
 * 
 * @function percentageToValue
 * @function valueToPercentage
 * @function absoluteTimeToRelative
 * @function relativeToAbsolute
 * @function getPropertyValue
 * @function setPropertyValue
 * @function inBetween
 * 
 */

/**
 * 
 * @function percentageToValue
 * @param {number} percentage percentage to be converted into units ex: 70%(per) of 100 units(max).
 * @param {number} max percentage to be calculated from max.
 * @returns {number}
 * 
 * @description it returns calculated value ex: 70% of 100 units => 70 units.
 * 
 */
function percentageToValue(percentage, max) {
	return parseFloat((parseFloat(percentage) / 100) * parseFloat(max));
}

/**
 * 
 * @function valueToPercentage
 * @param {number} value units to be converted into percentage ex: 70 units(val) of 100 units(max).
 * @param {number} max units to be calculated from max.
 * @returns {number} calculated value ex: 70 units of 100 units => 70%.
 * 
 */
function valueToPercentage(value, max) {
	return parseFloat((parseFloat(value) / parseFloat(max)) * 100);
}


/**
 * 
 * @function absoluteTimeToRelative
 * @param {number} timeInSeconds time in seconds.
 * @returns {string} timeInSeconds converted into hh:mm:ss format.
 * 
 */
function absoluteTimeToRelative(timeInSeconds) {
	let second = parseInt(timeInSeconds % 60);
	let minute = parseInt(timeInSeconds / 60);
	let hours = parseInt(minute / 60 % 60);

	return `${hours ? hours + ':' : ''}${minute > 9 ? minute : '0' + minute}:${second > 9 ? second : '0' + second}`;
}


/**
 * 
 * @function relativeToAbsolute
 * @param {number} minutes time in minutes.
 * @param {number} seconds time in seconds.
 * @returns {number} minutes and seconds are converted into seconds.
 * 
 */
function relativeToAbsolute(minutes, seconds) {
	return parseFloat(seconds) + parseFloat(minutes) * 60;
}


/**
 * 
 * @function getPropertyValue
 * @param {string} property property of :root element.
 * @returns {number} property value.
 * 
 */
function getPropertyValue(property) {
	return getComputedStyle(root).getPropertyValue(`--${property}`);
} function setPropertyValue(property, value) {
	root.style.setProperty(`--${property}`, value);
}

/**
 * 
 * @function getPropertyValue
 * @param {number} start starting number.
 * @param {number} value value.
 * @param {number} end ending number.
 * @returns {boolean} if value lies between start and end including.
 * 
 */
function inBetween(start, value, end) {
	return (start <= value) && (value <= end);
}

/**
 * 
 * keyword to search
 * 
 * module: volume
 * function: setVolume
 * 
 * ? build.js
 * 
 */


/**
 * 
 * @function setVolume
 * @param {number} volume value of volume range from 0% to 100%.
 * @description It set the value of audio.src, #volumeRagne.style.width, #volumePercentage.innerText, #volume.value.
 * @returns {void}
 * 
 */
function setVolume(volume) {
	let value = volume;
	audio.volume = percentageToValue(value, 1);
	document.getElementById('volumeRange').style.width = `${value}%`;
	value = parseInt(value);
	document.getElementById('volumePercentage').innerText = `${value > 9 ? (value == 100 ? value : '0' + value) : ('00' + value)}%`;
	document.getElementById('volume').value = value;
}

/**
 * 
 * @function volumeAnimation
 * @param {number} volume current volume
 * @description It work on the #soundControl. It display/hide bars in front of #icon-body accroding to the volume.
 * 
 * when the volume is 0 then ->
 * 		the crossing bars (.point-null) get displayed
 * 		#icon-body color alpha/opacity set to 0.7
 * 		volumeLevel set to 0
 * 
 * when the volume is in between 0 - 15 then ->
 * 		volumeLevel set to 1
 * 
 * when the volume >= 15 then ->
 * 		#point-one (bar-one) will be visible
 * 		volumeLevel set to 1
 * 
 * when the volume >= 40 then ->
 * 		#point-five (bar-two) will be visible
 * 		volumeLevel set to 2
 * 
 * when the volume >= 80 then ->
 * 		#point-nine (bar-three) will be visible
 * 		volumeLevel set to 3
 * 
 * when the volume is equal to 100 then ->
 * 		volumeLevel set to 4
 * 
 * @returns {void}
 * 
 */
function volumeAnimation(volume) {
	volume = parseInt(volume);
	document.getElementById('point-one').style.visibility = 'hidden';
	document.getElementById('point-five').style.visibility = 'hidden';
	document.getElementById('point-nine').style.visibility = 'hidden';
	document.getElementById('icon-body').style.fill = hsl(hsla);
	Array.from(document.getElementsByClassName('point-null')).forEach(element => {
		element.style.visibility = 'hidden';
	});

	if (volume == 0) {
		Array.from(document.getElementsByClassName('point-null')).forEach(element => {
			element.style.visibility = 'visible';
		});
		document.getElementById('icon-body').style.fill = hsl(hsla, 0.7);
		volumeLevel = 0;
	}
	if (volume > 0 && volume < 15) {
		volumeLevel = 1;
	}
	if (volume >= 15) {
		document.getElementById('point-one').style.visibility = 'visible';
		volumeLevel = 1;
	}
	if (volume >= 40) {
		document.getElementById('point-five').style.visibility = 'visible';
		volumeLevel = 2;
	}
	if (volume >= 80) {
		document.getElementById('point-nine').style.visibility = 'visible';
		volumeLevel = 3;
	}
	if (volume == 100) {
		volumeLevel = 4;
	}
}

/**
 * 
 * @function playAnimate
 * @function pauseAnimate
 * 
 * @description They will play the play/pause animation with .moving-bar-1, .moving-bar-2.
 */
function playAnimate() {
	const obj1 = Array.from(document.getElementsByClassName('moving-bar-1'));
	const obj2 = Array.from(document.getElementsByClassName('moving-bar-2'));

	obj1.forEach(element => {
		element.style.height = '20px';
		element.style.borderRadius = '10px';
		element.style.transform = 'rotate(-60deg) translate(-7.7px, -0.74px)';
	});

	obj2.forEach(element => {
		element.style.height = '20px';
		element.style.borderRadius = '10px';
		element.style.transform = 'rotate(60deg) translate(-7.555px, 0.85px)';
	});
} function pauseAnimate() {
	const obj1 = Array.from(document.getElementsByClassName('moving-bar-1'));
	const obj2 = Array.from(document.getElementsByClassName('moving-bar-2'));

	obj1.forEach(element => {
		element.style.height = '10px';
		element.style.borderRadius = '10px 10px 0px 0px';
		element.style.transform = 'rotate(0deg) translate(0px, 0px)';
	});

	obj2.forEach(element => {
		element.style.borderRadius = '0px 0px 10px 10px';
		element.style.height = obj1[0].style.height;
		element.style.transform = obj1[0].style.transform;
	});
}


/**
 * 
 * @function pause
 * @function play
 * @function play_pause
 * 
 * @description They will play/pause the audio, call playAnimate/pauseAnimate function and play/pause the rotation of #secondary-cover.
 * 
 */
function pause() {
	audio.pause();
	img_animation_secondaryCover.pause();
	playAnimate();
}

/**
 * 
 * @function pause
 * @function play
 * @function play_pause
 * 
 * @description They will play/pause the audio, call playAnimate/pauseAnimate function and play/pause the rotation of #secondary-cover.
 * 
 */
function play() {
	audio.play();
	img_animation_secondaryCover.play();
	pauseAnimate();
}

/**
 * 
 * @function pause
 * @function play
 * @function play_pause
 * 
 * @description They will play/pause the audio, call playAnimate/pauseAnimate function and play/pause the rotation of #secondary-cover.
 * 
*/
function play_pause() {
	if (audio.paused)
		play();
	else
		pause();
}

function changeSeekbar(seekbar, _function) {
	document.getElementById(seekbar).addEventListener('input', () => {
		document.getElementById(seekbar).nextElementSibling.style.width = `${document.getElementById(seekbar).value}%`;
		_function();
	});
}

/**
 * 
 * @function setTab
 * @param {string} to string containing 'id' of element (tab ex: home, album, song, etc) that currently clicked.
 * @returns {void}
 * 
 */
function setTab(to) {
	document.getElementById(lastClick).style.backgroundImage = 'linear-gradient(0deg, hsl(0, 0%, 90%), hsl(0, 0%, 90%))';
	document.getElementById(lastClick).style.color = '#000';
	document.getElementById(lastClick).style.borderColor = 'hsl(0, 0%, 90%)';

	document.getElementById(to).style.backgroundImage = 'linear-gradient(90deg, var(--color-theme-dimer), hsl(0, 0%, 90%), hsl(0, 0%, 90%)';
	document.getElementById(to).style.color = hsl({ h: hsla.h, s: hsla.s, l: 40, a: 1 });
	document.getElementById(to).style.borderColor = hsl(hsla);

	lastClick = to;
}

/**
 * @function playNext
 * @description It will call when #next is clicked.
 */
function playNext() {
	currentSong = ++currentSong % totalSongs;
}

/**
 * @function playPrevious
 * @description It will call when #previous is clicked, .
 */
function playPrevious() {
	if (currentSong == 0) currentSong = totalSongs - 1;
	else currentSong--;
}

/**
 * 
 * module: createElement
 * 
 * ? All album, song, artist, genre objects are created, and their functions are listed below.
 * 
 */


/**
 * 
 * @param {object} songInfo Information about song ex: title, artist, album, etc.
 * @returns {HTMLObjectElement}
 */
const createAlbum = (songInfo) => {
	let album = document.createElement('a');
	let albumImage = document.createElement('div');
	let playButton = document.createElement('div');
	let albumInfo = document.createElement('div');

	let albumTitle = document.createElement('label');
	let albumArtistName = document.createElement('a');

	if (songInfo.cover != undefined)
		albumImage.style.backgroundImage = url(songInfo.cover);
	albumImage.style.backgroundColor = hsl(songInfo.color);

	playButton.style.backgroundColor = hsl(songInfo.color);

	albumTitle.appendChild(document.createTextNode(songInfo.album.length >= 12 ? songInfo.album.substr(0, 11) + '...' : songInfo.album));

	if (songInfo.albumArtist == null)
		songInfo.albumArtist = songInfo.artist
	albumArtistName.appendChild(document.createTextNode(songInfo.albumArtist.length >= 25 ? songInfo.albumArtist.substr(0, 22) + '...' : songInfo.albumArtist));

	album.style.backgroundColor = hsl(songInfo.color);

	album.setAttribute('class', 'album');
	album.setAttribute('href', 'album listing.html');
	album.setAttribute('target', 'master-frame');

	album.dataset.path = '#';
	album.dataset.album = songInfo.album;
	album.dataset.album = songInfo.albumArtist;
	album.dataset.genre = songInfo.genre;
	album.dataset.year = songInfo.year;
	album.dataset.track = songInfo.track;

	albumImage.setAttribute('class', 'album-image');
	playButton.setAttribute('class', 'play-button');
	albumInfo.setAttribute('class', 'album-info');

	albumTitle.setAttribute('class', 'album-title');
	albumArtistName.setAttribute('class', 'album-artist-name');

	albumImage.appendChild(playButton);

	albumInfo.appendChild(albumTitle);
	albumInfo.appendChild(albumArtistName);

	album.appendChild(albumImage);
	album.appendChild(albumInfo);

	let invoke = true;

	playButton.addEventListener("click", () => {
		clicked.album = songInfo;
		albums = songs.filter(element => {
			if (clicked.album.album == element.album && clicked.album.albumArtist == element.albumArtist)
				return true;
			return false;
		});
		currentSongList = albums;
		totalSongs = currentSongList.length;
		currentSong = 0;
		audio.src = currentSongList[0]['path'];
		audio.play();
	});

	album.addEventListener('click', () => {
		if (invoke)
			clicked.album = songInfo;
	});

	return album;
}

const createArtist = (songInfo) => {
	let artist = document.createElement('a');
	let artistImage = document.createElement('div');
	let artistInfo = document.createElement('div');
	let artistName = document.createElement('label');
	let artistGenreName = document.createElement('label');

	artistImage.style.backgroundImage = url(songInfo.cover);

	artistName.appendChild(document.createTextNode(songInfo.artist.length > 8 ? songInfo.artist.substr(0, 8) + '...' : songInfo.artist));
	artistGenreName.appendChild(document.createTextNode(songInfo.genre.length > 15 ? songInfo.genre.substr(0, 15) + '..' : songInfo.genre));

	artist.setAttribute('class', 'artist');
	artist.dataset.artist = songInfo.artist;

	artistImage.setAttribute('class', 'artist-image');
	artistInfo.setAttribute('class', 'artist-info');
	artistName.setAttribute('class', 'artist-name');
	artistGenreName.setAttribute('class', 'artist-genre-name');
	artist.setAttribute('href', 'artist listing.html');

	artistInfo.appendChild(artistName);
	artistInfo.appendChild(artistGenreName);

	artist.appendChild(artistImage);
	artist.appendChild(artistInfo);

	artist.addEventListener('click', () => {
		clicked.artist = songInfo;
	})

	return artist;
}

const createSong = (songInfo, number, loadFrom) => {
	let anchor = true;
	let song = document.createElement('div');

	let songCover = document.createElement('div');
	let songTitle = document.createElement('div');
	let songArtist = document.createElement('a');
	let songAlbum = document.createElement('a');
	let songGenre = document.createElement('a');
	let songDuration = document.createElement('div');

	song.setAttribute('class', 'song');
	song.dataset.title = songInfo.title;
	song.dataset.artist = songInfo.artist;
	song.dataset.album = songInfo.album;
	song.dataset.genre = songInfo.genre;
	song.dataset.duration = songInfo.duration;
	song.dataset.path = songInfo.path;
	song.dataset.songNumber = number;

	songCover.setAttribute('class', 'song-cover');
	songTitle.setAttribute('class', 'song-title');
	songArtist.setAttribute('class', 'song-artist');
	songAlbum.setAttribute('class', 'song-album');
	songGenre.setAttribute('class', 'song-genre');
	songDuration.setAttribute('class', 'song-duration');

	songArtist.setAttribute('href', '#');

	songAlbum.setAttribute('href', 'album listing.html');
	songAlbum.setAttribute('target', 'master-frame');
	songAlbum.addEventListener('click', () => {
		clicked.album = songInfo;
		anchor = false;
	});

	[songAlbum, songArtist, songGenre].forEach((element) => {
		element.addEventListener('mousedown', () => {
			anchor = false;
		});
		element.addEventListener('mouseup', () => {
			anchor = true;
		});
	});

	songGenre.setAttribute('href', '#');

	const artist = songInfo.artist

	songCover.style.backgroundImage = url(songInfo.cover);
	songTitle.appendChild(document.createTextNode(songInfo.title));
	songArtist.appendChild(document.createTextNode(artist.substr(0, 37) + (artist.length >= 40 ? '...' : '')));
	songAlbum.appendChild(document.createTextNode(songInfo.album));
	songGenre.appendChild(document.createTextNode(songInfo.genre));
	songDuration.appendChild(document.createTextNode(absoluteTimeToRelative(songInfo.duration)));

	song.appendChild(songCover);
	song.appendChild(songTitle);
	song.appendChild(songArtist);
	song.appendChild(songAlbum);
	song.appendChild(songGenre);
	song.appendChild(songDuration);

	song.addEventListener('click', () => {
		if (anchor) {
			if (stack.song != null || stack.song != undefined) {
				stack.song.style.backgroundColor = 'transparent';
				stack.song.style.color = 'black';
			}
			currentSong = song.dataset.songNumber;
			audio.src = songInfo['path'];
			song.style.color = 'white';
			song.style.backgroundColor = hsl(songInfo.color);
			audio.play();
			stack.song = song;

			switch (loadFrom) {
				case 'songs':
					currentSongList = songs;
					break;
				case 'album-listing':
					currentSongList = albums;
					break;

				case 'artist-listing':
					currentSongList = artists;
					console.log(artists);
					break;

				default:
					break;
			}
			totalSongs = currentSongList.length;
		}
	});

	if (clicked.song && songInfo.title == clicked.song.title && songInfo.artist == clicked.song.artist && songInfo.album == clicked.song.album) {
		song.style.backgroundColor = hsl(songInfo.color);
		song.style.color = 'white';
		stack.song = song;
	}

	return song;
}


/**
 * 
 * ! Depricated, and will be removed later, and functions are listed below.
 * 
 * @function getSongInfo
 * @function averageColor
 * 
 */
let getSongInfo = (path) => {
	return new Promise((resolve, reject) => {
		fetch(path).then(res => res.blob()).then(blob => {
			jsmediatags.read(blob, {
				onSuccess: tag => {
					console.log(tag, 6);
					tag = tag.tags;

					let lyric = {};
					try {
						tag.lyrics.split('\n').forEach(element => {
							element = element.split(']');
							element[0] = element[0].substr(1);
							lyric[relativeToAbsolute(element[0].split(':')[0], element[0].split(':')[1]).toFixed(8)] = element[1];
						});
						if (isNaN(Object.keys(lyric)[0]))
							throw 'null';
					} catch (error) {
						lyric = null;
					}

					let cover = '';
					if (tag.picture != undefined && tag.picture != null) {
						Array.from(tag.picture.data).forEach(element => {
							cover += String.fromCharCode(element);
						});
						cover = `data:${tag.picture.format};base64,${btoa(cover)}`;
					} else
						cover = undefined;

					if (tag.artist == undefined)
						tag.artist = 'Unknown Artist'

					let albumArtist = undefined;
					if (tag.aART && tag.aART.data)
						albumArtist = tag.aART.data;
					else
						albumArtist = tag.artist;

					tag.track = parseInt(String(tag.track).split('/')[0]);

					if (tag.genre == undefined)
						tag.genre = 'Unknown Genre'
					if (tag.year == undefined)
						tag.year = '0000';
					if (tag.album == undefined)
						tag.album = 'Unknown Album';
					if (isNaN(tag.track))
						tag.track = '0';

					const tempAudio = new Audio(path);
					tempAudio.onloadedmetadata = () => {
						resolve({
							title: tag.title,
							artist: tag.artist,
							album: tag.album,
							albumArtist: albumArtist,
							genre: tag.genre,
							lyrics: lyric,
							path: path,
							year: tag.year,
							cover: cover,
							track: tag.track,
							duration: tempAudio.duration,
							color: { h: 88, s: 91, l: 37, a: 1 },
						});
					};
				}, onError: error => {
					reject(new Error(`Error with file ${path}`));
				},
			});
		});
	});
}

let averageColor = async (path) => {
	const songInfo = await getSongInfo(path);
	return await new Promise((resolve, reject) => {
		let image = document.getElementById('image');

		if (image == null) {
			image = document.createElement('img');
			image.setAttribute('id', 'image');
		}

		if (songInfo.cover == undefined) {
			songInfo.cover = 'sass/css/music record.svg';
			songInfo.color = { h: 88, s: 91, l: 37, a: 1 };
			resolve(songInfo);
			return;
		}
		image.src = songInfo.cover;

		let rgba = { r: 0, g: 0, b: 0 };

		image.onload = () => {
			let canvas = document.createElement('canvas');

			canvas.width = image.width;
			canvas.height = image.height;

			let ctx = canvas.getContext('2d');
			ctx.drawImage(image, 0, 0);

			let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

			let length = 0;
			for (let i = 0; i < imageData.length; i += 4) {
				length++;
				rgba.r += imageData[i];
				rgba.g += imageData[i + 1];
				rgba.b += imageData[i + 2];
			}

			rgba.r = parseInt(rgba.r / length);
			rgba.g = parseInt(rgba.g / length);
			rgba.b = parseInt(rgba.b / length);

			let hsla = rgb2hsl(rgba);

			if (hsla.s < 20 && hsla.l < 20)
				hsla.s = 25, hsla.l = 25;
			else if (hsla.l < 20)
				hsla.l = 20;
			else if (hsla.l > 60)
				hsla.l = 60;

			hsla.a = 1;
			songInfo.color = hsla;
			resolve(songInfo);
		};
	});
}


/**
 * 
 * ? All lyrics related function are listed below.
 * 
 * @function createLyric
 * @function colorLyrics
 * 
 */


const createLyric = (lyrics) => {
	const lyric = document.getElementById('lyrics');
	lyric.innerHTML = null;
	lyric.scrollTo(0, 0);

	if (lyrics == null || Object.keys(lyrics).length == 0) {
		lyric.style.visibility = 'hidden';
		return;
	}

	lyric.style.visibility = 'visible';

	let scrollTop = 0;
	for (let time in lyrics) {
		if (lyrics[time] == undefined || lyrics[time] == null) continue;

		let label = document.createElement('label');
		label.setAttribute('class', 'lyric')
		label.dataset.time = time;

		label.dataset.scrollTop = scrollTop;
		scrollTop += (lyrics[time].length > 60) ? 35 * Math.ceil(lyrics[time].length / 60) : 44;

		label.appendChild(document.createTextNode(lyrics[time]));
		label.addEventListener('click', () => audio.currentTime = time);
		lyric.appendChild(label);
	}

}; const colorLyrics = (labelArray, currentTime) => {
	if (labelArray.length == 0)
		return 0;

	let first = labelArray.shift();
	let boolean = colorLyrics(labelArray, currentTime);

	if (!boolean && first.dataset.time > currentTime) {
		first.style.padding = '10px'
		first.style.fontWeight = 'normal';
		first.style.fontSize = '1em'
		first.style.color = 'var(--disabled-lyric)';
		return 0;
	} else if (first.dataset.time <= currentTime && !boolean) {
		first.style.fontWeight = 'bold';
		first.style.color = 'white';
		first.style.padding = '20px 0px 20px 3px';
		first.style.fontSize = '2em'
		return boolean + 1;
	}

	first.style.padding = '10px'
	first.style.fontWeight = 'normal';
	first.style.color = 'white';
	first.style.fontSize = '1em'
	return boolean + 1;
};


/**
 * 
 * ! All the functions are related to database manipulation and will be removed afterwards with database queries.
 * 
 */
const searchAlbum = (array) => {
	const album = new Array();
	return Array.from(array).filter(element => {
		let boolean = true;
		for (const songInfo of album) {
			if (element.album == songInfo.album && element.albumArtist == songInfo.albumArtist) {
				boolean = false;
				break;
			}
		}

		if (boolean) {
			album.push({ album: element.album, albumArtist: element.albumArtist });
		}

		return boolean;
	});
}

const searchArtist = (array) => {
	const artist = new Array();
	return Array.from(array).filter(element => {
		let boolean = true;
		for (const iterator of artist) {
			for (const eleart of element.artist) {
				if (iterator == eleart.artist) {
					boolean = false;
					break;
				}
			}
			if (!boolean)
				break;
		}
		if (boolean) {
			artist.push(element.artist)
		}
		return boolean;
	});
}


/**
 * 
 * ? Specific page related functions.
 * 
 */


/**
 * 
 * @function colorSong
 * @description it will color the current songElement(@file 'song.html').
 * 
 * 
 */
const colorSong = (songInfo) => {

	if (songInfo == null)
		console.error(new Error('songInfo is never be null'));

	if (identifyPage == 'musicly-song' || identifyPage == 'musicly-album-listing') {
		const query = `[data-title='${songInfo.title}'][data-artist='${songInfo.artist}'][data-album='${songInfo.album}']`;
		const currentSong = documentCurrent.querySelector(query);
		currentSong.style.backgroundColor = hsl(songInfo.color);
		currentSong.style.color = 'white';
		stack.song = currentSong;
	}

}

const paleSong = (songInfo) => {

	if (songInfo == null)
		console.error(new Error('songInfo never be null'));

	if (identifyPage == 'musicly-song' || identifyPage == 'musicly-album-listing') {
		const query = `[data-title='${songInfo.title}'][data-artist='${songInfo.artist}'][data-album='${songInfo.album}']`;
		const currentSong = documentCurrent.querySelector(query);
		currentSong.style.backgroundColor = 'transparent';
		currentSong.style.color = 'black';
	}
}


/**
 * * a `var`
 * 
 * *Note*
 * 
 * **Note**
 * 
 * ***Note***
 * 
 * {@link justDemo qwesdf fsd}
 * {@linkcode justDemo sdf sd}
 * #### `asdf`
 * ``a``
 * 
 * ***Demo code***
 * ```c++
 * int asdaf = NULL;
 * int main() {
 * 		cout << "Hello World" << endl;
 * 		return 0;
 * }
 * ```
 * 
 */
const justDemo = (param) => {
}