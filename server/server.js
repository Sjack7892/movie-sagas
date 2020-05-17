const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const pool = require('./modules/pool')

/** ---------- MIDDLEWARE ---------- **/
app.use(bodyParser.json()); // needed for angular requests
app.use(express.static('build'));

/** ---------- ROUTES ---------- **/
// Get movies from database.
app.get('/movies', (req, res) => {
    // console.log('get request received');
    let queryString = `SELECT * FROM "movies";`;
    pool.query(queryString)
    .then(result => {
        // console.log('getting movies from database:', result.rows);
        res.send(result.rows);
    }).catch(error => {
        console.log(error);
        res.send(500);
    });
});

app.get('/genres/:title', (req, res) => {
    console.log('get request received', req.params.title);
    let queryString = `SELECT "name" FROM "movies"
    JOIN "movie_genre" ON "movies"."id" = "movie_genre"."movie_id"
    JOIN "genres" ON "movie_genre"."genre_id" = "genres"."id"
    WHERE "title" = '${req.params.title}';`;
    pool.query(queryString)
    .then(result => {
        console.log('getting movies from database:', result.rows);
        res.send(result.rows);
    }).catch(error => {
        console.log(error);
        res.send(500);
    });
});

app.put('/movies', (req, res) => {
    console.log('put received:', req.body);
    let queryString = `
    UPDATE "movies"
    SET "title" = '${req.body.title}', description= '${req.body.description}'
    WHERE "id" = '${req.body.id}';`;
    pool.query(queryString)
    .then(result => {
        console.log('database updated!');
        res.sendStatus(201);
    }).catch(error => {
        console.log(error);
        res.sendStatus(500);
    })
})

/** ---------- START SERVER ---------- **/
app.listen(port, function () {
    console.log('Listening on port: ', port);
});