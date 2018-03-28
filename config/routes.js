
module.exports.routes = {
  'get /': 'IndexController.index',
  'get /users': 'IndexController.testModel',
  'get /populate': 'IndexController.testPopulate',
  'post /comments/create': 'CommentsController.create',
  'post /comments/update': 'CommentsController.update',
  'get /comments': 'CommentsController.list',
  'get /emoji': 'EmojiController.list',
  'get /commentcache': 'CommentsController.commentCache',
  '/comments/test': 'CommentsController.test',
  '/demo-comment': 'DemoController.comment',
  'post /post-demo': 'DemoController.postComment'
};
