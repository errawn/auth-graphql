const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
// Passport JS imports
const passport = require('passport')
const expressSession = require('express-session')
// Grahql
const expressGraphQL = require('express-graphql')
const jwt = require('jsonwebtoken')

const model = require('./db/models')
const schema = require('./schema/schema')

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())
// Passport middleware
app.use(expressSession({secret: 'superSecret', saveUninitialized: true, resave: true}))
app.use(passport.initialize())
app.use(passport.session())

// secret key
const SECRET = 'eggieandsausage'

// this method checks token authenticity from
// user attempting to login
const addUser = async (req, res, next) => {
	const token = req.headers['authentication']
	try {
		// verify token from headers
		const { user } = await jwt.verify(token, SECRET)
		// store user in req
		req.user = user
	} catch(err) {
		console.log(err)
	}
	// proceed
	next()
}

// Graphql
app.use(addUser)
app.use('/graphql', expressGraphQL(req => ({
	schema,
	graphiql: true,
	// this context is accessible within resolve()
	context: {
		model,
		SECRET,
		user: req.user
	}
})))


// Initial Route
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html')
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`magic starts at PORT ${PORT}`))