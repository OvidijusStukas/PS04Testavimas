'use strict';

module.exports = {
	meta: {
		docs: {
			description: 'function args must be seperated with command and space after',
			category: 'Possible Errors',
			recommended: true
		},
		fixable: 'code',
		schema: [] // no options
	},
	create: function(context) {
		return {
			'FunctionExpression': function(node) {
			  if (node.params.length > 1) {
			  	var source = context.getSource(node);
					var parameters_block = source.substring(0, source.indexOf(')') + 1);
					if (!parameters_block.match(/, /)) {
          	context.report(node, 'Function arguments must be seperated with comma and space');
					}
				}
			}
		};
	}
};