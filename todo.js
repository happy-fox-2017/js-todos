const TodoController = require('./todo_controller');

const commands = process.argv.slice(2);

const todoController = new TodoController();
todoController.processCommand(commands);
