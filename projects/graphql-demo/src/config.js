import fs from "node:fs";
import sqlite from "sqlite3";

const file = fs.readFileSync("./database/main.db");

export const DB = new sqlite.verbose().Database(file);

export const PORT = 3000;
