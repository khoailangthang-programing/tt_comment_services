module.exports.policies = {
  '*': false,
  CommentsController: {
  	'create': 'isAuthenticate',
  	'update': 'isAuthenticate',
  	'list': true,
  	'commentCache': true
  },
  EmojiController: {
  	'list': true
  }
};
