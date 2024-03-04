## JGit - JavaScript Git Implementation

JGit is a simple implementation of Git using JavaScript. It was created to learn Git internals and provides basic functionalities similar to Git command-line tools.

### Features

- **Initialization**: Initialize a Git directory.
- **Read File Contents**: Read the contents of a file in the Git repository.
- **Hash Object**: Generate SHA-1 hash for a file and store it in the Git object database.
- **List Tree Entries**: List entries in a Git tree object.
- **Write Tree**: Write the current state of the working directory to a tree object.
- **Commit Tree**: Create a commit object with a specified tree, message, and optional parent.
- **Clone Repository**: Clone a repository from a given URL to a specified directory.

### Usage

To use JGit, run the script with one of the following commands:

- `init`: Initialize a Git directory.
- `cat-file <hash>`: Read the contents of a file in the Git repository.
- `hash-object -w <file>`: Generate a SHA-1 hash for a file and store it in the Git object database.
- `ls-tree --name-only <tree-hash>`: List entries in a Git tree object.
- `write-tree`: Write the current state of the working directory to a tree object.
- `commit-tree <tree-hash> [-p <parent-commit>] -m <message>`: Create a commit object with the specified tree, parent, and message.
- `clone <repository-url> <target-directory>`: Clone a repository from the given URL to the specified directory.

### Example

```bash
node index.js init
node index.js cat-file <hash>
node index.js hash-object -w <file>
node index.js ls-tree --name-only <tree-hash>
node index.js write-tree
node index.js commit-tree <tree-hash> [-p <parent-commit>] -m <message>
node index.js clone <repository-url> <target-directory>
```

### Dependencies

JGit uses the following built-in Node.js modules:

- `fs`: File system operations.
- `path`: Path-related operations.
- `zlib`: Compression and decompression.
- `crypto`: Cryptographic operations.
- `https`: HTTP requests for cloning repositories.

### References

[Git Internals(git-scm.com)](https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain)

### License

This project is licensed under the MIT License.