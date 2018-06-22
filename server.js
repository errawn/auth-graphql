const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
// Grahql
const expressGraphQL = require('express-graphql')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const model = require('./db/models')
const schema = require('./schema/schema')

const app = express()
app.use(cors())
app.options('*', cors())
app.use(bodyParser.json())
app.use(morgan('dev'))

// secret key
const SECRET = 'eggieandsausage'

// this method checks token authenticity from
// user attempting to login
const verifyTokenAuthenticity = async (req, res, next) => {
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
app.use(verifyTokenAuthenticity)

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
app.listen(PORT, () => console.log(`MAGIC STARTS AT PORT ${PORT}`))