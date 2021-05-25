'use strict';
module.exports = function(app) {
  var todoList = require('../controllers/kqxsController');

  // todoList Routes
  app.route('/get-kqxs')
    .get(todoList.list_all_tasks)
    .post(todoList.create_a_task);


  app.route('/get-kqxs/:id')
    .get(todoList.read_a_task)
    .put(todoList.update_a_task)
    .delete(todoList.delete_a_task);
};