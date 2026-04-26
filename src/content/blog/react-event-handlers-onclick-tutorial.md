---
title: "React Event Handlers Tutorial: Complete Guide to onClick and Event Handling"
description: Learn how to handle user interactions in React by implementing
  event handlers for clicks, form submissions, and more.
pubDate: 2025-03-19
tags:
  - react
  - javascript
  - tutorial
series: react-fundamentals
seriesOrder: 9
---
## Introduction

A **button** is meant to be **clicked**, and when it's clicked, we **intrinsically** expect something to happen, right?

Well, the thing that will happen is **defined by you, the developer,** as a **JavaScript** function doing something; let's say displaying an alert message as an example.

**The function whose job is to respond to an event triggered by something like a user interaction such as clicking** is called an **event handler**, and it's a normal **JavaScript** function declared within the component. This special function can be attached to any **JSX** element such as **buttons**, **divs**, **inputs,** and so on.

In this article, **we will dive deeper into event handlers** while **exploring important concepts** that every developer needs to master, such as:

*   Passing event handlers between **React** components.
    
*   **Event propagation** and why understanding it is so important.
    
*   And finally, how to stop event propagation and other browser default behaviors when needed.
    

So if that sounds interesting, let's dive in.

## Event Handlers Basics

**React** makes attaching an event handler to a **JSX** element really straightforward.

Let's say that we've got a component rendering a **button** named **"click me."** Let's define an **event handler** named **"handleClick"** as a locally declared function within the component as we've discussed previously.

Usually, the **React** community follows the naming convention that cons**i**sts of **starting the event handler's name with "handle" followed by the event name**. Some examples of that include **handleClick**, **handleHover**, **handleFocus,** and so on.

Now, we just have to assign the event handler (aka our locally declared function) to a special type of **prop** starting with **"on"** and then followed by the name of the event, such as **onClick**, **onFocus**, **onHover,** and so on. In our case let's pass it to onClick.

A mistake that's often repeated by most beginners is calling the function instead of just assigning the function name.

```tsx
function Button(){

function handleClick(){
  alert("Stop Clicking")

}
return (
    <button onClick={handleClick}>Click me</button> {/* ✅ */}
    {/* <button onClick={handleClick()} />Click me </button> ❌ */ }
)
}
```

Doing so will just **make the function run at every single render or component update,** which is obviously not our goal here.

The function that is attached to the **onClick** prop is going to get called. So, the alert message will pop up only when the **button** gets clicked by the user.

What if our component receives a **username** prop? Can we access it in the **event handler**?

```tsx
function Button({username}){

function handleClick(){
  alert("Hi "+ username)

}
return (
    <button onClick={handleClick}>Click me</button> {/* ✅ */}
)
}
```

Yes, actually that's one of the advantages of declaring an **event handler** within the component. Doing so allows the **event handler** to access its **parent's outer scope variables or functions,** such as **props** or any other stuff.

### Passing Event Handlers as Props

Okay, now what if you wanted to use the **Button** component in multiple places?

Declaring "**handleClick**" inside it makes it impossible to change the **button's component's** primary behavior, which is reacting to different events differently depending on where it's used. Therefore, it becomes less reusable.

So can we solve this with props? In addition to that, is it even possible to pass functions as props?

Functions are first-class citizens in **JavaScript**. That means they can be passed to other functions, therefore, **React** components. So it's obviously possible to do that.

Now let's make our Button component accept a new prop called **"onClick,"** assign it to the button's "**onClick"** prop, and then declare a **handleClick** event handler inside the parent component itself. And then pass it to the **Button** child component.

```tsx
function Button({username,onClick}){

return (
    <button onClick={onClick}>Click me</button> 
)
}

function App(){

const username = "Sid Ali"

function handleClick(){
  alert("Hi "+ username)

}

  return (
    <div>
    <Button onClick={handleClick} username={username} />
    </div>

  )
}
```

