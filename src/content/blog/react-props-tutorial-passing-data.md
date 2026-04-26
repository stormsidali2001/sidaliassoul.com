---
title: PROPS in React explained.
description: Learn how to pass data between React components using props, a
  fundamental concept for building dynamic and reusable components.
pubDate: 2025-02-26
tags:
  - react
  - javascript
  - tutorial
series: react-fundamentals
seriesOrder: 6
---
## Introduction

If you want to pass information from a parent component to a child component in React, props are exactly what you're looking for.

As you may know, in `React` we represent the user interface as components that are nested within each other, forming a `tree`.

Each **component** is responsible for its own `Markup` and logic.

`React` follows a `unidirectional data flow model`, meaning that information can only be passed from **parent components** to **child components**. In other words, the data only flows in one direction, starting from the top of the tree to the bottom.

## Passing Props Between Components

```tsx
function ChildComponent() {
  return <h1></h1>;
}

function ParentComponent() {
  return (
    <div>
      <ChildComponent />
    </div>
  );
}
```

Props are the medium that allow us to send data from a parent component to a child component. So how can we possibly do that in code?

Passing props from one component to another is straightforward. And here's how it's done:

1.  Pass the data as attributes, similar to how you would pass `normal attributes` to an `HTML` tag element. Here we are passing a `content` attribute with a value of `test.`
    
2.  Now, let's add a `props` parameter to the child component so that it can access the `content` attribute that we've passed before.
    
3.  Finally, make the `ChildComponent` render the `content` value within an h1 tag.
    

```tsx
function ChildComponent(props) {
  return <h1>{props.content}</h1>;
}

function ParentComponent() {
  return (
    <div>
      <ChildComponent content="test"/>
    </div>
  );
```

It's also possible to access the `content` attribute more conveniently using the destructuring syntax.

```typescript
function ChildComponent({content}) {
  return <h1>{content}</h1>;
}
```

Unlike normal `HTML` attributes, `props` can include any `JavaScript` value such as: `arrays`, `functions`, or even `JSX` code.

```tsx
function handleClick(){
console.log("Clicked!")
}
return(

<ChildComponent content="test" arr={[1,2,3]} onClick={handleClick}/>
)
```

## Prop Forwarding and Spread Operator

Okay, now let's say that we have 3 levels of nesting:

1.  A parent component `App` that renders a component named `ChildComponent1` while passing 3 props to it: a title, a description and an image.
    
2.  On the other hand, The `ChildComponent1` renders the content of the `title` inside an `h1` tag and then forwards the `description` and the `image` props to a third component named `ChildComponent2`.
    

```txt
App -{title,img,description}--> ChildComponent1 --{description,image}-> ChildComponent2 
```

This can quickly get cumbersome as the number of forwarded `props` increases. Moreover, the components become less resistant to changes when we want to forward more props.

So instead of forwarding the `props` manually like that

We can only **destructure** the `title`, and use the spread operator syntax to store the remaining `props` in an object called `restProps`.

After that we can pass the rest props to the `ChildComponent2` using this syntax `<ChildComponent2 {...restProps}/>.`

```tsx
function ParentComponent() {
  return (
    <div>
      <ChildComponent1
        title={"This is a message from component 1"}
        description={"description"}
        image={<img src="...lorem picsum" alt="image alt" />}
      />
    </div>
  );
}

function ChildComponent1({ title, ...restProps }) {
  return (
    <div>
      <h1>{title}</h1>
      <ChildComponent2 {...restProps} />
    </div>
  );
}

function ChildComponent2({ description, image }) {
  return (
    <div>
      {description}
      {image}
    </div>
  );
}
```

## Children Props and Layout Components

Some `HTML` tags can wrap other elements within them. Can we achieve that with components? Or in other words, is it possible for a parent component to act as the layout that wraps a child component?

To make a component **wrap other components** or any `JSX` code, we need to use a special `prop` called `children.` And as the name implies, it stores all the `JSX` code that is wrapped by the component.

```tsx
function ChildComponent(){
  return (
  <div>I'm a just a child</div>
  )

}
function WrapperComponent({ children }) { // 
---
----- Higher order component
  return (
  <div>
    <h1>I'm the one who wraps...</h1>
    {children}
    <h1>I'm the one who knocks...</h1>
  <div/>
  );
}

function App(){

return (
  <HigherOrderComponent>
    <>
    <ChildComponent/>
    <button>click me</button>
    </>

  </HigherOrderComponent>

)

}
```

## Conclusion

Your `React` component would be nothing more than a static snippet if it weren't for `React` props, which make it possible to reuse components in different scenarios.

But what if a component receives an`isLoggedIn` boolean value prop and needs to show either a `Login` button or a `Logout` button depending on that value?

That's where conditional rendering comes in!

In the next article, we will learn how to **display different elements** depending on specific **conditions**, using either `if` statements within the `JavaScript logic` of the component or a `ternary operator` inside the `Markup` itself.

Until then, happy coding.
