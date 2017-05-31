const fs = require("fs")
const Table = require("cli-table");

class Model{
  constructor(){
    this.filename = "./data.json";
  }
  readfile(){
    return JSON.parse(fs.readFileSync(this.filename, 'utf8'));
  }
  writeData(data){
    fs.writeFileSync(this.filename, JSON.stringify(data,null,3));
  }
  
  add(taskWord){
    let data = this.readfile();
    let newdata = {};
    newdata["id"] = 0;
    newdata["task"] = taskWord;
    newdata["completed"] = false;
    newdata["create_at"] = new Date();
    newdata["complete_at"] = "kosong";
    newdata["tags"] = [];
    data.push(newdata);
    data = this.sortId(data);
    this.writeData(data);
    console.log(`Your Data is Added ${newdata.task} and ID is ${newdata.id}`);
  }
  
  sortId(data){
    for (var i = 0; i < data.length; i++) {
      data[i].id = i+1;
    }
    return data;
  }
  
  find(id_search){
    let data = this.readfile();
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if(data[i].id == id_search){
          return data[i];
        }
      }
    }
    return "Maaf Data yang di cari tidak ada";
  }
  
  delete(id){
    let data = this.readfile();
    for (var i = 0; i < data.length; i++) {
      if(data[i].id == id){
        data.splice(i, 1);
        this.writeData(data);
        return `Your Data ID ${id} is Deleted`
      }
    }
    return `Your ID ${id} is not found at data`
  }
  
  UpdateComplete(id){
    let data = this.readfile();
    for (var i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        data[i].completed = true;
        data[i].complete_at = new Date();
        this.writeData(data);
        return `Your Update Complete ${id} is True now`;
      }
    }
    return `Your Update ID ${id} is not Find`;
  }
  
  UpdateUncomplete(id){
    let data = this.readfile();
    for(var i = 0; i < data.length; i++){
      if (data[i].id == id) {
        data[i].completed = false;
        data[i].complete_at = "kosong";
        this.writeData(data);
        return `Your Update uncomplete ${id} is True now`;
      }
    }
    return `Your Update ID ${id} is not Find`;
  }
  
  addTag(id,tags){
    let data = this.readfile();
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        data[i].tags = tags;
        this.writeData(data);
      }
    }
    return `Your Tags added ${id} and ${tags}`;
  }
}

class View{
  vHelper(){
    console.log("=========================================");
    console.log("===========Welcome Todo Helper===========");
    console.log("=================Add Data=================");
    console.log("[1]. to add task : node todo.js add <task>");
    console.log("[2]. to add tags data : node todo.js tags <id> <tags>");
    console.log("[3]. to complete task : node todo.js complete <id>");
    console.log("[4]. to uncomplete task : node todo.js uncomplete <id>");
    console.log("[5]. to delete data : node todo.js delete <id>");
    console.log("\n");
    console.log("=================View Data=================");
    console.log("[1]. to want see the list : node todo.js list");
    console.log("[2]. to want see the list by id : node todo.js task <id>");
    console.log("[3]. to want see the list outstanding : node todo.js list:outstanding");
    console.log("[4]. to want see the list Desceding : node todo.js list:outstanding desc");
    console.log("[5]. to want see the list Asceding : node todo.js list:outstanding asc");
    console.log("[6]. to want see the list Complete : node todo.js list:complete");  
  }
  
  vlist(data){
    let tablelist = new Table({
      head : ['id','task', 'completed', 'create_at', 'complete_at','tags'],
      colWidths : [7,20,20,40,20,20]
    })
    for (var i = 0; i < data.length; i++) {
      tablelist.push([data[i].id,data[i].task,data[i].completed,data[i].create_at,data[i].complete_at,data[i].tags]);
    }
    console.log(tablelist.toString());
  }
  
  vlistbyid(data){
    let tablelist = new Table({
      head : ['id','task', 'completed', 'create_at', 'complete_at', 'tags'],
      colWidths : [7,20,20,40,20,20]
    })
    tablelist.push([data.id,data.task,data.completed,data.create_at,data.complete_at,data.tags]);
    console.log(tablelist.toString());
  }
  
  vSortingDesc(data){
    //Desceding dari yang Kecil sampe yang Besar
    let dataSortingDesc = data.sort((a,b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
    //this.vlist(dataSortingDesc);
    console.log(dataSortingDesc);
  }
  
  vSortingAsc(data){
    //Asceding dari yang Besar sampe yang Kecil
    let dataSortingAsc = data.sort((a,b) =>{
      return new Date(a.created_at) - new Date(a.created_at);
    });
    // this.vlist(dataSortingAsc);
    console.log(dataSortingDesc);
  }
  
  vDelete(word){
    console.log(word);
  }
  
  vSortingComplete(data){
    let dataComplete = []
    for (let i = 0; i < data.length; i++) {
      if (data[i].completed == true) {
        dataComplete.push(data[i]);
      }
    }
    this.vlist(dataComplete);
  }
  
  vFilter(tagWords,data){
    let dataFilter = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].tags.length; j++) {
        if(tagWords == data[i].tags[j])
        dataFilter.push(data[i]);
      }
    }
    this.vlist(dataFilter);
  }
  
}

class Controller{
  constructor(){
    this.Model = new Model;
    this.View = new View;
  }
  
  run(param){
    let data = this.Model.readfile();
    
    switch (param[0]) {
      case "help" :
        this.View.vHelper();
        break;
      case "list" :
        this.View.vlist(data)
        break;
      case "list:outstanding" :
        this.View.vSortingDesc(data);
        break;
      case "list:outstanding asc" :
        this.View.vSortingAsc(data);
        break;
      case "list:outstanding desc" :
        this.View.vSortingDesc(data);
        break;
      case "list:complete" :
        this.View.vSortingComplete(data);
        break;
      case "tags" :
        param.shift();
        let id = param[0];
        param.shift();
        let tagWords = param;
        this.Model.addTag(id,tagWords);
        break;
      case "add" :
        param.shift();
        this.Model.add(param.join(" "));
        break;
      case "task" :
        param.shift();
        this.View.vlistbyid(this.Model.find(param));
        break;
      case "delete" :
        param.shift();
        let datadelete = this.Model.delete(param);
        this.View.vDelete(datadelete);
        //this.View.vlist(data);
        break;
      case "complete" :
        param.shift();
        this.Model.UpdateComplete(param);
        //this.View.vlist(data);
        break;
      case "uncomplete" :
        param.shift();
        this.Model.UpdateUncomplete(param);
      //  this.View.vlist(data);
        break;
      case "filter" :
        param.shift();
        this.View.vFilter(param,data);
        break;
      default:
        console.log(`Something Wrong yout command, please read File`);
    }
  }
  
}

let argv = process.argv.slice(2, process.argv.length);
let ctrl = new Controller;

ctrl.run(argv);