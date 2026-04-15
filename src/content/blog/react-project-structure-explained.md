---
title: Just Created Your React Project? Don't PANIC—here's every file explained
description: Understand the structure of a React project, how components
  interact, and the flow of data through a React application.
pubDate: 2025-01-29
# heroImage: /assets/courses/react-fundamentals/basic-project-structure.jpg
tags:
  - frameworks
  - javascript
  - frontend
series: react-fundamentals
seriesOrder: 3
---
You just created your first React project. Hopefully using `Vite`

```
npm create vite@latest
```

But you stumbled upon a bunch of weird files and folders.

So you started clicking around, trying to connect the dots, but the more files you opened, the more lost you felt.

We're going to break down every single file, one by one, while building a mental map of how they connect.

## Project Structure Overview

At first glance we can see:

*   Three main folders `src`, `public` and `node_modules`.
    
*   Various config files that we can edit to customize our project.
    

```
hello-world/
├── public/
│   └── vite.svg
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── assets/
│       └── react.svg
├── node_modules/
│   └── ...
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Configuration Files

### .gitignore

The `.gitignore` configuration file is used to tell Git which files and directories should be ignored when staging or committing your changes.

```bash
# All the directories or files listed below will be ignored by git
node_modules
dist
dist-ssr
*.local
```

### package.json

So what about the `package.json` file?

Picture it this way: it's like a library's index—it lists all the top-level dependencies of the project.

As any package that you install may also have its own dependencies, which are known as `peer` or `transitive` dependencies

A `.lock` file is constantly managed and updated by your chosen package manager.

In fact, it's automatically updated every time you install dependencies by running either

```bash
npm install
```

or

```bash
npm install <package-name>
```

```json
{
  "name": "hello-world",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "typescript": "~5.8.3",
    "vite": "^6.3.5"
  }
}
```

In addition to listing top-level dependencies, the `package.json` file also exposes scripts, which are commands that you can run on the terminal, such as:

*   `npm run dev` which starts the development server
    
*   `npm run build` which generates the production-ready bundle.
    

### node\_modules

So if the `package.json` file only lists the top-level dependencies, and the `.lock` file stores their corresponding `transitive` or `peer` dependencies. Where does the actual code of the packages actually live?

That's where the `node_modules` folder comes in!

Think of it as the actual **incubator** of those dependencies.

All the **third-party packages's** codes reside there.

It's also known as the black hole folder in Javascript's memes literature because it simply takes a lot of disk space.

![Node.js as a black hole](/assets/courses/node-js-black-hole.png)

So always double-check that it's present in your `.gitignore` file—you definitely don't want to push that to GitHub.

## TypeScript Configuration

Now that we escaped the black hole, let's walk through these TypeScript configuration files.

```
hello-world/
├── public/
├── src/
├── node_modules/
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.node.json
```

Each one of these files helps you to customize the TypeScript type-checking experience according to your preferences: Think of these files as the environment-specific rules of the type-checking experience offered by TypeScript.

*   `tsconfig.app.json` sets the rules for your `Frontend` or React code.
    
*   `tsconfig.node.json` sets the rules for the `Backend` side or the logic that runs exclusively on the server.
    
*   `tsconfig.json` is the parent file that is read first by the ts-compiler; it holds references to the other two files.
    

## Vite Configuration

### vite.config.ts

We've already customized `Git`, `TypeScript`, and `npm`. But what about our engine—Vite?

That's where the `vite.config.ts` file enters the game.

The file simply exports a `defineConfig` function, which receives a configuration object we can use to fine-tune how `Vite` operates.

Since `Vite` works with most modern frameworks, we need to pass it the `React SWC plugin` to ensure the build process is compatible with `React`.

```tsx
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
});
```

## Application Entry Point

### index.html

`React` is just `Javascript`, and as you may know, `Javascript` can't exist in the browser without `HTML`. Similarly to how an athlete can't move his body without its bones.

`index.html` file is the entry point of the application, it defines the main `HTML` layout or template of all the pages that are served.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

Inside the `<head/>` tag we reference the `/vite.svg` file as a `favicon`. If you look closely, you'll see that it's located within the public folder.

Any static asset-- such as an image or video--stored there is publicly served. You can reference those assets from anywhere in your code using a leading slash (`/`) followed by the path relative to the public folder.

## Source Code Directory

The body of the `index.html` contains a script tag that imports the `main.tsx` file located within the `src` directory.

### The src folder

The `src` folder holds all of our application's `Typescript` code including React components, their corresponding stylesheets and other logic.

### main.tsx - The React Entry Point

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const divDomNode = document.getElementById("root")!
createRoot(divDomNode).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

So where does all the Javascript action happen? -- `main.tsx`. React literally binds itself to the `index.html` here.

Inside the `main.tsx` file, we retrieve the **DOM element** of the `div` with the `id` of `root` using the `document.getElementById('')` method.

```html
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
```

The element is passed to the `createRoot`, a function imported from `react-dom/client`. The function call returns the application's **root object**.

```tsx
const divDomNode = document.getElementById("root")!
const applicationRootObject = createRoot(divDomNode)
 applicationRootObject.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

After that, we make use of the `render` method of the **root object** to display the `<App/>` component -- Where an example counter component code resides.

> Instead of passing `<App/>` directly to the render method, we wrap it in a `StrictMode` component because it makes catching bugs easier in dev mode.

## Development Server and Testing

Now that we explained briefly, how `React` wires itself and injects the Counter example code defined inside the `<App/>` component inside the `<div/>` with the id of `root`. Let's start our app to see it happening!

Let's open our terminal, type `npm or pnpm run dev` in order to start the development server, open your browser, and then head straight to `http://localhost:5173`.

Once you've done so, you'll stumble upon this page.

![Vite Dev Server Running](/assets/courses/vite-server-example-page.png)

Now, in order to confirm that the `main.tsx` file is really injecting the `<App/>` component inside the `div` with the `id` of `root`. Let's inspect the page.

![Inspect the Root Div](/assets/courses/inspect-root-div.png)

Great! All the Counter's `HTML` code is here. And it gets even better the `Html` is updating whenever we increment the counter. React is indeed Reacting, and we are reacting to it! Isn't that crazy?

## Conclusion

There is one missing piece that we didn't cover yet in this article.

Despite going through the project's files and folders and explaining how React injects the `<App/>` component into the `<div/>`, we haven't yet discussed what a React component actually is. We still need to explore how components are defined and why they are considered the fundamental building blocks of any `React` application that you can see out there.

Stick around for the next article, where we will address these topics in depth. Until then, Happy coding!