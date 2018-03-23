
module.exports.routes = {
  'get /': 'IndexController.index',
  'get /users': 'IndexController.testModel',
  'get /populate': 'IndexController.testPopulate',
  'post /comments/create': 'CommentsController.create',
  'post /comments/update': 'CommentsController.update',
  'get /comments': 'CommentsController.list',
  'get /emoji': 'EmojiController.list',
  '/comments/test': 'CommentsController.test'
};
