const asyncFunc = (callback) => {
    setTimeout(callback,200);
}

let color = 'blue';

// Color value is changed to green prior to calling console.log asynchronously

// asyncFunc(()=>{
//     console.log(`The color is ${color}`);
// })
// color = 'green';

// Freeze the contents of color variable, using a wrapper anonymous function

(color => { // color is now in the local scope of the asynchronous function.
    asyncFunc(() => {
        console.log('The color is ',color);
    })
})(color);

color = 'green'; // This assignment doesn't affect the local color passed to the asynFunc