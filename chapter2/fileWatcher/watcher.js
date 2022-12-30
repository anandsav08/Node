const fs = require('fs');
const events = require('events');

class Watcher extends events.EventEmitter{
    constructor(watchDir,processedDir){
        super();
        this.watchDir = watchDir;
        this.processedDir = processedDir;
    }

    watch(){
        fs.readdir(this.watchDir,(err,files)=>{
            if(err) throw err;
            for(var index in files){
                this.emit('process',files[index]);
            }
        })
    }

    start(){
        fs.watchFile(this.watchDir, ()=>{
            this.watch();
        })
    }  
}

module.exports = Watcher;

const watchDir = 'watchDir';
const processedDir = 'processedDir';
const watcher = new Watcher(watchDir,processedDir);

watcher.on('process',(file)=>{
    const watchFile = `${watchDir}/${file}`;
    const processedfile = `${processedDir}/${file.toLowerCase()}`;
    fs.rename(watchFile,processedfile,err=>{
        if(err) throw err;
    });
});
watcher.start();