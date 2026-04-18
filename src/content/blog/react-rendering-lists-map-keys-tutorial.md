---
title: "React Rendering Lists Tutorial: Complete Guide to Map Method and Keys"
description: Learn how to efficiently render lists of data in React using array
  methods and keys for optimal performance.
pubDate: 2025-03-12
# heroImage: /assets/courses/react-fundamentals/rendering-lists.jpg
tags:
  - javascript
  - frontend
  - rendering
series: react-fundamentals
seriesOrder: 8
---
## Introduction

In many situations you'll want to **display multiple** items that **share the same structure and styling** based on a collection of predefined data that might come from **various sources,** including **external APIs**, offline browser storages such as **IndexedDB** or **LocalStorage,** and so on.

Even though the data might come from **various sources,** it always ends up in a **JavaScript array**.

So in this article we will learn **how to render a list of components** or just raw **JSX** codes given an **array of data**.

And then we will understand how **React** can track those **rendered components** via something called **keys**. So without any further ado, let's dive in.

# Code Repetition Problem

Take a look at this code.

```tsx
<ol>
  <li style={{...}} >Item 1</li>
  <li style={{...}}>Item 2</li>
  ...
  <li style={{...}} >Item N</li>
</ol>
```

Writing code like this is the fastest way to make your project unmaintainable.

Let's say that you needed to **render a list of items** that have the **same styling and structure** but only **differ in their content**.

## Solution: How to Map an Array of Item into JSX Code.

Instead of writing that whole code and repeating ourselves.

We can just define an **array** of strings that will host all of our data. And then use the `array` built-in `map` method to transform each element in the **array** into a different shape.

This is done by passing a **callback function** that defines this transformation.

The callback function will be written as follows: we take the function's argument, and then we return this `JSX` code that represents the targeted markup of each array element.

In our case we want to convert each item in the array from a string to JSX code, which consists of the `<li>` tags wrapping the string.

```tsx
function App(){
  const  items = ["item 1","item2","item 3"]
  const JSXItems =  items.map(item=>(<li>{item}</li>))
  // [<li>Item 1</li>,<>Item 2</li>,<>Item 3</li>]

  return (
    /*...code*/
  )
}
```

> Keep in mind, that the map method keeps the original array intact, and returns a new array that we can store in a newly created variable.

## How to Render an Array of JSX Codes?

Okay, now what? We've got an array of JSX elements. But how can we render that?

`React` can only render **two things**: `JSX` code or an `array` oa code.e can safely render the content of the new array directly in the JSX through the curly bracket syntax.

The result will look like this.

```tsx
function App(){
  const  items = ["item 1","item2","item 3"]
  const JSXItems =  items.map(item=>(<li>{item}</li>)) // array of JSX elements.
  // [<li>Item 1</li>,<>Item 2</li>,<>Item 3</li>]

  return (
    <ol>
    {JSXItems}
    </ol>
  )
}
```

## A Richer Example: Rendering an Array of Todos!

Now that we've got the basics, let's deepen our understanding by walking through a more involved example.

Picture this: we have an array of todo objects, each one possessing the following attributes:

*   An **ID** that uniquely identifies each object.
    
*   A `todo name`, `description` and a `boolean` variable representing whether a given todo is completed or not.
    

```tsx
const todos = [
  {
    id: 1,
    name: "todo 1",
    description: "todo 1 description",
    completed: false,
  },
  {
    id: 2,
    name: "todo 2",
    description: "todo 2 description",
    completed: true,
  },
  {
    id: 3,
    name: "todo 3",
    description: "todo 3 description",
    completed: false,
  },
];
```

Similar to our previous example, we can use the `map()` array method to transform this array of objects into an array of JSX elements. In this snippet, each element represents the JSX structure for an individual todo item.

```tsx
const todosJSX =  todos.map(item=>(
      <div>
        <h2>{item.name}</h2>
        <p>{item.description}</p>
        <p>{item.completed ? "✅"  : "❌"}</p>
      </div>
))
```

Now let's just render the array in the **App** component's **JSX**.

```tsx
function App(){
  // ...code for todos
const todosJSX =  todos.map(item=>(
      <div>
        <h2>{item.name}</h2>
        <p>{item.description}</p>
        <p>{item.completed ? "✅"  : "❌"}</p>
      </div>))
  return (
    <div>
      {todosJSX}
    </div>

  )
}
```

