const fs = require("fs"); 
//from fs module we are importing the file system module
//fs module provides a way of working with the file system
const path = require("path"); 
// from path module we are importing the path module
//path module provides utilities for working with file and directory paths
const zlib = require("zlib"); 
// from zlib module we can compress and decompress the file,
//why we are using zlib module because we are going to compress the file and store it in the .git/objects folder



const command = process.argv[2];
switch (command) {
    case "init":
        createGitDirectory();
        break;
    case "cat-file":
        readFileContents();
        1
        break;
    default:
        throw new Error(`Unknown command ${command}`);
}
function createGitDirectory() {
    fs.mkdirSync(path.join(__dirname, ".git"), { recursive: true });
    fs.mkdirSync(path.join(__dirname, ".git", "objects"), { recursive: true });
    fs.mkdirSync(path.join(__dirname, ".git", "refs"), { recursive: true });
    fs.writeFileSync(path.join(__dirname, ".git", "HEAD"), "ref: refs/heads/master\n");
    console.log("Initialized git directory");
}
function readFileContents() {
    const hash = process.argv[process.argv.length - 1];
    const file = fs.readFileSync(path.join(__dirname, ".git", "objects", hash.slice(0, 2), hash.slice(2)));
    const decompressed = zlib.inflateSync(file);
    const res = decompressed.toString().split("\x00")[1];
    1
    process.stdout.write(res);
}