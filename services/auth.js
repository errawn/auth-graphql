const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const model = require('../db/models')

// Serialize user into token for unique indentification 
// serializeUser uses session
passport.serializeUser((user, done) => {
  done(null, user.id)
})

// Given user id, deserializeUser will return user object
// via req.user
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})


passport.use(new LocalStrategy({ usernameField: email }, (username, password, done) => {
    User.findOne({ where: { email: email } }, (err, user) => {
      if (err) { return done(err) }
      if (!user) { return done(null, false, 'Invalid Credentials!') }

      if (!bcrypt.compareSync(password, user.password))
      	return done(null, false, 'Invalid Credentials!')

      return done(null, user)
    })
  }
))


const signup = ({ email, password, req }) => {
	const user = User.build({ email, password })
	if (!email || !password) { throw new Error('You must provide email and password') }

	return model.User.findOne({ where: { email } })
		.then(existingUser => {
			if (existingUser) { throw new Error('Email in use') }
			return user.save()
		})
		.then(user => {
			return new Promise((resolve, reject) => {
				req.login(user, (err) => {
					if (err) { reject(err) }
					resolve(user)
				})
			})
		})
}


const login = ({ email, password, req }) => {
	return new Promise((resolve, reject) => {
		password.authenticate('local', (err, user) => {
			if (!user) { reject('Invalid Credentials!') }

			req.login(user, () => resolve(user))
		})({ body: { email, password } })
	})
}

module.exports = {
	signup,
	login
}





