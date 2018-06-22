const graphql = require('graphql')
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLNonNull
} = graphql
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

if (typeof localStorage === "undefined" || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


const UserType = require('./types/user_type')

const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		signup: {
			type: UserType,
			args: { 
				email: { type: new GraphQLNonNull(GraphQLString) },
				password: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve(parentValue, { email, password }, { model }) {
				return new Promise((resolve, reject) => {
					model.User.create({
						email,
						password
					})
					.then(user => {
						if (!user)
							return reject('Sorry. something went wrong')
						resolve(user)
					})
					.catch(error => reject(error))
				})
			}
		},
		signin: {
			type: UserType,
			args: {
				email: { type: new GraphQLNonNull(GraphQLString) },
				password: { type: new GraphQLNonNull(GraphQLString) }
			},
			// params: parentValue, args, context
			resolve(parentValue, { email, password }, { model, SECRET }) {
				return new Promise((resolve, reject) => {
					model.User.find({ where: { email } })
						.then(user => {
							if (!user)
								return reject('Invalid Credentials')
							if (!bcrypt.compareSync(password, user.password))
								return reject('Invalid Credentials')

							const token = jwt.sign({ user: { id: user.id, email: user.email } }, SECRET, { expiresIn: '1yr' })
							user.token = token	// add token property to user object which will be resolved
							localStorage.setItem('token', token)
							console.log(localStorage.getItem('token'))
							resolve(user)

						})
						.catch(error => reject(error))
				})

			}
		}
	}
})

module.exports = mutation