> By convention **event handler props** are named exactly as the **JSX** elements **built-in** **events props**.
> 
> So they should start with **on** followed by either the event name or the interaction that need to be performed such as **onClick**, **OnUploadFile**, **onTryingToFindARandomName** and so on.

## Event Propagation and Bubbling

Now that we've tackled the basics of event handling, let's move on to a very important and interesting concept that is known as **event bubbling or propagation**.

But before that, let me ask you a simple question.

What will happen if you have clicked on the child component of two nested **JSX** elements, both having an event attached to their **onClick** prop? Which component will show its corresponding alert message?

```tsx
function Parent(){
  return (
    <div onClick={()=>alert("Hello From Parent")}>
      <Child1 />
    </div>
  )
}

function Child(){
  return (
    <button onClick={()=>alert("Hello from Child")}>Click me</button>
  )
}
```

```
-> (1) Hello from Child
-> (2) Hello from Parent 
```

The answer, as you may have guessed, is both but in a special order.

The alert message corresponding to the **child** component will get displayed first, and then the **parent** will follow after that.

We call what has just happened **event propagation or bubbling**. We say that **the click event has propagated from the child to the parent**.

### Stopping Event Propagation

If you happen to be bothered by such default behavior, you can stop the propagation by doing as follows:

```tsx
function Child(){
  return (
    <button onClick={(e)=>{
      e.stopPropagation()
      alert("Hello from Child")}
      }>Click me</button>
  )
}
```

> Every **event handler** has access to an optional **e** argument which is a shorthand standing for **event.** You can use this argument to either read information about the **event** or perform actions on it.

Among those actions is being able to call the **stopPropagation** method to prevent the event from **bubbling up** to **its parent**.

### Alternative to Propagation

To be in total control, you can stop the propagation and rely on passing props to decide whether you want to call the parent event handler or not.

You can achieve that by **passing the parent's event handler as a prop and then calling it after stopping the propagation and running some code**.

```tsx
function Parent(){
  function handleClick(){
    alert("Hello From Parent")
  }
  return (
    <div onClick={handleClick}>
      <Child1  onClick={handleClick}/>
    </div>
  )
}

function Child({onClick}){
  return (
    <button onClick={(e)=>{
      e.stopPropagation();

      alert("Hello from Child");
      onClick()

    }}>Click me</button>
  )
}
```

```
-> (1) Hello from Child
-> (2) Hello from Parent 
```

## Preventing Default Browser Behavior

In addition to propagation, there is another annoying event that you will definitely want to prevent.

When you submit a form, by default the browser refreshes the page, therefore killing your entire **React** application and probably causing some side effects, like smashing your keyboard from anger when that happens.

```tsx
function Form(){

  function handleSubmit(e){
    alert("Hello From Form")
  }

  return (
    <form onSubmit={handleSubmit}>
      <button>Submit</button>
    </form>
  )
}
```

![Browser Refresh Meme](/assets/courses/browser-refresh-meme.jpg)

So similarly to what we did to stop the propagation. All you need to do here is to go to the form's **onSubmit**\-attached event handler, make sure to define the **event parameter e**, and then call the **preventDefault** method on the **e** object to **prevent the default browser refresh behavior**.

```tsx
function Form(){

  function handleSubmit(e){
    e.preventDefault(); // This line prevents the browser's default behavior ✅
    alert("Hello From Form")
  }

  return (
    <form onSubmit={handleSubmit}>
      <button>Submit</button>
    </form>
  )
}
```

## Conclusion

Events are happening all the time in a **highly interactive web application**.

But when an event fires, it's usually handled by modifying some components in the **React** application tree. Think about it: a dropdown changes from toggled to none toggled depending on the number of times that it's clicked, which leads us to a fundamental concept that we haven't discussed yet until now

In the next article of the series, we will finally explore how React **reacts** and **remembers** what has happened now and in the past after some series of interactions or events.

Thank you for watching and happy coding!