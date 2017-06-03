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

  deleteTodo(todoId) {
    let todoList = this.getTodoList();
    todoList = todoList.filter(todo => todo.id !== parseInt(todoId, 10));
    for (let i = 0; i < todoList.length; i += 1) {
      const todo = todoList[i];
      todo.id = i + 1;
    }
    this.save(todoList);
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
      console.log('Files saved.');
    });
  }
}

module.exports = {
  Todo,
  TodoDataService,
};
