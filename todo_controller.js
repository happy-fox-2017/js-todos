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
    const commandArg1 = commands[1];

    switch (command) {
      case 'help':
        TodoController.handleHelp();
        break;
      case 'list':
        this.handleListTodo();
        break;
      case 'add':
        this.handleAddTodo(commandArg1);
        break;
      case 'task':
        this.handleViewTodo(commandArg1);
        break;
      case 'delete':
        this.handleDeleteTodo(commandArg1);
        break;
      case 'complete':
        this.handleCompleteTodo(commandArg1);
        break;
      case 'uncomplete':
        this.handleUncompleteTodo(commandArg1);
        break;
      case 'list:outstanding':
        this.handleListOutstanding(commandArg1);
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

  handleDeleteTodo(taskId) {
    this.todoDataService.deleteTodo(taskId);
    TodoView.showMessage(`Task with id (${taskId}) has been deleted...`);
  }

  handleViewTodo(taskId) {
    try {
      const todo = this.todoDataService.getTodoById(taskId);
      TodoView.showTodo(todo);
    } catch (err) {
      TodoView.showError(err.toString());
    }
  }

  handleCompleteTodo(taskId) {
    try {
      this.todoDataService.completeTodo(taskId);
      TodoView.showMessage(`Task with id (${taskId}) has been completed...`);
    } catch (err) {
      TodoView.showError(err.toString());
    }
  }

  handleUncompleteTodo(taskId) {
    try {
      this.todoDataService.UncompleteTodo(taskId);
      TodoView.showMessage(`Task with id (${taskId}) changed to Uncompleted...`);
    } catch (err) {
      TodoView.showError(err.toString());
    }
  }

  handleListOutstanding(sorting) {
    const todoList = this.todoDataService.getOutstandingTodoList(sorting);
    return TodoView.showTodoList(todoList);
  }

  static handleUnknownCommand() {
    TodoView.showMessage('Unknown command.');
  }
}

module.exports = TodoController;
