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


