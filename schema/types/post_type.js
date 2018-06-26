const graphql = require('graphql')
const { 
	GraphQLObjectType,
	GraphQLID,
	GraphQLInt,
	GraphQLString,
	GraphQLNonNull
} = graphql

const UserType = require('./user_type')

const PostType = new GraphQLObjectType({
	name: 'Post',
	fields: () => ({
		id: { type: GraphQLID },
		title: { type: GraphQLString },
		body: { type: GraphQLString },
		userId: { type: GraphQLInt },
		user: {
			type: UserType, // we are not using new GraphQLList(UserType) becase user is not an array!
			resolve(parentValue, args, { model, user }) {
				return new Promise((resolve, reject) => {
					model.User.find({ where: { id: parentValue.userId } })
						.then(user => {
							if (!user) return reject('No user')
							resolve(user)
						})
						.catch(error => reject(error))
				})
				
			}
		}
	})
})

module.exports = PostType