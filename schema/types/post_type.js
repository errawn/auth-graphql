const graphql = require('graphql')
const { 
	GraphQLObjectType,
	GraphQLID,
	GraphQLInt,
	GraphQLString,
	GraphQLNonNull
} = graphql

const PostType = new GraphQLObjectType({
	name: 'PostType',
	fields: () => ({
		id: { type: GraphQLID },
		title: { type: new GraphQLNonNull(GraphQLString) },
		body: { type: new GraphQLNonNull(GraphQLString) },
		userId: { type: GraphQLInt }
	})
})

module.exports = PostType