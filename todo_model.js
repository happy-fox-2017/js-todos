const fs = require('fs');

class Todo {
  constructor(id, task, status = 0) {
    this.id = id;
    this.task = task;
    this._status = status;
    this.tags = [];
  }

  get completed() {
    return this._status === 1;
  }

  complete() {
    this._status = 1;
  }

  uncomplete() {
    this._status = 0;
  }
}

class TodoDataService {
  constructor(fileName) {
    this._fileName = fileName;
  }

  getTodoList() {
    const data = this.readFile();
    return TodoDataService.parseToDo(JSON.parse(data));
  }

  save(todoList) {
    this.saveFile(JSON.stringify(todoList));
  }

  addTodo(taskDescription) {
    const todoList = this.getTodoList();
    const todoId = todoList.length + 1;
    const newTodo = new Todo(todoId, taskDescription);
    todoList.push(newTodo);
    this.save(todoList);
  }

  getTodoById(todoId) {
    const todoList = this.getTodoList();
    const foundTodo = todoList.find(todo => todo.id === parseInt(todoId, 10));
    if (foundTodo === undefined) throw new Error(`Todo with id: ${todoId} not found!.`);
    return foundTodo;
  }

  completeTodo(todoId) {
    this.setComplete(todoId, true);
  }

  UncompleteTodo(todoId) {
    this.setComplete(todoId, false);
  }

  setComplete(todoId, complete) {
    const todoList = this.getTodoList();
    const foundTodo = todoList.find(todo => todo.id === parseInt(todoId, 10));
    if (foundTodo === undefined) throw new Error(`Todo with id: ${todoId} not found!.`);
    if (complete) {
      foundTodo.complete();
    } else {
      foundTodo.uncomplete();
    }
    this.save(todoList);
  }

  deleteTodo(todoId) {
    let todoList = this.getTodoList();
    todoList = todoList.filter(todo => todo.id !== parseInt(todoId, 10));
    this.save(TodoDataService.reArrangeTodoId(todoList));
  }

  static reArrangeTodoId(todoList) {
    for (let i = 0; i < todoList.length; i += 1) {
      const todo = todoList[i];
      todo.id = i + 1;
    }

    return todoList;
  }

  static parseToDo(todoJSONArray) {
    return todoJSONArray.map(todoJSON => new Todo(todoJSON.id, todoJSON.task, todoJSON._status));
  }

  readFile() {
    return fs.readFileSync(this._fileName).toString();
  }

  saveFile(data) {
    fs.writeFile(this._fileName, data, (fileErr) => {
      if (fileErr) throw fileErr;
      console.log('Files saved.');
    });
  }
}

module.exports = {
  Todo,
  TodoDataService,
};
