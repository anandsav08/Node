// Serial tasks sequencing uses nesting callbacks
// The code can become messy due to excessive callback nesting.

setTimeout(() => {
    console.log('I execute first.');
    setTimeout(() => {
        console.log('I execute next.');
        setTimeout(() => {
            console.log('I execute last.');
        },100); // last settimeout called 100 ms after the second
    },500); // second setTimeout called 500 ms after the first
},1000);    // outermost 1 second

// Alternatively, We can use 'async' library