// Αρχείο app.mjs
import express from 'express';
import { engine } from 'express-handlebars';
import session from "express-session";
//import * as control from './controllers/dbAPI.mjs';
import bcrypt from 'bcrypt'
const control = await import(`./controllers/dbAPI.mjs`);
const model = await import(`./model/DatabaseApi.mjs`);
import bodyParser from 'body-parser';
//const bodyParser = require('body-parser')
import expSession from 'express-session'

import MemoryStore from 'memorystore';

const MemoryStoreInstance = MemoryStore(session);
//const MemoryStore = require('memorystore')(session)

const app = express()
const sessionConf = {
    secret: 'process.env.secret',
    cookie: {maxAge: 1000*60*30, sameSite: true},
    resave: false,
    saveUninitialized: false,
    store: new MemoryStoreInstance({
        checkPeriod: 86400000 // prune expired entries every 24h (in milliseconds)
      })
    };

app.use(expSession(sessionConf));

// Δηλώνουμε πως θα χρησιμοποιήσουμε το handlebars
// και αλλάζουμε την προκαθορισμένη επέκταση σε .hbs.
app.engine('.hbs', engine({ extname: '.hbs',defaultLayout: 'main'}));
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

app.set('view engine', '.hbs');
//app.set('views', 'views');

let returnTo = "/";
let db = await import('./controllers/dbAPI.mjs');

// Εκκίνηση του εξυπηρετητή
const PORT = /*process.env.PORT ||*/ 8000
app.listen(PORT, () => {
    console.log(`Συνδεθείτε στη σελίδα: http://localhost:${PORT}`);
});


//Αρχική σελίδα
app.get("/", (req, result) => {
    // Aν ο χρήστης είναι συνδεδεμένος, εμφάνισε το layout user και το loggedIn θα είναι true (defined) (IGNORE name: 'asd')
    if (req.session.loggedIn){
        result.render('partials/guestScreen',
        {
        css: ['gallery.css'], 
        script: ['gallery.js'],
        name: req.session.username, 
        isActiveHome:'active',
        loggedIn: req.session.loggedIn,
        layout:'main',
        admi: req.session.admin});}
    // Aν ο χρήστης δεν είναι συνδεδεμένος κάνε render το απλό layout (IGNORE name: 'asd')
    else{
        result.render('partials/guestScreen', {css: ['gallery.css'], 
        script: ['gallery.js'],name: 'asd', isActiveHome:'active'});}
});

/*app.get("/menu", (req, result) => {

    result.render('partials/menu',  {isActiveMenu:'active'});
    }
);*/


/*for user*/ 
app.get("/reservations", (req, res) => {
    
    if (req.session.admin){
        res.redirect('/manage_reservations');
    }
    else{
        res.render('partials/reservations',  { css: ['reservations.css'] ,  script: ['reservs.js'],name: req.session.username,  loggedIn: req.session.loggedIn, layout:'main'});
        }
    }
);

