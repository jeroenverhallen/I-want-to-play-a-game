const express = require('express'),
    bodyparser = require('body-parser'),
    session = require('express-session'),
 //   sequelize = require('sequelize')
    Slider = require('bootstrap-slider'),
    bcrypt = require('bcrypt-nodejs')

 //   GoogleMapsLoader = require('google-maps')
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
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
} ) )


// landing page
app.get( '/', (req, res) => {
    res.render( 'index', { user: req.session.user } )
} )

app.get( '/index', (req, res) => {
    res.render( 'index', { user: req.session.user } )
 } )

// login
app.get( '/login', (req, res) => {
    res.render( 'login', { user: req.session.user
    } )
} )

app.get( '/newuser', (req, res) => {
    res.render( 'newuser', { user: req.session.user } )
} )

app.post( '/login', ( req, res) => {
    user.findOne( {
        where: {
            username: req.body.username
        }
    } ).then( theuser => {
        bcrypt.compare( req.body.password, theuser.password, (err, result) => {
            if(result) {
                console.log('you log in good')
                req.session.visited = true
                req.session.user = theuser
                res.render('index', {user: req.session.user})
            } else {
                console.log('no login for you')
                res.render('login', {user: undefined})
            }
        } )
    } ).catch(err => {
        res.render('login', {user: undefined})
        console.log('error fail')
    } )
} )

// logout
app.get( '/logout', (req, res) => {
    req.session.destroy( )
    console.log('LOGOUT ROUTE')
    res.render( 'index', { user: undefined } )
} )

// register a new user
app.post( '/newuser', (req, res) => {
    let newUser = {
        username: req.body.username,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        email: req.body.email,
        age: req.body.age
    }
    bcrypt.hash(req.body.password, null, null, (err,hash) => {
        newUser.password = hash
        user.create( newUser )
    })
    res.render('login', { user: req.session.user })
} )

// start a new game
app.get( '/newgame', (req, res) => {
    res.render( 'newgame', { user: req.session.user } )
} )

app.post( '/newgame', (req, res) => {
    console.log('now logged in: ', req.session.user)
    let newGame = {
        name: req.body.name,
        players: req.body.players,
        date: req.body.date,
        alcohol: req.body.alcohol,
        info: req.body.info,
        latitude: req.session.user.latitude,
        longitude: req.session.user.longitude,
        userId: req.session.user.id
    }
    game.create( newGame ).then ( game => {
        console.log( req.session.user.id, game.id )
        attend.create({
            userId: req.session.user.id,
            gameId: game.id
        } )
    } )
    res.render( 'index', { user: req.session.user } )
} )

//to see all games you personally started
app.get( '/yourgames', ( req, res ) => {
    game.findAll( { 
        where: { userId: req.session.user.id },
        include: [
            {
                model: attend, 
                include: [ user ]
            },
            {
                model: user
            }
        ] } ).then( games => {
        res.render( 'yourgames', { games:games, user: req.session.user } )
    } )
} )

// all games you joined
app.get( '/games', ( req, res ) => {
    attend.findAll( {
        where: {
            userId: req.session.user.id },
            include: [
                { model: game,  
                    include: [
                        {
                            model: attend,
                            include: [ user ]
                        },                        { 
                            model: user 
                        }
                    ]
                }
            ]
        } ).then( attends => {
            res.render( 'games', { attends: attends } )
        } )
} )

// see all games you can join
app.get( '/joingame', ( req, res ) => {
    game.findAll( {    
    } ).then( games => {
        res.render( 'joingame', { games:games, user: req.session.user } )
    } )
} )

app.post( '/joingame', (req, res) => {
    console.log(  req.body, req.body.sliderthing )
    game.findAll( { include: [
            { model: attend, include: [ user ] },
            { model: user }
        ]   
    } ).then( games => {
        res.render( 'joingame', { games:games, user: req.session.user, sliderthing: req.body.sliderthing } )
    } )
} )

// view a game to join it
app.get( '/letsplay:name', ( req, res ) => {
    console.log('let us see if this is even firin')
    game.findOne( {
        where: {
            name: req.params.name
        }, include: [
            { model: attend, include: [ user ] },
            { model: user },
            { model: message, include: [ user ]}
        ]
    } )
    .then( game => {
        res.render( 'singlegame', { 
            game: game,
            user: req.session.user
        } )
    } )
} )

app.post( '/singlegame', (req, res) => {
    console.log( req.session.user.id, ' is still logged in', req.body.gameId )
    attend.findOrCreate( { where: {
        userId: req.session.user.id,
        gameId: req.body.gameId
        }
    } )
} )

app.post( '/chat', (req, res) => {
    message.create({
        userId: req.session.user.id,
        gameId: req.body.gameId,
        input: req.body.message
    }).then( f => {
        console.log( 'url?', req.params.name )
        res.render('/', {
            user: req.session.user
        })
    } )
})

// find a game to join
app.get( '/joingame', (req, res) => {
    res.render( 'joingame', { user: req.session.user } )
} )

app.listen( 3000, f => {
    console.log( 'go to localhost:3000' )
} )