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

  getTodoId() {
    const todoList = this.getTodoList();
    return todoList.length + 1;
  }

  static parseToDo(todoJSONArray) {
    return todoJSONArray.map(todoJSON => new Todo(todoJSON.id, todoJSON.task, todoJSON.status));
  }

  readFile() {
    return fs.readFileSync(this._fileName).toString();
  }

  saveFile(data) {
    fs.writeFile(this._fileName, data, (fileErr) => {
      if (fileErr) throw fileErr;
      console.log('Saved!');
    });
  }
}

module.exports = {
  Todo,
  TodoDataService,
};
