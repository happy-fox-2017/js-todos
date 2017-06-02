"use strict"

let fs = require("fs");

// Models
class Model {
  constructor() {
     this.filename = "./data.json";
  }
   readData() {
    return JSON.parse(fs.readFileSync(this.filename, "utf8"));
  }

   writeData(data) {
    fs.writeFileSync(this.filename, JSON.stringify(data, null, 3));
  }

   sortId(data) {
    for (let i = 0; i < data.length; i++) {
      data[i].id = i+1;
    }
    return data;
  }

   add(task) {
    let data = this.readData();
    let object = {
      "id": 0,
      "task": task,
      "completed": false,
      "created_at": new Date(),
      // "completed_at": "",
      "tags": []
    };
    data.push(object);
    data = this.sortId(data)
    this.writeData(data);
    console.log(`Added ${object.task} to your TODO list...`);
  }

  addTag(id, tags) {
    let data = this.readData();
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        data[i].tags = tags;
        console.log(`Tagged task ${data[i].task} with tags: ${data[i].tags}`);
        break;
      }
    }
    this.writeData(data);
  }

  deleting(id) {
    let data = this.readData();
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        data.splice(i, 1);
        break;
      }
    }
    data = this.sortId(data)
    this.writeData(data);
    console.log(`Deleted data with id: ${id} from your TODO list...`);
  }

  Complete(id) {
    let data = this.readData();
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        data[i].completed = true;
        data[i].completed_at = new Date();
        break;
      }
    }
    this.writeData(data);
  }

  uncomplete(id) {
    let data = this.readData();
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        data[i].completed = false;
        break;
      }
    }
    this.writeData(data);
  }

  sortAsc(data) {
    let data2 = data.sort((a,b) => {
      return new Date(a.created_at) - new Date(b.created_at);
    });
    data2 = this.sortId(data2);
    return data2;
  }

 sortDsc(data) {
    let data2 = data.sort((a,b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
    data2 = this.sortId(data2);
    return data2;
  }

  sortBy(data, sortType) {
   if (sortType == "asc") {
     let data2 = this.sortAsc(data);
     return data2;
   }
   else if (sortType == "desc") {
     let data2 = this.sortDsc(data);
     return data2;
   }
   else {
     let data2 = this.sortAsc(data);
     return data2;
   }
 }

  listOutstanding(sortType) {
   let data = this.readData();
   if (data.length > 0) {
     let data2 = this.sortBy(data, sortType);
     for (let i = 0; i < data.length; i++) {
       console.log(`${data2[i].id}. [${data2[i].completed ? "X" : " "}] ${data2[i].task} Date created: ${data2[i].created_at}`);
     }
   }
   else {
     console.log("Empty tasks");
   }
 }


   listCompleted(sortType) {
    let data = this.readData();
    if (data.length > 0) {
      let data2 = this.sortBy(data, sortType);
      for (let i = 0; i < data.length; i++) {
        if (data2[i].completed === true) {
          console.log(`${data2[i].id}. [${data2[i].completed ? "X" : " "}] ${data2[i].task} Date completed: ${data2[i].completed_at}`);
        }
      }
    }
    else {
      console.log("Empty tasks");
    }
  }


}


// View
class View {
  constructor() {

  }
  help() {
    let showArr = ["$ node todo.js # will call help", "$ node todo.js help",
    "$ node todo.js list", "$ node todo.js add <task_content>",
    "$ node todo.js task <task_id>", "$ node todo.js delete <task_id>",
    "$ node todo.js complete <task_id>", "$ node todo.js uncomplete <task_id>",
    "$ node todo.js list:outstanding asc|desc", "$ node todo.js list:completed asc|desc",
    "$ node todo.js tag <task_id> <tag_name_1> <tag_name_2> ... <tag_name_N>",
    "$ node todo.js filter:<tag_name>"];
    console.log(showArr.join("\n"));
  }

   list(data) {
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        console.log(`${data[i].id}. [${data[i].completed ? "X" : " "}] ${data[i].task}`);
      }
    }
    else {
      console.log("Empty tasks");
    }
  }



}

// Controller
class Controller {
  constructor() {
    this.model = new Model();
    this.view = new View();
  }

  filter(tag) {
   let data = this.model.readData();
   for (let i = 0; i < data.length; i++) {
     for (let j = 0; j < data[i].tags.length; j++) {
       if (data[i].tags[j] === tag) {
         console.log(`${data[i].id}. ${data[i].task} [${data[i].tags}]`);
         break;
       }
     }
   }
 }

 readTask(id) {
  let data = this.model.readData();
  if(data.length > 0){
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        console.log(`${data[i].id}. ${data[i].task}`);
      }
    }
  }
 }

   run(param) {
    switch (param[0]) {
      case "help":
        this.view.help();
        break;
      case "list":
        this.view.list(this.model.readData());
        break;
      case "list:outstanding":
        this.model.listOutstanding(param[1]);
        break;
      case "list:completed":
        this.model.listCompleted(param[1]);
        break;
      case "add":
        param.shift();
        this.model.add(param.join(" "));
        break;
      case "task":
        this.readTask(param[1]);
        break;
      case "delete":
        this.model.deleting(param[1]);
        break;
      case "complete":
        this.model.Complete(param[1]);
        break;
      case "uncomplete":
        this.model.uncomplete(param[1]);
        break;
      case "tag":
        let paramCopy = param.slice("");
        paramCopy.shift();
        paramCopy.shift();
        this.model.addTag(param[1], paramCopy);
        break;
      case "filter:":
        this.filter(param[1]);
        break;
      default:
        this.view.help();
        break;
    }
  }
}

// Driver code
let arg = process.argv.slice(2, process.argv.length);  // tampung index ke 2 di dalam variable
let controller = new Controller();
controller.run(arg);
