const TodoView = require('./todo_view');
const TodoModel = require('./todo_model');

const TodoDataService = TodoModel.TodoDataService;
const FILE_NAME = 'data.json';

class TodoController {

  constructor() {
    this.todoView = new TodoView();
    this.todoDataService = new TodoDataService(FILE_NAME);
  }

  processCommand(commands) {
    const command = commands[0];
    const description = commands[0];

    switch (command) {
      case 'help':
        TodoController.handleHelp();
        break;
      case 'list':
        this.handleListTodo();
        break;
      case 'add':
        this.handleAddTodo(description);
        break;
      default:
        TodoController.handleUnknownCommand();
        break;
    }
  }

  static handleHelp() {
    TodoView.showHelp();
  }

  handleListTodo() {
    const todoList = this.todoDataService.getTodoList();
    return TodoView.showTodoList(todoList);
  }

  handleAddTodo(taskDescription) {
    this.todoDataService.addTodo(taskDescription);
    TodoView.showMessage(`Added ${taskDescription} to your TODO list...`);
  }

  static handleUnknownCommand() {
    TodoView.showMessage('Unknown command.');
  }
}

module.exports = TodoController;
