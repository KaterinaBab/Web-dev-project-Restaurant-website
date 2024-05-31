'use strict';

// Το better-slite3 είναι εντελώς σύγχρονο
import db from 'better-sqlite3'
      
import bcrypt from 'bcrypt'
const sql = new db('model/db/italiansDb.sqlite', { fileMustExist: true });

const comparePasswordAsync = async (password, hash) => {
    return bcrypt.compare(password, hash);
  };

export let addUser = (user) => {
    
    const stmt = sql.prepare(`INSERT INTO users (username, passwordHash, isAdmin, email, phone) 
    
    VALUES (?, ?, 0, ?, ?)`);
    let info;

    try {
        info = stmt.run(user.username, user.password, user.email, user.phone);
        return true;
    }
    catch (err) {
        throw err;
    }
};

export let deleteReservation = (r_id) => {
  const stmt = sql.prepare('DELETE FROM reservation WHERE id = ?');

  let info;
  try {
    info = stmt.run(r_id);
    return info;
      
  }
  catch (err) {
    throw err;
  }
};
export let allReservations = (date) => {
  //const stmt = sql.prepare('SELECT u.username, r.guests, TIME(r.reservation_datetime) AS reservation_starttime, r.id FROM reservation AS r JOIN users AS u ON r.user_id=u.ID WHERE DATE(reservation_datetime) = ? ORDER BY r.reservation_datetime ASC');

  const stmt = sql.prepare(`
    SELECT 
      r.id, 
      CASE 
        WHEN u.isAdmin = 1 THEN r.guest_name 
        ELSE u.username 
      END AS username,
      r.guests, 
      TIME(r.reservation_datetime) AS reservation_starttime
    FROM reservation AS r
    JOIN users AS u ON r.user_id = u.ID
    WHERE DATE(r.reservation_datetime) = ?
    ORDER BY r.reservation_datetime ASC
  `);

  let info;
  try {
    info = stmt.all(date);
    console.log(info);
    return info;
      
  }
  catch (err) {
      throw err;
  }
};

export let allUsernames = () => {

  const stmt = sql.prepare('SELECT username FROM users');

  let info;
  try {
    info = stmt.all();
    return info;
      
  }
  catch (err) {
      throw err;
  }

};

export let userIsNotUnique = (user) => {
    //Αυτό το ερώτημα εισάγει μια νέα εγγραφή
    //Η πρώτη και η τελευταία τιμή (το null και το CURRENT_TIMESTAMP) εισάγονται από την SQLite
    //Το null αφήνει την SQLite να διαλέξει τιμή (αύξοντας αριθμός)
    //To CURRENT_TIMESTAMP σημαίνει την τρέχουσα ώρα και ημερομηνία
    const stmt = sql.prepare('SELECT COUNT(*) AS count FROM users WHERE username = ? OR email = ?');
    
    
    try {
        const exists = stmt.get(user.username, user.email).count > 0;
        if (exists) {
            return true; // User already exists
        }
        return false;
    }
    catch (err) {
        throw err;
    }
};

export let findUserId = (username) => {
  const stmt = sql.prepare('SELECT ID FROM users WHERE username = ?');

  let info;
  try {
    info = stmt.get(username).ID;
    return info;
      
  }
  catch (err) {
      throw err;
  }

};

export let checkAvailability = (reservationStart, reservationEnd ,guests) =>{
  console.log(reservationEnd, reservationStart, guests);
  // Check for available tables
    const checkAvailableTablesQuery = sql.prepare(`SELECT 
     t.table_id , t.capacity, t.available, COALESCE(COUNT(res.id), 0) AS reservations_count
      FROM "table" as t
      LEFT JOIN reservation res ON t.table_id = res.table_id AND NOT(
        res.end_datetime <= ?  OR
        res.reservation_datetime >= ?
      )
      WHERE
        t.capacity >= ?
      GROUP BY
        t.table_id, t.capacity, t.available
      HAVING
        t.available > reservations_count
      ORDER BY 
        t.capacity`);
  

      let info;
      try{
            info = checkAvailableTablesQuery.all(reservationStart, reservationEnd, guests);
            return info;
      }
      catch (err){
        
        throw err;
      }
    };

export let nextAvailableTime = (guests) =>{

  // No available of the exact requested capacity, find the next available time for a table of that capacity
    const nextAvailableTimeQuery = sql.prepare(
      `SELECT r.table_id, MIN(r.end_datetime) AS next_available_time
      FROM reservation r
      JOIN "table" t ON r.table_id = t.table_id
      WHERE t.capacity = ? AND r.end_datetime > datetime('now')
      AND NOT EXISTS (
          SELECT 1 FROM reservation r2
          WHERE r2.table_id = r.table_id
          AND r2.reservation_datetime < r.end_datetime
          AND r2.end_datetime > r.end_datetime
      )
      GROUP BY r.table_id
      ORDER BY next_available_time ASC
      LIMIT 1
    `);

    let info;
      try{
            info = nextAvailableTimeQuery.all(guests);
            return info;
      }
      catch (err){
        throw err;
        //return res.status(500).json({ error: 'Database error', details: err });
      }
};

