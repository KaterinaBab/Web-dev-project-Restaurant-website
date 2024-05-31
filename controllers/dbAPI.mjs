import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db_name = path.join(__dirname, "../model", "italiansDb.db");

const newUser = (book, callback) => {
    console.log('to insert...', book)
    const sql = `INSERT INTO users (username, passwordHash, isAdmin, email, salt) 
        VALUES (?, ?, ?, ?, ?)`;
    const db = new sqlite3.Database(db_name);
    db.run(sql, [book.username, book.passwordHash, 0, book.email, book.salt], (err, result) => {
        db.close();
        if (err) {
            callback(err, null)}
        else callback(null, result)
    });
}
