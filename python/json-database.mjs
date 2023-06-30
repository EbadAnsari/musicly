import { readFileSync } from "fs";
import { connect, set } from "mongoose";

const HOST = "127.0.0.1";
const PORT = 27017;
const database = "musicly";

const url = `mongodb://${HOST}:${PORT}/${database}`;

set("strictQuery", true);

connect(url).then((data) => {
    console.log("Database Connected!");
});