export let doReservation =(userId, tableId, guests, reservation_datetime, reservationEnd, guestName = null) =>{
  const insertReservationQuery = sql.prepare(`
  INSERT INTO reservation (user_id, table_id, guests, reservation_datetime, end_datetime, guest_name)
  VALUES (?, ?, ?, ?, ?, ?)
  `);
  console.log(userId, tableId, guests, reservation_datetime, reservationEnd, guestName);

  let info;
      try{
            info = insertReservationQuery.run(userId, tableId, guests, reservation_datetime, reservationEnd, guestName);
            console.log(info, 'from db');
            return info;
      }
      catch (err){
        throw err;
        /*if (err) {
              return res.status(500).json({ error: 'Database error', details: err });
            }*/
      }

};
/*
export let credentialsCorrect = (username, hashedPassword) => {

    const stmt = sql.prepare('SELECT COUNT(*) AS count FROM users WHERE username = ? AND passwordHash = ?');

    try {
        const exists = stmt.get(username, hashedPassword).count > 0;
        if (exists) {
            return true; // Credentials match
        }
        return false; // Credentials don't match
    }
    catch (err) {
        throw err;
    }
} */

export const credentialsCorrect = async (username, password) => {
    try {
      // Prepare the SQL statement
      const stmt = sql.prepare('SELECT passwordHash AS psw FROM users WHERE username = ?');
      console.log(typeof username);
      // Execute the prepared statement asynchronously with the provided username
      /*
      const row = await new Promise((resolve, reject) => {
        console.log('inside promise');
        console.log(typeof username);
        row = stmt.get(username, (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });*/
      const row = stmt.get(username);
      if (!row) {
        return false; // User not found
      }
  
      // Compare the retrieved hashed password with the provided password asynchronously
      const isPasswordValid = await comparePasswordAsync(password, row.psw);
  
      return isPasswordValid; // Credentials match if true
    } catch (err) {
      throw err;
    }
  };

  export const userIsAdmin = (username) => {
    //Αυτό το ερώτημα εισάγει μια νέα εγγραφή
    //Η πρώτη και η τελευταία τιμή (το null και το CURRENT_TIMESTAMP) εισάγονται από την SQLite
    //Το null αφήνει την SQLite να διαλέξει τιμή (αύξοντας αριθμός)
    //To CURRENT_TIMESTAMP σημαίνει την τρέχουσα ώρα και ημερομηνία
    const stmt = sql.prepare('SELECT COUNT(*) AS count FROM users WHERE username = ? AND isAdmin = ?');
    
    
    try {
        const exists = stmt.get(username, 1).count > 0;
        if (exists) {
            return true; // User is Admin
        }
        return false; // User is not Admin
    }
    catch (err) {
        throw err;
    }
};

export let getMenu = () => {
  //Αυτό το ερώτημα εισάγει μια νέα εγγραφή
  //Η πρώτη και η τελευταία τιμή (το null και το CURRENT_TIMESTAMP) εισάγονται από την SQLite
  //Το null αφήνει την SQLite να διαλέξει τιμή (αύξοντας αριθμός)
  //To CURRENT_TIMESTAMP σημαίνει την τρέχουσα ώρα και ημερομηνία
  const stmt = sql.prepare("SELECT * FROM Plates ORDER BY title;");
  
      let plates;
  try {
      plates = stmt.all();
      return plates;
  }
  catch (err) {
      throw err;
  }
};

export let addPlate = (plate) => {
    
  const stmt = sql.prepare(`INSERT INTO Plates (title, type, price, extras, typeEng) 
  
  VALUES (?, ?, ?, ?, 'No')`);
  let info;

  try {
      info = stmt.run(plate.title, plate.type, plate.price, plate.extras);
      return true;
  }
  catch (err) {
      throw err;
  }
};



export let removePlatebyID = (id) => {
    
  const stmt = sql.prepare(`DELETE FROM plates WHERE id = ?;`);
  let info;

  try {
      info = stmt.run(id);
      return true;
  }
  catch (err) {
      throw err;
  }
};

export let updatePlatebyID = (id, plate) => {
    
  const stmt = sql.prepare(`UPDATE Plates
  SET title = ?, price = ?, extras = ?
  WHERE id = ?;`);
  
  let info;

  try {
      info = stmt.run(plate.title, plate.price, plate.extras, id);
      return true;
  }
  catch (err) {
      throw err;
  }
};