const fs = require('fs');

class Todo {
  constructor(id, task, status = 0) {
    this.id = id;
    this.task = task;
    this._status = status;
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
