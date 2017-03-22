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
    location: sequelize.STRING
} )

game = db.conn.define( 'game', {
    name: sequelize.STRING,
    info: sequelize.STRING,
    status: sequelize.STRING,
    requiredplayers: sequelize.STRING,
    players: sequelize.INTEGER,
    date: sequelize.STRING,
    location: sequelize.STRING,
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
            hostrating: 3.5,
            guestrating: 4.1     
        } ),
        user.create( {
            username: 'Catan',
            password: 'Catan',
            age: 33,
            hostrating: 4.2,
            guestrating: 3.1
        } ),
        user.create( {
            username: 'Risk',
            password: 'Risk',
            age: 21,
            hostrating: 2.9,
            guestrating: 2.7,  
        } ) 
    ] )
} )
.catch( err => {
  console.log('An error occured: ' + err)
} )

module.exports = db

