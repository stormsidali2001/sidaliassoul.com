---
title: Master JSX in 8 Minutes (Before You Write Your Next React Component) --
  React Tutorial
description: Master JSX, the syntax extension for JavaScript that makes writing
  React components more intuitive and efficient.
pubDate: 2025-02-19
tags:
  - javascript
  - frontend
  - components
series: react-fundamentals
seriesOrder: 5
---
## Introduction

So what the heck is JSX? And what does it have to do with HTML?

`JSX` is a syntax extension for `JavaScript`. Yes, you heard it right—it's an extension of `JavaScript` not `HTML`, despite what many people think. This means that `JSX` is eventually converted into valid `JavaScript` code 😮.

Under the hood, the conversion is handled by compilers like `Babel` or `SWC`. Consequently, the entire component tree representing our `App` is transformed into `JavaScript`. These objects are understood by the browser and used by the `React` runtime to render the final `HTML` code.

For example, the code below.

```typescript
function Image() {
  return <img alt="Blog post image" src="https://picsum.photos/500/400" />;
}

function App(){
    return (
        <Image/>
    )
}
```

...will be converted by `Babel` or `SWC` into this:

```typescript
import { jsx as _jsx } from "react/jsx-runtime";

function Image() {
  return /*#__PURE__*/ _jsx("img", {
    alt: "Blog post image",
    src: "https://picsum.photos/500/400",
  });
}
function App() {
  return /*#__PURE__*/ _jsx(Image, {});
}
```

> The `__jsx` is imported from the `react/jsx-runtime`;it's used to build and return the object representing the `JSX` node.

We use `JSX` for its conciseness. It's easier to read and write because it closely resembles the final `HTML` that will be shipped to the user's browser.

In this article, we will walk through everything you need to know about `JSX` including:

*   The specific syntax rules that distinguish it from `HTML`.
    
*   How to embed `JavaScript` using the curly brace syntax.
    

## JSX vs HTML: Key Differences

At first glance, `JSX` looks like `HTML`. In reality, its strictness may easily break your code if you're not careful.

So the first rule, is simple—just be strict with your tags and you'll be fine

The rule consists of always closing tags, including self-closing ones like `<img/>` or wrapping tags like `<div>`s.

```tsx
function App(){
 return (
   <div> // ✅

   <img> // ❌
   <img/> // ✅

   </div> // ✅
 )
}
```

In addition to being strict with the tags themselves, `JSX` also has some special rules regarding their attributes-- Instead of kabab-case in `HTML`, you must use camel case when defining attributes.

```tsx
<button tab-index={0}> </button>  // Kabab case ❌
<button tabIndex={0}> </button>  // Camel case ✅
```

Note that `JavaScript`'s reserved keywords are not allowed as attribute names. As an example of that, the `class` keyword that is used to define classes is not allowed. That's why you need to use `className` instead.

As bonus information, there is one exception to the above rule, which is attributes that start with either `data-*` or `area-*`.

```tsx
<div class="..."> </div>  // ❌
<div className="..."> </div> // ✅
```

Moreover, when declaring a component we also do it in camel case, while making sure that the first character is in uppercase. -- Bonus: That's actually called Pascal case!

```tsx
function my_component() {
  /*...*/
} // Snake case ❌
function MyComponent() {
  /*...*/
} // Camel case ✅
```

Now, let me ask you a question, can a `JavaScript` function return multiples objects without wrapping them in an array or a parent object?-- No that's a syntax error right?

```typescript
function invalidFunction() {
  return { key: "sidali" }, { key: "I don't know" }; // ❌
}

function validFunction() {
  return [{ key: "Neovim" }, { key: "Btw" }]; // ✅
}
```

Using a `div` as a wrapper can be annoying sometimes, especially when styling elements. Instead, there is a built-in `React` component that literally does nothing but virtually wrapping its children without even showing in the browser `DOM`.

You can use it this way. Or more concisely using empty tags `<></>`

