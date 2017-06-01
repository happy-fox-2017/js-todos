
let jsonfile = require('jsonfile')


class Model {
  constructor() {
    // taskList adalah array of object
    this.file = './data.json';
    this.command = process.argv[2];
    this.parameter = process.argv.slice(3).join(" ");
    this.taskList = this.getData();
  }

  getData() {
    let jsonData = jsonfile.readFileSync(this.file)
    return jsonData;
  }

  // save data adanya di kontroller ??
  saveData () {
    jsonfile.writeFileSync(this.file, this.taskList)
  }
}

class Task {
  constructor(taskDetail="no task yet",completeValue=false, dateCompleted="") {
    this.id = 0;
    this.task = taskDetail;
    this.complete = completeValue;
    this.dateCompleted = dateCompleted;
    this.tag = [];
  }
}


class Controller {
  constructor() {
    this.model = new Model()
    this.view = new View()
  }

  run () {
    switch (this.model.command) {
      case "help":
        this.view.showHelp()
        break;
      case "list":
        this.view.showTaskList(this.model.taskList)
        break;
      case "add":
        this.addTaskList(new Task(this.model.parameter))
        this.view.confirmAddTask(this.model.parameter)
        break;
      case "task":
        this.view.showTaskDetail(this.model.taskList, this.model.parameter);
        break;
      case "tag":
        let paramArr = this.model.parameter.split(" ");
        let objId = paramArr[0];
        let taskName = this.model.taskList[objId].task
        let tagsArr = paramArr.slice(1);
        this.tag(objId, tagsArr);
        this.view.confirmAddedTag(taskName, tagsArr)
        break;
      case "delete":
        this.deleteData(this.model.parameter)
        this.view.confirmDeleteTask(this.model.parameter)
        break;
      case "check":
        this.complete(this.model.parameter)
        this.view.confirmCompleteTask(this.model.parameter)
        break;
      case "uncheck":
        this.uncomplete(this.model.parameter)
        this.view.confirmUncompleteTask(this.model.parameter)
        break;
      case "list:outstanding":
        if (this.model.parameter == "asc" || this.model.parameter == '') {
          let sortedTaskList = this.ascOutStanding(this.model.taskList)
          this.view.showUncompletedTask(sortedTaskList)
        } else if (this.model.parameter == "dsc") {
          let sortedTaskList = this.dscOutStanding(this.model.taskList)
          this.view.showUncompletedTask(sortedTaskList)
        } else {
          this.view.showErrorParameter();
        }
        break;
      case "list:completed":
        if (this.model.parameter == "asc") {
          let sortedTaskList = this.ascComplete(this.model.taskList)
          this.view.showCompletedTask(sortedTaskList)
        } else if (this.model.parameter == "dsc") {
          let sortedTaskList = this.dscComplete(this.model.taskList)
          this.view.showCompletedTask(sortedTaskList)
        } else {
          this.view.showErrorParameter();
        }
        break;
      case "filter":
        let filteredTaskObj = this.filterByTag(this.model.taskList ,this.model.parameter);
        this.view.showTaskByTag(filteredTaskObj, this.model.parameter)
        break;
      case undefined:
        this.view.showHelp()
        break;
      default:
        this.view.showErrorCommand()
    }
  }

  addTaskList (paramObj) {
    paramObj.id = this.model.taskList.length;
    this.model.taskList.push(paramObj);
    this.model.saveData()
  }

  deleteData (paramObjNum) {
    this.model.taskList.splice(paramObjNum, 1);
    this.model.saveData()
  }

  tag (paramObjNum, tagArr) {
    this.model.taskList[paramObjNum].tag = tagArr
    this.model.saveData()
  }

  filterByTag(paramObj, tag) {
    let filteredArr = []
    for (let i = 0; i < paramObj.length; i++) {
      let tagArr = paramObj[i].tag;
      if (tagArr == undefined) {
        continue;
      } else {
        if (tagArr.indexOf(tag) != -1) {
          filteredArr.push(paramObj[i]);
        }
      }

    }
    return filteredArr;
  }

