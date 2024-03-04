const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const crypto = require("crypto");

const command = process.argv[2];
switch (command) {
    case "init":
        createGitDirectory();
        break;
    case "cat-file":
        readFileContents();
        break;
    case "hash-object":
        hashObject();
        break;
    case "ls-tree":
        listTreeEntries();
        break;
    case "write-tree":
        writeTree();
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
    const hash = process.argv[3];
    const file = fs.readFileSync(path.join(__dirname, ".git", "objects", hash.slice(0, 2), hash.slice(2)));
    const decompressed = zlib.inflateSync(file);
    const res = decompressed.toString().split("\x00")[1];
    process.stdout.write(res);
}

function hashObject() {
    if (process.argv[3] !== '-w') {
        throw new Error(`Unknown option ${process.argv[3]}`);
    }
    const filePath = process.argv[4];
    const fileContent = fs.readFileSync(filePath);
    const compressedContent = zlib.deflateSync(fileContent);
    const sha = generateSHA1(compressedContent);
    const objectPath = path.join(__dirname, ".git", "objects", sha.slice(0, 2), sha.slice(2));
    if (!fs.existsSync(objectPath)) {
        fs.mkdirSync(path.join(__dirname, ".git", "objects", sha.slice(0, 2)), { recursive: true });
        fs.writeFileSync(objectPath, compressedContent);
        console.log(sha);
    }
}

function generateSHA1(data) {
    const sha1 = crypto.createHash("sha1");
    sha1.update(data);
    return sha1.digest("hex");
}


function listTreeEntries() {
    if (process.argv[3] !== '--name-only') {
        throw new Error(`Unknown option ${process.argv[3]}`);
    }
    const treeSha = process.argv[4];
    const treePath = path.join(__dirname, ".git", "objects", treeSha.slice(0, 2), treeSha.slice(2));
    const treeContent = fs.readFileSync(treePath, "utf-8");
    const entries = parseTree(treeContent);
    entries.sort();
    entries.forEach(entry => {
        console.log(entry);
    });
}

function parseTree(treeContent) {
    const entries = [];
    let pos = 0;
    while (pos < treeContent.length) {
        const spaceIndex = treeContent.indexOf(" ", pos);
        const nullIndex = treeContent.indexOf("\u0000", spaceIndex);
        const mode = treeContent.slice(pos, spaceIndex);
        const name = treeContent.slice(spaceIndex + 1, nullIndex);
        entries.push(name);
        pos = nullIndex + 1;
    }
    return entries;
}

function writeTree() {
    const treeEntries = [];
    const workingDirectory = process.cwd(); // Get the current working directory
    traverseDirectory(workingDirectory, treeEntries, "");
    const treeContent = treeEntries.join("\n") + "\n";
    const compressedContent = zlib.deflateSync(treeContent);
    const sha = generateSHA1(compressedContent);
    const objectPath = path.join(__dirname, ".git", "objects", sha.slice(0, 2), sha.slice(2));
    if (!fs.existsSync(objectPath)) {
        fs.mkdirSync(path.join(__dirname, ".git", "objects", sha.slice(0, 2)), { recursive: true });
        fs.writeFileSync(objectPath, compressedContent);
        console.log(sha);
    }
}

function traverseDirectory(directory, entries, prefix) {
    const files = fs.readdirSync(directory);
    files.forEach(file => {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            entries.push(`040000 ${prefix}${file}`);
            traverseDirectory(filePath, entries, `${prefix}${file}/`);
        } else if (stats.isFile()) {
            const fileContent = fs.readFileSync(filePath);
            const sha = generateSHA1(fileContent);
            fs.writeFileSync(path.join(__dirname, ".git", "objects", sha.slice(0, 2), sha.slice(2)), fileContent);
            entries.push(`100644 blob ${sha} ${prefix}${file}`);
        }
    });
}

function generateSHA1(data) {
    const sha1 = crypto.createHash("sha1");
    sha1.update(data);
    return sha1.digest("hex");
}