const graphql = require('graphql')
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLNonNull
} = graphql
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserType = require('./types/user_type')

const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
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
							resolve(user)

						})
						.catch(error => reject(error))
				})

			}
		}
	}
})

module.exports = mutation