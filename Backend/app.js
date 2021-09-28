const express = require('express')
const bodyParser = require("body-parser");
const moment = require("moment");

const app = express()
var mysql = require('mysql');
const cors = require("cors");

var connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

app.use(cors());
app.use(express.static("public"));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(jsonParser)
app.use(urlencodedParser)
connection.connect((err, args) => {
    if (err) {
        return
    }
    // connection.query("drop table events")
});

const port = 3000

app.get('/', (req, res) => {
    res.end('Hello World!');
});

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});

app.post("/event", (req, res) => {
    const { email, environment, component, message, data } = req.body
    const timestamp = moment().unix()
    connection.query("insert into events(createdAt, email, environment, component, message, payload) values(" + timestamp + ", '" + email + "','" + environment + "', '" + component + "', '" + message + "', '" + JSON.stringify(data) + "')", (error, results, fields) => {
        if (error) {
            if (error.code === "ER_NO_SUCH_TABLE") {
                console.log("table not created. creating table");
                connection.query("Create table events(Id int NOT NULL AUTO_INCREMENT, createdAt int, email varchar(50), environment varchar(50), component varchar(50), message varchar(50), payload TEXT(65535), PRIMARY KEY (Id));", (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ "error": "error" })
                    }
                    connection.query("insert into events(createdAt, email, environment, component, message, payload) values(" + timestamp + ", '" + email + "','" + environment + "', '" + component + "', '" + message + "', '" + JSON.stringify(data) + "')", (error, results, fields) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ "error": "error" })
                        }
                        console.log(results);
                        return res.status(200).json({ "msg": "ok" })
                    })

                })
                return
            }
            console.log(error);
            return res.status(500).json({ "error": "error" })
        }
        console.log(results);
        return res.status(200).json({ "msg": "ok" })

    })
})

app.get("/event", (req, res) => {
    const { email, environment, component, searchText, date } = req.query
    console.log(req.query);
    let query = "select * from events where 1=1"
    if (email && email !== "") {
        query = query + " and email='" + email + "'"
    }
    if (environment && environment !== "") {
        query = query + " and environment='" + environment + "'"
    }
    if (component && component !== "") {
        query = query + " and component='" + component + "'"
    }
    if (searchText && searchText !== "") {
        query = query + " and message like '%" + searchText + "%'"
    }
    if (date && date !== "") {
        const fromDate = moment(date, "DD-MM-yyyy").unix()

        query = query + " and createdAt>" + fromDate
    }
    connection.query(query, (error, results, fields) => {
        if (error) {
            if (error.code === "ER_NO_SUCH_TABLE") {
                return res.status(200).json([])
            }
            console.log(error.code === "ER_NO_SUCH_TABLE");
            return res.status(500).json({ "error": "error" })
        }
        console.log(results);
        const values = []
        results.forEach(element => {
            console.log(element.createdAt, element.email)
            values.push({
                "id": element.Id,
                "createdAt": element.createdAt,
                "email": element.email,
                "environment": element.environment,
                "component": element.component,
                "message": element.message,
                "payload": JSON.parse(element.payload)
            })
        });
        return res.status(200).json(values)

    })
})