// POST endpoint for reservation
app.post('/reservation', (req, res) => {
    const { guests, reservation_date, time} = req.body; 
    console.log(reservation_date, time);
    const reservationStart = reservation_date+' '+time+':00';

    const hour = parseInt(time.slice(0, 2), 10); 
    const endHour = String((hour + 2)%24).padStart(2, '0');
    const endTime = `${endHour}:${time.slice(3)}`;
    const reservationEnd = reservation_date+' '+endTime+':00';
    //const reservationStart = new Date(reservation_date);
    //const reservationEnd = new Date(reservationStart.getTime() + 2 * 60 * 60 * 1000); // Reservation duration is 2 hours
    console.log('SERVER',reservationEnd, reservationStart, guests);
   
    let availableTables= model.checkAvailability(reservationStart, reservationEnd, guests);
    console.log(availableTables);
    // Check if any tables of the exact capacity have actual availability
    let isAnyTableAvailable = availableTables.some(table => 
      table.capacity === parseInt(guests, 10) && table.available > table.reservations_count);

    if(!req.session.loggedIn){
        res.render('partials/reservations',  { css: ['reservations.css'] ,  script: ['reservs.js'],name: req.session.username,  loggedIn: req.session.loggedIn, layout:'main', 
              failedToReserv:'Please log in first'});
    }
    else{

        if (!isAnyTableAvailable){
            let nextAvailableResults = model.nextAvailableTime(guests);
    
                if (nextAvailableResults.length === 0) {
                //return res.status(404).json({ error: 'No upcoming availability for tables of this capacity' });
                res.render('partials/reservations',  { css: ['reservations.css'] ,  script: ['reservs.js'],name: req.session.username,  loggedIn: req.session.loggedIn, layout:'main', 
                failedToReserv:'No upcoming availability for tables of this capacity'});

                } else {
                const nextAvailableTime = new Date(nextAvailableResults[0].next_available_time);
                // Format date and time
                const formattedDate = nextAvailableTime.toLocaleDateString('en-GB', {
                    weekday: 'long', // long format for the day
                    year: 'numeric',
                    month: 'long', // long format for the month
                    day: 'numeric'
                });
    
                const formattedTime = nextAvailableTime.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false // use 24-hour format
                });
    
                // Construct the full string
                const dateTimeString = formattedDate + ' ' + formattedTime;
    
                res.render('partials/reservations',  { css: ['reservations.css'] ,  script: ['reservs.js'],name: req.session.username,  loggedIn: req.session.loggedIn, layout:'main', 
                failedToReserv:'No tables available until ' + dateTimeString });
                //return res.status(409).json({ error: 'No tables available until ' + dateTimeString });
                }
            
            } else {
            // Tables available, proceed with the reservation
            const tableId = availableTables.find(table => table.available > table.reservations_count).table_id;
            console.log(tableId);
            model.doReservation(req.session.user_id, tableId, guests, reservationStart, reservationEnd);
        }
    }
    
    
});


app.get("/menu2", (req, result) => {
    let plates = model.getMenu();
    
    const platesByType = {
        'Assagi': [],
        'Picollo Assagi': [],
        'Taglieri di formaggi': [],
        'Bruschetta': [],
        'Bianchi': [],
        'Rossi': []
    };
    plates.forEach(plate => {
        platesByType[plate.type].push(plate);
    });
    console.log("Is admin: ");
    console.log(req.session.admin);
    console.log("Is logged in: ");
    console.log(req.session.loggedIn);
    result.render('partials/menu2',
        {
        isActiveMenu:'active',
        admi: req.session.admin,
        food_type: platesByType,
        name: req.session.username,
        loggedIn: req.session.loggedIn,
        css: ['menu2.css'],
        script: ['menu2.js']
        }
    );
});

app.get("/signin_form", (req, result) => {

    result.render('partials/sign_in_form', {isActiveSignin:'active', css:['sign-in.css']});
    }
);

app.get("/manage_reservations", (req, res) => {
    if (!req.session.admin){
        res.redirect('/');
    }
    else{
        const usernames = model.allUsernames();
        let date = req.query.for_date;
        /*const reservations = model.allReservations(date);*/
        
        if (!date){
            // Get the current date in the format 'YYYY-MM-DD'
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed in JavaScript
            const dd = String(today.getDate()).padStart(2, '0');
            date = `${yyyy}-${mm}-${dd}`;
            
        }
        const reservations = model.allReservations(date);
        console.log(reservations);
        
        res.render('partials/admin_reservations', 
        {   username: usernames,
            reservation: reservations,
            css: ['admin_reservation.css', 'reservations.css'], 
            script: ['admin_reservs.js'],
            admi: req.session.admin,
        
            name: req.session.username,
            loggedIn: req.session.loggedIn,
        });

    }
});

app.post('/reservation/delete/:reservationId', (req, res) => {
    if (!req.session.admin) {
      setTimeout(() => {
        res.redirect('/');
      }, 500);

    } else {
      try {
        model.deleteReservation(req.params.reservationId);
        res.redirect('/manage_reservations'); // Redirect after successful deletion
      } catch (err) {
        console.error('Error deleting reservation:', err);
        res.status(500).send('Failed to delete reservation');
      }
    }
  });

