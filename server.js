const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')


const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())


// Initial Route
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html')
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`magic starts at PORT ${PORT}`))