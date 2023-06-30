import { connect, model, Schema, set } from "mongoose";


const HOST = '127.0.0.1';
const PORT = 27017;
const database = 'musicly';

const url = `mongodb://${HOST}:${PORT}/${database}`;

set('strictQuery', true);



const songInfoSchema = new Schema({
	_id: Schema.Types.ObjectId,
	title: { type: String },
	album: { type: String },
	artist: { type: String },
	albumArtist: { type: String },
	year: { type: Number },
	duration: { type: Number },
	genre: { type: String },
	lyrics: { type: Object },
	color: { type: Object },
	path: { type: String },
	cover: { type: String },
});

export const songInfo = model('song-info', songInfoSchema);



connect(url).then(data => {
	console.log("Database Connected!");
});