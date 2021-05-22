# Reference Code for Verifier UI

This directory contains some code to help you started with writing
a small Web-based UI for your verifier, similar to [rise4fun.com/dafny](https://rise4fun.com/dafny).

### Prerequisites

 * Python 3.x
 * Flask (`pip install flask`)
 * Node.js and NPM

### Build & Run

```sh
npm i
npm run build
npm start
```

Then navigate to http://127.0.0.1:5000.

The Flask development server automatically restarts and reloads when you change Python files.
To also compile JavaScript/TypeScript files automatically, run (preferrably in a separate shell):
```sh
npx webpack -w
```