app.post("/admin_reserv",  (req, res) =>{
    if (!req.session.admin){
        res.redirect('/');
    }
    else{
    const {for_date} = req.body;
    const reservations = model.allReservations(for_date);
    const { customer, guest_name, guests, reservation_date, time } = req.body;
    const reservationStart = reservation_date+' '+time+':00'; //2025-04-09 20:00:00

    const hour = parseInt(time.slice(0, 2), 10);
    const endHour = String((hour + 2)%24).padStart(2, '0');
    const endTime = `${endHour}:${time.slice(3)}`;
    const reservationEnd = reservation_date+' '+endTime+':00';
    //const reservationStart = new Date(reservation_date);
    //const reservationEnd = new Date(reservationStart.getTime() + 2 * 60 * 60 * 1000); // Reservation duration is 2 hours
    //console.log('SERVER',reservationEnd, reservationStart, guests);
   
    let availableTables= model.checkAvailability(reservationStart, reservationEnd, guests);
    //console.log(availableTables);
    // Check if any tables of the exact capacity have actual availability
    let isAnyTableAvailable = availableTables.some(table => 
      table.capacity === parseInt(guests, 10) && table.available > table.reservations_count);
    
    if (!isAnyTableAvailable){
        let nextAvailableResults = model.nextAvailableTime(guests);
  
            if (nextAvailableResults.length === 0) {
              //return res.status(404).json({ error: 'No upcoming availability for tables of this capacity' });
              res.render('partials/manage_reservations',  { css: ['reservations.css'] ,  script: ['reservs.js'],name: req.session.username,  loggedIn: req.session.loggedIn, layout:'main', 
                failedToReserv:'No upcoming availability for tables of this capacity'});
            } else {
              const nextAvailableTime = new Date(nextAvailableResults[0].next_available_time);
              // Format date and time
              const formattedDate = nextAvailableTime.toLocaleDateString('en-GB', {
                weekday: 'long', // long format for the day
                year: 'numeric',
                month: 'long', // long format for the month
                day: 'numeric'
              });
  
              const formattedTime = nextAvailableTime.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false // use 24-hour format
              });
  
              // Construct the full string
              const dateTimeString = formattedDate + ' ' + formattedTime;
  
              res.render('partials/manage_reservations',  { css: ['reservations.css'] ,  script: ['reservs.js'],name: req.session.username,  loggedIn: req.session.loggedIn, layout:'main', 
                failedToReserv:'No tables available until ' + dateTimeString });
              //return res.status(409).json({ error: 'No tables available until ' + dateTimeString });
            }
          
        } else {
          // Tables available, proceed with the reservation
          const tableId = availableTables.find(table => table.available > table.reservations_count).table_id;
          //console.log(tableId);
          if(customer) {
            const customer_id = model.findUserId(customer);
            model.doReservation(customer_id, tableId, guests, reservationStart, reservationEnd);
            }
          else if(guest_name){
            model.doReservation(req.session.user_id, tableId, guests, reservationStart, reservationEnd, guest_name);
          }
    //res.render('partials/guestScreen', {css: ['gallery.css'], 
    //script: ['gallery.js'], isActiveSignin:'active'});
    }
    }
});

