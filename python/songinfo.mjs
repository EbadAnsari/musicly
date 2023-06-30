import { Schema, model } from 'mongoose';

const songData = new Schema({
	album: { type: String },
	artist: { type: String },
	track: { type: String },
	title: { type: String },
	genre: { type: String },
	year: { type: String },
	albumArtist: { type: String },
	cover: { type: String }
})


const Songs = new model("song-info", songData)

export default Songs;