```tsx
import React from 'react'
function CorrectComponent1(){ // ✅
  return (
    <React.Fragment>
      <h1>Title</h1>
      <div>Description </div>
    </React.Fragment>
  )

// Or more concisely

function CorrectComponent2(){ // ✅
  return (
    <>
      <h1>Title</h1>
      <div>Description </div>
    </>
  )
```

## Using JavaScript in JSX

Sure we can perform any kind of `JavaScript` logic in the function's body before returning the `JSX` including if statements, for loops and so on.

But is there a built-in way to use `JavaScript` or reference a `JavaScript` value or object from within the `JSX` code itself?

Yes, and it's pretty simple; just use the curly bracket syntax `{}` and then reference any variable, value, function call, or any expression from the `JavaScript world 🌎`.

Rather than hardcoding the title value in the `Markup` here, we can store the `h1` tag's inner content in a `JavaScript` variable as a string.

And then reference it in the `Markup`, using the curly bracket syntax like this.

```typescript
function App(){
  const title = "This is my first react component";

  return (
    <div>
      <h1>{title}</h1>
      <ol>
        <li>Wake up</li>
        <li>Code</li>
        <li>Eat</li>
        <li>Sleep</li>
        <li>Repeat</li>
      </ol>
    </div>
  );
}
```

Think of the curly braces as a return statement. Anything that returns a string or `JSX` code can be used inside them.

Including functions.

```typescript
function App(){
  const title = "This is my first react component";
  const createTitle = (title) => <h1>{title}</h1>;

  return (
    <div>
      {createTitle(title)}
      <ol>
        <li>Wake up</li>
        <li>Code</li>
        <li>Eat</li>
        <li>Sleep</li>
        <li>Repeat</li>
      </ol>
    </div>
  );
}
```

And variables.

```typescript
const var1 = <h1>This is my first react component</h1>;
const var2 = (
  <div>
    {var1}
    <ol>
      <li>Wake up</li>
      <li>Code</li>
      <li>Eat</li>
      <li>Sleep</li>
      <li>Repeat</li>
    </ol>
  </div>
);
```

Beware of using if statements or loops inside the `JSX`. Only values, variables and expressions are allowed!

```tsx
return (
if(true){   ❌



}else{

}

for (){}  ❌

while(){} ❌


)
```

Is it possible to reference attributes and styles?

All attributes except `style` can be set to strings, using the curly braces syntax.

```tsx
function App(){

      const className = "cool-div"

    return(
    <>
      <div className={className}></div>
      </>
    )
}
```

In standard `HTML` we set the `style` attribute as a string that looks like this;

```tsx
<div style="background-color:black; color:pink"/>
```

But things are a bit different, in the `JSX` realm.

We need to pass an object, that includes your `CSS` properties and values as key-value pairs. Such as the keys are written in camel case instead kabab case.

```css
/* CSS kebab-case */
background-color: black;
color: pink;
```

```tsx
function App(){

    const style = {
      backgroundColor: 'black',
      color: "pink"
    };

    return(
      <div style={style}/>
    )
}
```

Often people get tripped up by these double curly braces `{{}}`. They think that it's a special `JSX` syntax. But it's actually just a regular JavaScript object being passed inside the curly brackets.

```jsx
<img style={{ backgroundColor: "red" }} />
```

```tsx
function App() {
  const styleObj = { backgroundColor: "red" };

  return (
    <img style={styleObj} /> // Instead of style={{backgroundColor:'red'}}
  );
}
```

Congratulations! You've just earned a new badge: JSX Syntax Wizard! Now that you learned how the `JSX` magic works under the hood and gone through its spell book. You're officially ready to write clean, error-free React components.

## Conclusion

But here's the catch: a Button component is practically useless if you can't reuse it with different titles, Right?

We need some sort of mechanism that allows us to pass data to a React component in order to make it `generic` and `reusable`.

In other words, we need to be able to pass a `title` argument to the Button component!

That's exactly what we are going to explore in the next article: we will learn about component arguments, also known as Props.

Until then... happy coding.