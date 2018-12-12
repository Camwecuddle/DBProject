const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

var connection = mysql.createConnection({
    host: 'db4free.net',
    user: 'camronvick',
    password: 'vickcamron',
    database: "camdbproject",
});

app.listen(3000, function () {
    console.log('listening on 3000')
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/landing_page.html')
});

app.get('/datums', function (req, res1) {

    /*onnection.connect(function (err) {
        db.collection('quotes').find().toArray((err, result) => {
            if (err) return console.log(err)
            // renders index.ejs
            res.render('index.ejs', { quotes: result })
        })*/

    connection.query('select DriverName, DriverID from driver', function (err, res2) {
        if (err) {
            return console.log(err);
        }
        console.log(res2);
        res1.render('index.ejs', { res2: res2 });

    });



});

app.post('/datums/add_car', function (req, res) {
    res.render('add_car.ejs', { DriverID: req.body.DriverID });

});



app.post('/datums/cars', function (req, res) {
    console.log(req.body);
    connection.query('select Make, Model, Color, DriverID, CarID from car where DriverID =(select DriverID from driver where DriverName = "' + req.body.name + '");', function (err, res2) {
        if (err) {
            return console.log(err);
        }
        //console.log(res2[0].Model, res2[1].Model);
        res.send(JSON.stringify(res2));
    });
});

app.post('/datums/add_new_car', function (req, res) {

    connection.query('INSERT INTO car (Make, Model, DriverID, Color, CarID) VALUES("' + req.body.make + '", "' + req.body.model + '", "' + req.body.DriverID + '", "' + req.body.color + '", 0)', function (err, res2) {
        if (err) {
            return console.log(err);
        }
        res.send("done");
    });
});

app.post('/datums/remove_car', function (req, res) {
    console.log(req.body);
    connection.query('DELETE FROM car WHERE CarID = ' + req.body.CarID + ';', function (err, res2) {
        if (err) {
            return console.log(err);
        }
        res.render('index.ejs', { res2: res2 });

    });
});