  complete (paramObjNum) {
    this.model.taskList[paramObjNum].complete = true;
    this.model.taskList[paramObjNum].dateCompleted = new Date();
    this.model.saveData()
  }

  uncomplete (paramObjNum) {
    this.model.taskList[paramObjNum].complete = false;
    this.model.taskList[paramObjNum].dateCompleted = ""
    this.model.saveData()
  }

  ascOutStanding (paramObj) {
    paramObj.sort(function(a,b){
      return a.id - b.id;
    });
    return paramObj;
  }

  dscOutStanding (paramObj) {
    paramObj.sort(function(a,b){
      return b.id - a.id;
    });
    return paramObj;
  }

  ascComplete (paramObj) {
    paramObj.sort(function(a,b){
      return a.id - b.id;
    });
    return paramObj;
  }

  dscComplete (paramObj) {
    paramObj.sort(function(a,b){
      return b.id - a.id;
    });
    return paramObj;
  }
}

class View {
  constructor() {}

  showHelp() {
    console.log("help > show help");
    console.log("list > show list task");
    console.log("add [task] > show task");
    console.log("tag [task number] [new tag] > add tags");
    console.log("task [task number] > task detail");
    console.log("delete [task number] > delete task");
    console.log("check [task number] > check task");
    console.log("uncheck [task number] > uncheck task");
    console.log("list:outstanding asc | dsc > sort based on date completed");
    console.log("list:completed asc | dsc > sort based on task id");
    console.log("filter [tag name] > sorted by tag");
    return 0;
  }

  showTaskList(arrObjTask) {
    for (let i = 0; i < arrObjTask.length; i++) {
      if (arrObjTask[i].complete === true) {
        console.log(`${arrObjTask[i].id}. ${arrObjTask[i].task} [COMPLETED]`);
      } else {
        console.log(`${arrObjTask[i].id}. ${arrObjTask[i].task}`);
      }
    }
    return 0;
  }

  showCompletedTask(arrObjTask) {
    for (let i = 0; i < arrObjTask.length; i++) {
      if (arrObjTask[i].complete === true) {
        console.log(`${arrObjTask[i].id}. ${arrObjTask[i].task} [COMPLETED]`);
      }
    }
    return 0;
  }

  showUncompletedTask(arrObjTask) {
    for (let i = 0; i < arrObjTask.length; i++) {
      if (arrObjTask[i].complete === false) {
        console.log(`${arrObjTask[i].id}. ${arrObjTask[i].task}`);
      }
    }
    return 0;
  }

  showTaskDetail(arrObjTask, taskNum) {
    console.log(`Detail Task :\n`);
    console.log("id : ", arrObjTask[taskNum].id);
    console.log("Completed status : ", arrObjTask[taskNum].complete);
    console.log("isi Task : ", arrObjTask[taskNum].task);
  }

  showTaskByTag(arrObjTask, tag) {
    console.log(`Task with ${tag} tag :`);
    for (let i = 0; i < arrObjTask.length; i++) {
      console.log(`${arrObjTask[i].id}. ${arrObjTask[i].task}`);
    }
    return 0;
  }

  confirmAddTask(taskName) {
    console.log(`Task ${taskName} added`);
    return 0;
  }

  confirmDeleteTask(taskName) {
    console.log(`Task ${taskName} deleted`);
  }

  confirmCompleteTask(taskName) {
    console.log(`Task ${taskName} completed, Awesome !`);
  }

  confirmUncompleteTask(taskName) {
    console.log(`Task ${taskName} mark as uncomplete`);
  }

  confirmAddedTag(taskName, tagsArr) {
    console.log(`Tagged Task ${taskName} with tags: ${tagsArr.join(",")}`);
  }


  showErrorCommand() {
    console.log("your command is not valid");
    return 0;
  }

  showErrorParameter() {
    console.log("your Parameter is not valid");
    return 0;
  }

}


let control = new Controller();

control.run();








// "command" : ["help", "list", "add", "task", "delete", "complete", "uncomplete"],
