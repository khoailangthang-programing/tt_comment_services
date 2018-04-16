
module.exports.routes = {
  'get /': 'IndexController.index',
  'get /users': 'IndexController.testModel',
  'get /populate': 'IndexController.testPopulate',
    // APIs
  'post /comments/create': 'CommentsController.create',
  'post /comments/update': 'CommentsController.update',
  'get /comments': 'CommentsController.list',
  'get /subcomment': 'CommentsController.subcomment',
  'get /emoji': 'EmojiController.list',
  'get /commentcache': 'CommentsController.commentCache',
    // Middle api
  '/middle-api/add-comment': 'MiddleController.postComment',
  '/middle-api/join-comment-rooms': 'MiddleController.commentRooms',
    // Test api
  '/comments/test': 'CommentsController.test',
  '/demo-comment': 'DemoController.comment',
  'post /post-demo': 'DemoController.postComment'
};
