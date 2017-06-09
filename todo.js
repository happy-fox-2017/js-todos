'use strict'
const fs = require('fs')

class Model{
  constructor(){
    this.file = 'data.json'
    this.data = JSON.parse(fs.readFileSync(this.file,'UTF-8'))
  }
  write(data){
    fs.writeFileSync(this.file,JSON.stringify(data),'UTF-8')  
  }
}

class Controller{
  constructor(input){
    this.input = input
    this.model = new Model()
    this.view = new View()
  }
  
  run(){
    switch(this.input[2]){
      case 'help' : this.view.help();break
      case 'list' : this.list(this.model.data);break
      case 'add'  : this.add(this.input.slice(3,this.input.length).join(' '));break
      case 'task' : this.task(this.input[3],this.model.data);break
      case 'delete': this.delete(this.input[3],this.model.data);break
      case 'complete': this.complete(this.input[3],this.model.data);break
      case 'uncomplete': this.uncomplete(this.input[3],this.model.data);break
      case 'list:outstanding':this.listoutstanding(this.input[3],this.model.data);break
      case 'list:completed': this.listcompleted(this.input[3],this.model.data);break
      case 'tag': this.tag(this.input[3],this.input[4],this.input[5],this.model.data);break
      case 'filter': this.filter(this.input[3],this.model.data);break
      default : this.view.help();break 
    }
  }
  
  add(todo){
    let id = 0;
    if (this.model.data.length===0){
      id = 1;
    }else{
      id = this.model.data[this.model.data.length-1].id+1;
    }
    this.model.data.push({
      'id': id,
      'task': todo,
      'status': 'uncomplete',
      'created_at': new Date().toUTCString(),
      'tag': [],
      'completed_at': ' '
    })
    this.view.add(this.model.data[this.model.data.length-1]) 
    this.model.write(this.model.data)
  }
  
  list(data){
    if(!data || data.length === 0){
      this.view.kosongtodo()
    }
    else{
    for(let i = 0; i < data.length;i++){
    if(data[i].status === 'complete'){
        this.view.list(data[i],'[X]')
      }
      else{
        this.view.list(data[i],'[ ]')
        }
      }
    }
  }
  
  task(id,data){
    for(let i = 0; i < data.length; i++){
      if(data[i].id.toString() === id.toString()){
        this.view.task(data[i])
      }
    }
  }
  
  delete(id,data){
    if(data.length === 0){
      this.view.kosongdelete()
    }
    if (id> this.model.data[this.model.data.length-1].id || id < this.model.data[0].id){
      this.view.kosongdelete()
    }
     
    for(let i = 0;i < data.length; i++){
      if(data[i].id.toString() === id.toString()){
        this.view.delete(data[i].task)
        data.splice(i,1)
        this.model.write(data)
      }
    } 
  }
  
  complete(id,data){
    for(let i = 0; i < data.length; i++){
      if(data[i].id.toString() === id.toString() && data[i].status !== 'complete'){
        this.view.complete(data[i].task)
        data[i].status = 'complete'
        data[i].completed_at = new Date().toUTCString()
        this.model.write(data)
      }
      else if (data[i].id.toString() === id.toString() && data[i].status === 'complete'){
        this.view.completealready()
      }
    }
  }
  
  uncomplete(id,data){
    for(let i = 0; i < data.length; i++){
      if(data[i].id.toString() === id.toString() && data[i].status !== 'uncomplete'){
        this.view.uncomplete(data[i].task)
        data[i].status = 'uncomplete'
        this.model.write(data)
      }
      else if (data[i].id.toString() === id.toString() && data[i].status === 'uncomplete'){
        this.view.uncompletealready()
      }
    }
  }
  
  listoutstanding(order,data){
    let undone = []
    for(let i = 0; i < data.length; i++){
      if(data[i].status === 'uncomplete'){
        undone.push(data[i])
        this.view.listoutstanding(undone)
      }
    }
    data = undone
    console.log(data);
    switch (order) {
      case 'asc': data.sort((a,b) => (b.created_at) < (a.created_at));break
      case 'dsc':data.sort((a,b) => (a.created_at) < (b.created_at));break       
      default: data.sort((a,b) => (b.created_at) < (a.created_at));break        
    }
    if(data.length === 0){
      this.view.kosongtodo()
    }
    else{
    this.list(data)
    }
  }
  
