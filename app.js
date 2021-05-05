const express = require('express')
const bodyParser= require('body-parser')
const mysql= require('mysql2')

const app= express()
const port= process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

//Mysql

const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : 'admin',
    database        : 'nodejs_db',
    port            : '3307'
})



//select all data
app.get('/', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from candidate_test_score', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('The data from candidate_test_score table are: \n', rows)
        })
    })
}) 


// Add Candidate
app.post('/add', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        
        const params = req.body;
        
        connection.query('INSERT INTO candidate_test_score SET ?', params, (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {
            res.send(` record has been added.`)
        } else {
            console.log(err)
        }
        
        console.log('\n', rows)

        })
        console.log(req.body)
    })
});

// Average score of candidates

app.post('/avg', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        
        const params = req.body;
        
        connection.query('SELECT AVG(first_round) AS avgscore from candidate_test_score ?', params, (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {
            res.send(` average score.`)
        } else {
            console.log(err)
        }
        
        console.log('\n', rows)

        })
        console.log(req.body)
    })
});



// Listen on environment porton 8000
app.listen(port, () => console.log('Listen on port 8000'))
