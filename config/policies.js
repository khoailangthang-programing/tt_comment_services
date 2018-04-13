module.exports.policies = {
  '*': true,
  CommentsController: {
  	'create': 'isAuthenticate',
  	'update': 'isAuthenticate',
  	'list': true,
  	'commentCache': true
  }
};
