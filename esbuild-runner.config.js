const graphqlLoaderPlugin = require('@luckycatfactory/esbuild-graphql-loader')

module.exports = {
	esbuild: {
		loader: {
			'.gql': 'text',
			'.svg': 'text',
		},
	},
}
