
class Model {
  constructor(file) {
    this.file = file;
    // this.readfile = [{"task":"Makan","completed":"[]","created_date":"Fri Jun 02 2017 12:45:40 GMT+0700 (WIB)"}]
    this.readfile = json.readFileSync(this.file);
  }

  addList(input) {
    if (input !== "" || input !== undefined) {
      let date = new Date()
      let added = {id: `${this.readfile.length+1}`,task: input, completed: '[]', created_date: date.toString(),tag:[]};
      this.readfile.push(added);
      json.writeFileSync(this.file, this.readfile)
    }
  }

  deleteList(input) {
    for (let i=0; i<this.readfile.length;i++) {
      if (input === this.readfile[i].task) {
        this.readfile.splice(i,1);
        json.writeFileSync(this.file, this.readfile)
      }
    }
  }

  completeList(input) {
    for (let i=0; i<this.readfile.length;i++) {
      if (input === this.readfile[i].id) {
        this.readfile[i].completed = '[X]'
        json.writeFileSync(this.file, this.readfile)
      }
    }
  }

  uncompleteList(input) {
    for (let i=0; i<this.readfile.length;i++) {
      if (input === this.readfile[i].id) {
        this.readfile[i].completed = '[]'
        json.writeFileSync(this.file, this.readfile)
      }
    }
  }

  order(input) {
    let array = []
    for (var i = 0; i < this.readfile.length; i++) {
      if(this.readfile[i].completed === '[]') {
        array.push(this.readfile[i])
      }
      // console.log(array);
    }
    if (input === 'asc') {
      array.sort(function(a, b){return new Date(a.created_date).getTime() - new Date(b.created_date).getTime()});
      // json.writeFileSync(this.file, array)
    } else if (input === 'desc') {
      array.sort(function(a, b){return new Date(b.created_date).getTime() - new Date(a.created_date).getTime()});
    }
    // json.writeFileSync(this.file, this.readfile)
    return array
  }

  tag(input) {
    for (let i = 0; i < this.readfile.length; i++) {
      if (this.readfile[i].id === input) {
        if (!this.readfile[i].tag) {
          this.readfile[i]['tag'] = []
        }
        for (let j = 4; j < argv.length; j++) {
          this.readfile[i].tag.push(argv[j])
        }
        json.writeFileSync(this.file, this.readfile)
        // console.log(this.readfile[i]);
        return this.readfile[i]
      }
    }
  }

  filterTags(input) {
    let filtered = []
    for (let i = 0; i < this.readfile.length; i++) {
      for (let j = 0; j < this.readfile[i].tag.length; j++) {
        if (this.readfile[i].tag[j] == input) {
          filtered.push(this.readfile[i])
        }
      }
    }
    return filtered
  }
}

class Controller {
  constructor() {
    this.model = new Model('./data.json')
    this.view = new View()
  }

  processing(input) {
  let value = argv[3];
  let option = argv[4]
    if (input === undefined || input === "help") {
      this.view.showHelp();
    } else if (input === "list") {
      this.view.showList(this.model.order());
    } else if (input === "add") {
      this.model.addList(value)
      this.view.viewAdded(value);
    } else if (input === "delete") {
      this.model.deleteList(value);
      this.view.viewDeleted(value);
    } else if (input === "complete") {
      this.model.completeList(value);
      this.view.viewCompleted(value);
    } else if (input === "uncomplete") {
      this.model.uncompleteList(value);
      this.view.viewUncompleted(value);
    } else if (input === "list:outstanding") {
      this.view.viewOrder(this.model.order(value))
    } else if (input === "list:completed") {
      this.view.listCompleted(this.model.readfile)
    } else if (input === "tag") {
      this.view.tag(this.model.tag(value))
    } else if (input.slice(0,6) === "filter") {
      this.view.viewFiltered(this.model.filterTags(input.slice(7)))
    } else {
      console.log('Can\'t do anything with that');
      console.log('Here is the options:');
      this.view.showHelp()
    }
  }
}

class View {
  constructor() {
    // this.controllers = new Controller()
    this.model = new Model('./data.json')
    // this.model = this.controllers.model;
  }

  showHelp() {
    console.log("============ Help ============");
    console.log("\"list\" to see your todo(s)");
    console.log("\"add\" to add a list");
    console.log("\"delete\"  to erase one of your todo");
    console.log("\"complete\" if you have completed one task");
    console.log("\"uncomplete\" if you want to undo the task");
    console.log("\"list:outstanding\" + asc/desc to order your todo");
    console.log("\"list:completed\"  to see your todo that is completed");
    console.log("\"tag\" to add tag to your list");
    console.log("\"filter:tag\" to see list with certain tag");

  }

  showList(input) {
    if (input.length == 0) {
      console.log('You don\'t have anything to do');
    } else if(input.length == 1) {
      console.log('Your to do list:');
      console.log(`${input[0].id} ${input[0].completed} ${input[0].task}
   created: ${input[0].created_date}`);
    } else {
      console.log('Your to do lists:');
      for (let i = 0; i < input.length; i++) {
        console.log(`${input[i].id}. ${input[i].completed} ${input[i].task}
   created: ${input[i].created_date}`);
      }
    }
  }

  viewAdded(input) {
    if (input === "" || input === undefined) {
      console.log("Insert the name of your list");
    } else {
      console.log(`"${input}" has been added to your list`);
    }
  }

  viewDeleted (input) {
    if (input === "" || input === undefined) {
      console.log("Specify the list name that you want to delete");
    } else {
      console.log(`"${input}" has been deleted from your list`);
    }
  }

  viewCompleted (input) {
    if (input === "" || input === undefined) {
      console.log("Specify the list name that has been completed");
    } else {
      console.log(`"${input}" has been marked completed`);
    }
  }

  viewUncompleted (input) {
    if (input === "" || input === undefined) {
      console.log("Specify the list name that you want to undo");
    } else {
      console.log(`"${input}" has been marked uncompleted again`);
    }
  }

  viewOrder(input) {
    for (let i = 0; i < input.length; i++) {
      console.log(`${input[i].id}. ${input[i].completed} ${input[i].task}
   created: ${input[i].created_date}`);
    }
  }

  listCompleted(input) {
    if (argv[3] === 'asc') {
      console.log('masuk');
      input.sort(function(a, b){return new Date(a.created_date).getTime() - new Date(b.created_date).getTime()});
      // json.writeFileSync(this.file, array)
    } else if (argv[3] === 'desc') {
      input.sort(function(a, b){return new Date(b.created_date).getTime() - new Date(a.created_date).getTime()});
    }
    for (let i = 0; i < input.length; i++) {
      if (input[i].completed === '[X]') {
        console.log(`${input[i].id}. ${input[i].completed} ${input[i].task}
   created: ${input[i].created_date}
   tag: ${input[i].tag.join(', ')}`);
      }
    }
  }

  tag(input) {
    let str = ''
    for (let j = 4; j < argv.length; j++) {
      str+= `, ${argv[j]}`
    }
    console.log(`Added task "${input.task}" with tag(s): ${str.slice(2)}`);
  }

  viewFiltered(input) {
    for (var i = 0; i < input.length; i++) {
      console.log(`${input[i].id}. ${input[i].completed} ${input[i].task}
   created: ${input[i].created_date}
   tag: ${input[i].tag.join(', ')}`);
    }
  }
}

let json = require('jsonfile');
let argv = process.argv;
let start = new Controller();
start.processing(argv[2]);