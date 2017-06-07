const fs = require('fs');

class Todo {
  constructor(id, task, status = 0) {
    this.id = id;
    this.task = task;
    this._status = status;
    this._tags = [];
    this._createdAt = new Date();
    this._completedAt = null;
  }

  get completed() {
    return this._status === 1;
  }

  get createdAt() {
    return this._createdAt;
  }

  get completedAt() {
    return this._completedAt;
  }

  get tags() {
    return this._tags;
  }

  complete() {
    this._completedAt = new Date();
    this._status = 1;
  }

  uncomplete() {
    this._completedAt = null;
    this._status = 0;
  }

  addTag(tag) {
    this._tags.push(tag);
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

  getOutstandingTodoList(sorting) {
    let todoList = this.getTodoList();
    todoList = todoList.filter(todo => !todo.completed);
    if (sorting === 'DESC') {
      todoList = todoList.sort((todo1, todo2) => todo2.createdAt - todo1.createdAt);
    } else {
      todoList = todoList.sort((todo1, todo2) => todo1.createdAt - todo2.createdAt);
    }
    return todoList;
  }

  getCompletedTodoList(sorting) {
    let todoList = this.getTodoList();
    todoList = todoList.filter(todo => todo.completed);
    if (sorting === 'DESC') {
      todoList = todoList.sort((todo1, todo2) => todo2.completedAt - todo1.completedAt);
    } else {
      todoList = todoList.sort((todo1, todo2) => todo1.completedAt - todo2.completedAt);
    }
    return todoList;
  }

  getTodoListByTag(tag) {
    let todoList = this.getTodoList();
    todoList = todoList.filter(todo => todo.tags.indexOf(tag) !== -1);
    return todoList;
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

  addTags(todoId, tags) {
    const todoList = this.getTodoList();
    const foundTodo = todoList.find(todo => todo.id === parseInt(todoId, 10));
    if (foundTodo === undefined) throw new Error(`Todo with id: ${todoId} not found!.`);
    for (let i = 0; i < tags.length; i += 1) {
      const tag = tags[i];
      foundTodo.addTag(tag);
    }
    this.save(todoList);
    return foundTodo;
  }

  save(todoList) {
    this.saveFile(JSON.stringify(todoList));
  }

  static reArrangeTodoId(todoList) {
    for (let i = 0; i < todoList.length; i += 1) {
      const todo = todoList[i];
      todo.id = i + 1;
    }

    return todoList;
  }

  static parseToDo(todoJSONArray) {
    return todoJSONArray.map((todoJSON) => {
      const todo = new Todo(todoJSON.id, todoJSON.task, todoJSON._status);
      todo._tags = todoJSON._tags;
      todo._createdAt = new Date(todoJSON._createdAt);
      todo._completedAt = new Date(todoJSON._completedAt);
      return todo;
    });
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
