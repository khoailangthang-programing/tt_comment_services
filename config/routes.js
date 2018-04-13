
module.exports.routes = {
  'get /': 'IndexController.index',
  'get /users': 'IndexController.testModel',
  'get /populate': 'IndexController.testPopulate',
    // APIs
  'post /comments/create': 'CommentsController.create',
  'post /comments/update': 'CommentsController.update',
  'get /comments': 'CommentsController.list',
  'get /emoji': 'EmojiController.list',
  'get /commentcache': 'CommentsController.commentCache',
    // Middle api
  '/middle-api/add-comment': 'MiddleController.postComment',
    // Test api
  '/comments/test': 'CommentsController.test',
  '/demo-comment': 'DemoController.comment',
  'post /post-demo': 'DemoController.postComment'
};
