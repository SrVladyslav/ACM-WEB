// Code to access our database
const mysql = require('mysql')
const { promisify } = require('util')
const { database } = require('./keys')

const pool = mysql.createPool(database)

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {
            console.error('DATABASE CONNECTION WAS CLOSED')
        }

        if (err.code == 'ERR_CON_COUNT_ERROR') {
            console.error('DATABASE HAS TO MANY CONNECTIONS')
        }
        
        if (err.code == 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION WAS REFUSED...')
        }
    }   

    if (connection) connection.release();
    console.log('DB is CONNECTED')
    return
})

// Promisify pool queries
pool.query = promisify(pool.query)

module.exports = pool