app.post("/add/plate", (req, res) =>{
    if (!req.session.admin){
        res.redirect('/');
    }
    else{
        const { title, extras ,price, type} = req.body;
        const plate = new Object();
        plate.title = title;
        plate.extras = extras;
        plate.price = price;
        plate.type = type;
        console.log(plate);
        try {
            model.addPlate(plate);
            res.redirect('/menu2')
            //model.removeTask(req.params.removeTaskId, userId)
            //const allTasks = await model.getAllTasks(userId)
            //res.render('tasks', { tasks: allTasks, model: process.env.MODEL });
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
 });

app.post("/sign_in", async (req, res) => {
    try {
        const { username, password} = req.body;
        const user = new Object();
        user.username = username;
        user.password = password;
        //console.log(username);
        //console.log(password);
        const credentialsCorrect = await model.credentialsCorrect(username, password);
        if (!model.userIsNotUnique(user)){
            res.render('partials/sign_in_form', {isActiveSignin:'active',
            failedAuth:"The username or password you provided is incorrect!", 
            css:['sign-in.css']});
        }
        else if (credentialsCorrect){
            req.session.username = username;
            req.session.user_id = model.findUserId(username);   //usernames are unique
            req.session.loggedIn = true;
            req.session.admin = model.userIsAdmin(username);
            //console.log(req.session.admin);
            res.redirect('/');
        }
        else{
            res.render('partials/sign_in_form', {isActiveSignin:'active',
            failedAuth:"The username or password you provided is incorrect!", 
            css:['sign-in.css']});
        }
            

    }catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
}
   
    
});

app.post("/create_acc", async (req, result) => {
    try {

        const { username, password, email, password2, phone } = req.body;
        //const bod = JSON.parse(req.body);
        //const username =  bod.username;
        //const email = bod.email;
        //const password = bod.password;
        //console.log(email)
        //console.log(password)
        //console.log(username)
        if (password !== password2) {
            result.render('partials/log_in_form', {isActiveSignin:'active',
                    failedTest:"Passwords do not match!", 
                    css:['log-in.css']});
        }
        else{
            // Generate salt
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            //console.log(salt)
            // Hash the password using the generated salt
            const hashedPassword = await bcrypt.hash(password, salt);
            //console.log(hashedPassword)

            const user = new Object();
            user.username = username
            user.email = email
            user.password = hashedPassword
            user.phone = phone

            // Store the user data (including hashed password and salt)
            console.log(user)
            if (model.userIsNotUnique(user)){
                console.log(model.userIsNotUnique(user));
                result.render('partials/log_in_form', {isActiveSignin:'active',
                        failedTest:"This username or email is already in use!", 
                        css:['log-in.css']});
                

            }
            else{
                const success = model.addUser(user);
                if (success) {
                    console.log('Sign-in Successful!')
                    // To session πλέον μεταφέρει attribute username με τιμή το username του νέου χρήστη
                    req.session.username = username;
                    req.session.loggedIn = true;
                    req.session.admin = false;
                    

                    // Redirect στο main menu
                    result.redirect('/');
                }
                else {
                    result.status(500).json({ error: 'Failed to register user' });
                }
            }
        }
        
    } catch (error) {
        console.error('Error registering user:', error);
        result.status(500).json({ error: 'Internal server error' });
    }
});

app.get("/log_in_form", (req, result) => {

    result.render('partials/log_in_form', {isActiveSignin:'active', css:['log-in.css']});
    }
);


app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.redirect('/');
        }
        console.log('Session destroyed');

        // Set a timeout to allow the animation to finish before redirecting
        setTimeout(() => {
            res.clearCookie('connect.sid'); // Clear the session cookie
            res.redirect('/');
        }, 500); // Adjust timing as needed
    });
});


app.get('/plate/remove/:removePlateId', (req, res) => {
    if (!req.session.admin){
        setTimeout(() => {
            res.redirect('/');
        }, 500);
    
    }
    else{
        try {
            model.removePlatebyID(req.params.removePlateId)
            res.redirect('/menu2');
            //model.removeTask(req.params.removeTaskId, userId)
            //const allTasks = await model.getAllTasks(userId)
            //res.render('tasks', { tasks: allTasks, model: process.env.MODEL });
        } catch (err) {
            res.send(err);
        }
    }
 });

 app.post('/plate/update/:updatePlateId', (req, res) => {
    if (!req.session.admin){
        setTimeout(() => {
            res.redirect('/');
        }, 500);
    
    }
    else{
        try {
            const { title, extras, price} = req.body;
            const plate = new Object();
                plate.title = title;
                plate.extras = extras;
                plate.price = price;
                console.log(plate);
            model.updatePlatebyID(req.params.updatePlateId, plate);
            res.redirect('/menu2');
            //model.removeTask(req.params.removeTaskId, userId)
            //const allTasks = await model.getAllTasks(userId)
            //res.render('tasks', { tasks: allTasks, model: process.env.MODEL });
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    }
 });


