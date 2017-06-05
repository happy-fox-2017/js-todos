class Model{
  constructor(){
    this._list = "";
  }
  
  getList(){
    var fs = require('fs');
    var list = JSON.parse(fs.readFileSync('data.json');
    this._list = list;
    return this._list;
  }
  
  write(task){
    var fs = require('fs');
    fs.writeFile(this.namaFile, JSON.stringify(task), function (err){
      if(err){
        return false;
      }
      return true;
    });
  }
  
  add(pilihan){
    if(pilihan != undefined){
      let addTask = {task: pilihan, completed: ' ', tag: []}
      let tanggal =  (new Date()).toString().split(' ').splice(1,4).join(' ');
      addTask.addedTime = tanggal;
      this.tasks.push(addTask);
    }
  }
  
  delete(pilihan){
    if(pilihan!=undefined){
      this.tasks.splice(option-1, 1);
      jsonfile.writeFileSync(this.namaFile, this.tasks);
    } else {
      return this.tasks;
    }
  }

  completed(pilihan){
    
  }
  
  uncompleted(pilihan){
    
  }
  
  sortedComplete(pilihan){
    
  }
  
  
  
}

class Controller {
  
}

class View {
  constructor() {
    
  }
}
