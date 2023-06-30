
console.clear();

import { appendFile, existsSync, readFileSync, writeFileSync, statSync, mkdirSync } from 'fs';
import { createServer } from 'http';

const logFile = "./logs/fnf.log"

if (!existsSync("./logs"))
	mkdirSync("./../logs");
writeFileSync(logFile, "");

const indexHTML = "./html/main.html";

const hostname = '127.0.0.1';
const localhost = 'localhost'
const port = 8000;

const extensionAndType = {
	js: { messageBody: { 'Content-Type': 'application/js' }, },
	svg: { messageBody: { 'Content-Type': `image/svg+xml` } },
	html: { messageBody: { 'Content-Type': `text/html` } },
	hbs: { messageBody: { 'Content-Type': `text/html` } },
	css: { messageBody: { 'Content-Type': `text/css` } },
	png: { messageBody: { 'Content-Type': `image/png` } },
	jpg: { messageBody: { 'Content-Type': `image/jpg` } },
	jpeg: { messageBody: { 'Content-Type': `image/jpeg` } },
	// mp3: {
	// 	messageBody: {
	// 		'Content-Type': `audio/mpeg`,
	// 		'Content-Length': status.size,
	// 		'Content-Range': `bytes=0-${status.size}/${status.size}`,
	// 		'Accept-Ranges': 'bytes',
	// 	}
	// },
	json: { messageBody: { 'Content-Type': `application/json` } }
}

function serveFiles(request, response) {
	if (request.url == "/undefined")
		return;

	const file = `.${decodeURIComponent(request.url)}`;

	if (!existsSync(file)) {
		appendFile(logFile, `fnf ${file}\n`, (error) => { });
		response.writeHead(404);
		response.end(null);
		return;
	}

	// const dots = file.split(".");
	// const folders = file.split("/");
	const extension = file.split(".").at(-1);
	const basename = file.split("/").at(-1);

	let messageBody = null;

	if (extension == 'js') {
		messageBody = { 'Content-Type': 'application/js' };
	} else if (extension == 'svg') {
		messageBody = { 'Content-Type': `image/${extension}+xml` };
	} else if (extension == 'html' || extension == 'hbs') {
		messageBody = { 'Content-Type': `text/html` };
	} else if (extension == 'css') {
		messageBody = { 'Content-Type': `text/${extension}` };
	} else if (extension == 'png' || extension == 'jpg' || extension == 'jpeg') {
		messageBody = { 'Content-Type': `image/${extension}` };
	} else if (extension == 'm4a' || extension == 'mp3') {
		const status = statSync(file);
		messageBody = {
			'Content-Type': `audio/mpeg`,
			'Content-Length': status.size,
			'Content-Range': `bytes=0-${status.size}/${status.size}`,
			'Accept-Ranges': 'bytes',
		};
	} else if (extension == 'json') {
		messageBody = { 'Content-Type': `application/${extension}` };
	} else {
		appendFile(logFile, `fnf ${file}\n`, (error) => { });
		response.writeHead(404);
		response.end(null);
		return;
	}

	response.writeHead(200, messageBody);
	response.end(readFileSync(file));
}

createServer((request, response) => {
	if (request.url == '/') {
		response.writeHead(200, { 'Content-Type': "text/html" });
		response.end(readFileSync(indexHTML));
	} else {
		serveFiles(request, response);
	}
}).listen(port, hostname, () => {
	console.log(`Server running at http://${localhost}:${port}/`);
	console.log();
});