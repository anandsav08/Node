/*
Each task exists in the array as a function. 
When a task has completed, the task should call a handler function to indicate error status and results. 
The handler function in this implementation will halt execution if there’s an error. 
If there isn’t an error, the handler will pull the next task from the queue and execute it.

To demonstrate an implementation of serial flow control, 
you’ll make a simple application that displays a single article’s title and URL from a randomly chosen RSS feed. 
The list of possible RSS feeds is specified in a text file. 
The application’s output will look something like the following text:
```
    Of Course ML Has Monads!
    http://lambda-the-ultimate.org/node/4306

```
*/

const fs = require('fs');
const request = require('request');
const htmlparser = require('htmlparser');
const { nextTick } = require('process');
const configFilename = './rss_feeds.txt'

function checkForRSSFile(){
    fs.exists(configFilename,(exists)=>{
        if(!exists)
            return next(new Error(`Missing RSS file: ${configFilename}`));
        next(null,configFilename);
    })
}

function readRSSFile(configFilename){
    fs.readFile(configFilename,(err,feedList) => {
        if(err) return next(err);
        feedList = feedList
            .toString()
            .replace(/^\s+|\s+$/g,'')
            .split('\n');

        const random = Math.floor(Math.random() * feedList.length);
        next(null,feedList[random]);
    })
}

function downloadRSSFeed(feedUrl){
    request({uri:feedUrl},(err,res,body)=>{
        if(err) return next(err);
        if(res.statusCode !== 200){
            return next(new Error('Abnormal response status code'));
        }
        next(null,body);
    })
}

function parseRSSFeed(rss){
    const handler = new htmlparser.RssHandler();
    const parser = new htmlparser.Parser(handler);
    parser.parseComplete(rss);
    if(!handler.dom.items.length)
        return next(new Error('No RSS items found'));
    const item = handler.dom.items.shift();
    console.log(item.title);
    console.log(item.link);
}

// Adds each task to be performed to an array in execution order
const tasks = [
    checkForRSSFile,
    readRSSFile,
    downloadRSSFeed,
    parseRSSFeed
]

function next(err,result){  // A function called next; executes each task
    if(err) throw err;

    // Next task comes from array of tasks
    const currentTask = tasks.shift();
    if(currentTask){
        currentTask(result);    // Execute current Task
    }
}

// starts serial execution of tasks
next();