That's how easy it is to render an array of objects. It's that simple; just map it to **JSX** elements, and you're good to go 😄.

Now as the JSX returned by the **map's callback function** is getting quite long and messy, let's substitute it or move it into its own react component

First, create a **"TodoItem"** component, receiving the necessary props and returning the previous JSX code.

```tsx
function TodoItem({name,description,completed}){

  return (
      <div>
        <h2>{name}</h2>
        <p>{description}</p>
        <p>{completed ? "✅"  : "❌"}</p>
      </div>
  )
}
```

Then let's call it in the map's **callback function** and pass the props by spreading the todo object instead of passing each attribute separately.

```tsx
function App(){
  // ...code for todos
const todosJSX =  todos.map(todo=>(<TodoItem {...todo}/>))
  return (
    <div>
      {todosJSX}
    </div>

  )
}
```

> As you can see bellow spreading the todo object makes the component more readable and maintainable.

```tsx
const todosJSX =  todos.map(todo=>(<TodoItem title={todo.title} description={todo.description} completed={todo.completed} />)) 

// VS
const todosJSX =  todos.map(todo=>(<TodoItem {...todo}/>)) // ✅ Better and more concise
```

Now our code is much cleaner and easier to read.

# How can React track many rendered components?

So what are keys? Why are they so important to React?

When calling the same component twice or rendering an array of components, it's important to pass a unique key to each component.

In fact, if you try to render a list of items without passing the **key** prop into each one. The following warning gets displayed in your browser console.

> ⚠️ **React Warning:** Each child in a list should have a unique "key" prop.

When using the `map` method to render an `array` of items, we should always pass a `string` or a `number` `key` prop that **uniquely identifies each item among other items in the array**.

The **keys** help **React** to understand which array item each component corresponds to. Or you can think of it as a way to link your array data to the rendered components or **JSX** items.

That may seem not important when the **array** is not changing. But if it **gets mutated or changed** by either **sorting it, deleting or inserting an item, and so on**.

**React** can have a hard time tracking items because, **by default, it's using the item's array index** as a **key,** which is obviously not stable when deleting or inserting items or sorting the array.

The **keys should also be stable**, or in other terms, **they should not change every time the component gets rendered** in order to optimize updating the DOM tree, and therefore your application's performance when displayed on the user browser.

The easiest way to make sure that the **ID** is stable is to **include it in the data itself, as we did previously when defining the todo list item object**.

Right inside the **"map's"** callback function, let's assign the `todo.id` attribute to the component's key prop.

```tsx
const todosJSX =  todos.map(todo=>(<TodoItem key={todo.id} {...todo}/>)) 
```

The same thing applies if **JSX** code was returned; just pass the `key` prop to the upper wrapping element as shown below.

```tsx
const todosJSX =  todos.map(item=>(
      <div key={todo.id}>
        <h2>{item.name}</h2>
        <p>{item.description}</p>
        <p>{item.completed ? ✅  : ❌}</p>
      </div>))
```

An interesting case that we should absolutely highlight here is when returning multiple **JSX** items, we're required to use the fragment syntax because JSX does not allow returning multiple children, as you might know if you've read the previous [JSX](./jsx-tutorial-react-javascript-guide.md) article.

If you have tried to set the prop **key** to the shorthand version of the **React** fragment syntax, your editor will highlight it as a syntax error. Because that's not allowed.

```tsx
function Test({id}){

  return (
    <key = {id}> {/* Not allowed ❌*/}
    <h1>Title</h1>
    <div>Random description text</div>
    </>
  )
}
```

Instead, you're required to use the longer version, which consists of wrapping your returned children with the **"React.Fragment"** tag.

Then you can pass the key prop as you usually do with any JSX tag or component.

```tsx
import React from "react"
function Test({id}){

  return (
    <React.Fragment key = {id}> {/*  allowed ✅*/}
    <h1>Title</h1>
    <div>Random description text</div>
    </React.Fragment>
  )
}
```

# Conclusion

So that's how you simply render lists in **React**: just map your array to JSX code, create new subcomponents as needed, and most importantly, **never forget your keys**.

We’ve got our keys and our components, and our list is rendering perfectly. **But there is one critical detail we’ve skipped.**

The user can now see its todos, but what if he wanted to complete a todo? He needs to click on a "complete todo" button, right? Doing so will fire what's known as a browser event.

In the next article we're going to **unveil how we can seamlessly respond to those events**.

Thank you for your attentive reading, and happy coding 🧑‍💻.