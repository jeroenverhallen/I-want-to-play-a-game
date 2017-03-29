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
    latitude: sequelize.FLOAT,
    longitude: sequelize.FLOAT
} )

game = db.conn.define( 'game', {
    name: sequelize.STRING,
    info: sequelize.STRING,
    status: sequelize.STRING,
    players: sequelize.STRING,
    joining: sequelize.INTEGER,
    date: sequelize.STRING,
    latitude: sequelize.FLOAT,
    longitude: sequelize.FLOAT,
    alcohol: sequelize.STRING
} )

attend = db.conn.define( 'attend', {
    
} )


chat = db.conn.define( 'chat', {
    input: sequelize.STRING,
    messages: sequelize.STRING
} )

usergame = db.conn.define('user-game', {
    role: sequelize.STRING
} )

game.belongsTo( user )
user.hasMany( game )

user.hasMany(attend)
attend.belongsTo(user)
attend.belongsTo(game)
game.hasMany(attend)

db.conn.sync( { force: true } )
.then( f => {
    return Promise.all( [
        user.create( {
            username: 'Jeroen',
            password: 'poes',
            age: 27,
            latitude: 52.341,
            longitude: 4.824
        } ),
        user.create( {
            username: 'Catan',
            password: 'Catan',
            age: 33,
            latitude: 52.349,
            longitude: 4.884
        } ),
        user.create( {
            username: 'Risk',
            password: 'Risk',
            age: 21,
            latitude: 52.243,
            longitude: 4.921
        } ),
        user.create( {
            username: 'Pierre',
            password: 'uh',
            age: 29,
            latitude: 48.9,
            longitude: 2.4  
        } ) 
    ] )
} ).then( f => { return Promise.all( [
    game.create( {
        name: 'schaken',
        userId: 1,
        info: 'gewoon een potje schaken',
        players: 2,
        date: '25-04-2017 20:00',
        latitude: 52.341,
        longitude: 4.824,
        alcohol: 'Ik zat zelf te denken aan een goed glas whisky erbij'
    } ),
    game.create( {
        name: 'dammen',
        userId: 1,
        info: 'gewoon een potje dammen',
        players: 2,
        date: '25-03-2017 22:00',
        latitude: 52.341,
        longitude: 4.824,
        alcohol: 'Ik zat zelf te denken aan een goed glas whisky erbij'
    } ),
    game.create( {
        name: 'Kolonisten van Catan',
        userId: 2,
        info: 'met zeevaarders uitbreiding',
        players: 4,
        date: '27-03-2017 20:00',
        latitude: 52.349,
        longitude: 4.884,
        alcohol: 'Het gaat om het spel maar neem gerust iets voor jezelf mee'
    } ),
    game.create( {
        name: 'Risk',
        userId: 3,
        info: 'De originele versie natuurlijk',
        players: 3,
        date: '23-04-2017 18:00',
        latitude: 52.243,
        longitude: 4.921,
        alcohol: 'BIERRRR!'
    } ),
    game.create( {
        name: 'jeu de boule',
        userId: 4,
        info: 'hon hon hon',
        players: 8,
        date: '23-12-2017 18:00',
        latitude: 48.9,
        longitude: 2.4,
        alcohol: 'du vin'
    } )
] ) } ).then( f => { return Promise.all( [
    attend.create( {
        userId: 1,
        gameId: 1
    } ),
   attend.create( {
        userId: 1,
        gameId: 2
    } ),
    attend.create( {
        userId: 1,
        gameId: 3
    } ),
    attend.create( {
        userId: 1,
        gameId: 4
    } ),
    attend.create( {
        userId: 1,
        gameId: 5
    } ),
    attend.create( {
        userId: 2,
        gameId: 3
    } ),
    attend.create( {
        userId: 3,
        gameId: 4
    } ),
    attend.create( {
        userId: 4,
        gameId: 5
    } ),
    attend.create( {
        userId: 2,
        gameId: 2
    } )
] ) } )
.catch( err => {
  console.log('An error occured: ' + err)
} )

module.exports = db

