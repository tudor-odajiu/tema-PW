const express = require('express');
const session = require('express-session')
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser())
const port = 6789;
//const myDb = require('./modules/database.js');
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 10000
    }

}));


// directorul 'views' va conține fișierele .ejs (html + js executat la server)
app.set('view engine', 'ejs');
// suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului este views/layout.ejs
app.use(expressLayouts);
// directorul 'public' va conține toate resursele accesibile direct de către client (e.g., fișiere css, javascript, imagini)
app.use(express.static("public"));
// corpul mesajului poate fi interpretat ca json; datele de la formular se găsesc în format json în req.body
app.use(bodyParser.json());
// utilizarea unui algoritm de deep parsing care suportă obiecte în obiecte
app.use(bodyParser.urlencoded({ extended: true }));

// la accesarea din browser adresei http://localhost:6789/ se va returna textul 'Hello World'
// proprietățile obiectului Request - req - https://expressjs.com/en/api.html#req
// proprietățile obiectului Response - res - https://expressjs.com/en/api.html#res
//app.get('/', (req, res) => res.send('Hello World'));

const fs = require('fs');
//let rawdata = fs.readFileSync('intrebari.json');
//let listaIntrebari = JSON.parse(rawdata);
let rawdata2 = fs.readFileSync('utilizatori.json');
let listaUtilizatori = JSON.parse(rawdata2);
const movies_data = {};








app.get('/', async(req, res) => {

    let nume = null;
    let rol = null;
    if (req.session.util) {
        nume = req.session.util.prenume;
        rol = req.session.util
    }
    res.render('index', { util: nume });
});



app.get('/admin', (req, res) => {

    if (typeof req.session.util != "undefined" && req.session.util.rol === "admin") {
        res.render('admin');
    } else {
        let error = new Error('Nu esti admin');
        console.log(error.message);
        res.redirect("/")
    }

});
app.get('/Filme_noi', (req, res) => {
    res.render('Filme_noi');
});

app.get('/autentificare', (req, res) => {

    let mesajEroare = false;
    if (typeof req.cookies.messageError != "undefined" && req.cookies.messageError == "true") {
        mesajEroare = true;
        res.clearCookie("messageError");
    }

    res.render('autentificare', { utilizatori: listaUtilizatori, mesajEroare: mesajEroare });
});

app.get('/logout', (req, res) => {
    console.log("Log out");
    if (typeof req.session.util != "undefined") {
        req.session.util = undefined;
    }
    res.redirect('/');

});

app.post('/verificare-autentificare', (req, res) => {
    let util = req.body;
    console.log(req.body);
    let rezultat;
    let username = util.utilizator;
    let password = util.parola;
    for (let src in listaUtilizatori) {
        if (username == listaUtilizatori[src].utilizator && password == listaUtilizatori[src].parola) {
            req.session.util = {};
            req.session.util.utilizator = listaUtilizatori[src].utilizator;
            req.session.util.nume = listaUtilizatori[src].nume;
            req.session.util.prenume = listaUtilizatori[src].prenume;
            req.session.util.varsta = listaUtilizatori[src].varsta;
            req.session.util.rol = listaUtilizatori[src].rol;
            res.redirect('/');
            return;
        }
    }
    res.cookie("messageError", "true");
    res.redirect('/autentificare');

});

/*
const movies_data = {
    "10" : {
        "1" : [];
    }
}*/

app.post('/inregistrare-locuri', (req, res) => {
    console.log(req.body);
    let received_data = req.body;
    let movie_name = req.body["movie"];
    let locuri = req.body["locuri"];

    if (typeof movies_data[movie_name] == "undefined"){
        movies_data[movie_name] = {};
        for (let i = 1; i <= 5; i++){
            movies_data[movie_name][i.toString()] = [];
        }
    }

    for (let i = 1; i <= 5; i++){
        for (let j = 0; j < locuri[i].length; j++){
            movies_data[movie_name][i].push(locuri[i][j]);
        }
    }
});

app.post('/cinema-movies', (req, res) => {
    let movie_id = req.body["movie_id"];
    console.log(movie_id);
    let data_to_send = {};
    if (typeof movies_data != "undefined"){
        data_to_send = movies_data[movie_id]
    }
    res.send(data_to_send);
});

app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:6789`));