  listcompleted(order,data){
    let done = []
    for(let i = 0; i < data.length; i++){
      if(data[i].status === 'complete'){
        done.push(data[i])
        this.view.listcompleted(done)
      }
    }
    data = done
    switch(order){
      case 'asc': data.sort((a,b) => new Date(b.completed_at) < new Date(a.completed_at));break
      case 'dsc': data.sort((a,b) => new Date(a.completed_at) < new Date(b.completed_at));break
      default: data.sort((a,b) => new Date(b.completed_at) < new Date(a.completed_at));break
    }
    if(data.length === 0){
      this.view.kosongcom()
    }
    else{
    this.list(data)
    }
  }
  
  tag(id,name1,name2,data){
    for(let i = 0; i < data.length; i++){
      if(data[i].id.toString() === id.toString()){
        this.view.tag(data[i].task,name1,name2)
        data[i].tag.push(name1,name2)
        this.model.write(data)
      }
    }  
  }
  
  filter(tag,data){
    let arr = []
    for(let i = 0; i < data.length; i++){
      for(let j = 0; j < data[i].tag.length; j++){
        if(tag === data[i].tag[j]){
          arr.push(data[i])    
        }
      }
    }
    if(arr.length === 0){
      this.view.notag(tag)
    }
    else{
      this.view.filter(tag,arr)
      this.list(arr)
    }
  }
}

class View{
  constrcutor(){    
  }
  
  help(){
    console.log(`                     HELP MENU
      =======================================
      - node todo.js help
      - node todo.js list
      - node todo.js add <task content>
      - node todo.js task <id>
      - node todo.js delete <id>
      - node todo.js complete <id>
      - node todo.js uncomplete <id>
      - node todo.js list:outstanding asc/dsc
      - node todo.js list:completed asc/dsc
      - node todo.js tag <id> <name1> <name2>
      - node todo.js filter <tag_name>`)
  }
  add(task){
    console.log(`${task.task} Added! Task ID: ${task.id}`)
  }
  
  delete(task){
    console.log(`${task} Deleted!`)
  }
  
  list(data,status){
    console.log(`${data.id}. ${status} ${data.task}`)
  }
  
  complete(task){
    console.log(`${task} Completed!`)
  }
  
  uncomplete(task){
    console.log(`${task} Uncompleted!`)
  }
  
  task(data){
    console.log(`\nID: ${data.id}\nStatus: ${data.status}\nTask: ${data.task}\nCreated_at: ${data.created_at}\nTags: ${data.tag}\nCompleted_at: ${data.completed_at}`)
  }
  
  tag(task,name1,name2){
    if(name1 && name2){
    console.log(`${name1} and ${name2} added to ${task}!`)
    }
    else{
    console.log(`${name1} added to ${task}!`)
    }
  }
  
  listoutstanding(data){
    if(data.length > 1){
    this.clean()
    console.log(`You have ${data.length} todos that are not completed yet`)
    }
    else{
    console.log(`You have ${data.length} todo that is not completed yet`)  
    }
  } 
  
  listcompleted(data){
    if(data.length > 1){
    this.clean()
    console.log(`You have ${data.length} todos that already completed`)
    }
    else{
    console.log(`You have ${data.length} todo that already completed`)  
    }
  }  
  notag(tag){
    console.log(`There is no todo that match tag '${tag}' `)
  }
  
  filter(tag,data){
    if(data.length > 1){
    console.log(`There are '${data.length}'todos match for tag '${tag}'`)
    }
    else if(data.length === 1){
      console.log(`There is ${data.length} todo match for tag '${tag}' `)
    }
  }
  
  completealready(){
    console.log('This task already completed!')
  }
  
  uncompletealready(){
    console.log('This task already uncompleted!')
  }
  
  kosongtodo(){
    console.log('No todo list yet! please make one!')
  }
  
  kosongdelete(){
    console.log('There is nothing to delete!')
  }
  
  kosongcom(){
    console.log(`There is no completed todo yet!`)
  }
  
  clean(){
      console.log("\x1B[2J")
  }
}
let argv = process.argv
let todos = new Controller(argv)
todos.run()
