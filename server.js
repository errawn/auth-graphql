const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
// Passport JS imports
const passport = require('passport')
const expressSession = require('express-session')
// Grahql
const expressGraphQL = require('express-graphql')

const model = require('./db/models')
const schema = require('./schema/schema')

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())
// Passport middleware
app.use(expressSession({secret: 'superSecret', saveUninitialized: true, resave: true}))
app.use(passport.initialize())
app.use(passport.session())

// Graphql
app.use('/graphql', expressGraphQL({
	schema,
	graphiql: true
}))


// Initial Route
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html')
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`magic starts at PORT ${PORT}`))