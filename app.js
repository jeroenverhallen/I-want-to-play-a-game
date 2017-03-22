const express = require('express'),
    bodyparser = require('body-parser'),
    session = require('express-session'),
    sequelize = require('sequelize')

const app = express()
const db = require(__dirname + '/modules/db')

app.set( 'view engine', 'pug' )
app.set( 'views', __dirname + '/views' )
app.use( bodyparser.urlencoded(  { extended: true } ) )
app.use( express.static( 'public' ) )

app.use( session( {
    secret: 'this is probably secure enough as a key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
} ) )


// landing page
app.get( '/', (req, res) => {
    res.render( 'index', { user: req.session.user } )
} )

// login
app.get( '/login', (req, res) => {
    res.render( 'login', { user: req.session.user
    } )
} )

app.post( '/login', ( req, res) => {
    user.findOne( {
        where: {
            username: req.body.username
        }
    } ).then( theuser => {
        if( theuser.password == req.body.password ) {
            req.session.user = theuser
            res.render( 'index', {
                user:theuser
            } )
        } else {
            res.render( 'login' )
        }
    } ).catch(console.log.bind(console))
} )

// logout
app.get( '/logout', (req, res) => {
    req.session.destroy( )
    res.render( 'index' )
} )

// register a new user
app.get( '/newuser', (req, res) => {
    res.render( 'newuser', { user: req.session.user } )
} )

app.post( '/newuser', (req, res) => {
    let newUser = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        age: req.body.age
    }
    user.create( newUser )
    req.session.visited = true
    req.session.user=newUser
    res.render('index', { user: req.session.user })
} )

// start a new game
app.get( '/newgame', (req, res) => {
    res.render( 'newgame', { user: req.session.user } )
} )

// find a game to join
app.get( '/joingame', (req, res) => {
    res.render( 'joingame', { user: req.session.user } )
} )

app.listen( 3000, f => {
    console.log( 'go to localhost:3000' )
} )