const express = require('express')
    sequelize = require('sequelize')
let db = {}

db.conn = new sequelize( 'letsplay', process.env.POSTGRES_USER, 
    process.env.POSTGRES_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres'
} )

user = db.conn.define( 'user', {
    username: sequelize.STRING,
    password: sequelize.STRING,
    email: sequelize.STRING,
    age: sequelize.INTEGER,
    hostrating: sequelize.FLOAT,
    guestrating: sequelize.FLOAT,
    lattitude: sequelize.FLOAT,
    longitude: sequelize.FLOAT
} )

game = db.conn.define( 'game', {
    name: sequelize.STRING,
    info: sequelize.STRING,
    status: sequelize.STRING,
    players: sequelize.STRING,
    joining: sequelize.INTEGER,
    date: sequelize.STRING,
    lattitude: sequelize.FLOAT,
    longitude: sequelize.FLOAT,
    alcohol: sequelize.STRING
} )

chat = db.conn.define( 'chat', {
    input: sequelize.STRING,
    messages: sequelize.STRING
} )

chat.belongsTo( game )
game.hasMany( chat )
game.belongsTo( user )
user.hasMany( game )

db.conn.sync( { force: true } )
.then( f => {
    return Promise.all( [
        user.create( {
            username: 'Jeroen',
            password: 'poes',
            age: 27,
            lattitude: 52.341,
            longitude: 4.824,
            hostrating: 3.5,
            guestrating: 4.1     
        } ),
        user.create( {
            username: 'Catan',
            password: 'Catan',
            age: 33,
            lattitude: 52.349,
            longitude: 4.884,
            hostrating: 4.2,
            guestrating: 3.1
        } ),
        user.create( {
            username: 'Risk',
            password: 'Risk',
            age: 21,
            lattitude: 52.243,
            longitude: 4.921,
            hostrating: 2.9,
            guestrating: 2.7,  
        } ) 
    ] )
} )
.catch( err => {
  console.log('An error occured: ' + err)
} )

module.exports = db

