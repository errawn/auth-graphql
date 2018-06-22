const graphql = require('graphql')
const { GraphQLObjectType, GraphQLID } = graphql

const UserType = require('./user_type')

const RootQueryType = new GraphQLObjectType ({
	name: 'RootQueryType',
	fields: {
		// current user
		user: {
			type: UserType,
			resolve(parentValue, args, { user }) {
				return new Promise((resolve, reject) => {
					if (!user)
						return reject('No Current User')
					resolve(user)
				})
			}
		},
		users: {
			type: UserType,
			// third parameter is the context defined in server.js
			resolve(parentValue, args, { model, user }) {
				if (!user) 
					throw new Error('Auth Failed')

				// GraphQL only supports promise based async code!
				return new Promise((resolve, reject) => {
					model.User.find({})
						.then(users => {
							if (!users)
								return reject('No Users found')
							resolve({ email: users.email })
						})
						.catch(error => reject(error))
				})

			}
		}
	}
})

module.exports = RootQueryType