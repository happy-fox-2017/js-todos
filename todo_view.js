'use strict'

class TodoView {
  constructor() {
  }

  static showHelp() {
    console.log(`
      How to use the todo App :
      Use one of the following commands:
       - help
       - list
       - add <task_content>
       - task <task_id>
       - delete <task_id>
       - complete <task_id>
       - uncomplete <task_id>
      `);
  }

  static showUnknownCommand() {
    console.log('Unknown command.');
  }

  static showTodoList(todoList) {
    for (const [index, todo] of todoList.entries()) {
      const completedMark = todo.completed ? 'X' : ' ';
      console.log(`${index + 1}. [${completedMark}] ${todo.task}`);
    }
  }

}

module.exports = TodoView;
