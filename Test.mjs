import * as fs from 'fs'
fs.readFile('HelloWorld.txt', {encoding: 'utf8'}, (err, data) => {
    if (err) {
    console.error(err)
    return
    }
    console.log(data); // τα περιεχόμενα του αρχείου
    });