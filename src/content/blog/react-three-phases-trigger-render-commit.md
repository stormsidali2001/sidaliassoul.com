---
title: "React's Three Phases: Complete Guide to Trigger, Render, and Commit"
description: Understand the React rendering process and how components are
  updated in the DOM, providing insights into optimizing performance.
pubDate: 2025-04-02
tags:
  - javascript
  - frontend
  - rendering
series: react-fundamentals
seriesOrder: 11
---
## Introduction

Did you know that a **React** component can re-render while the corresponding displayed **UI** segment has not been changed?

I know **when we say rendering, we instinctively think that something has to be printed on the screen**. But that's not necessarily the case for **React** 🤯.

## Why DOM Updates Are Expensive

Updating your application's **UI**, which is displayed on your browser screen, involves **performing a series of operations** on the **DOM,** or the **Document Object Model,** which is **an object representation of the parsed HTML code that is required to display the UI**.

If **React** were updating the **DOM** **every time a component had re-rendered**, **the number of DOM operations performed could become huge**. Therefore, your application's performance would be negatively affected.

Moreover, we shall say that **updating the DOM is considered a costly operation in general**. Especially **if performed too often** because of the following reasons:

### Browser Reflows

*   First, **DOM** operations **trigger browser reflows,** during which it **has to recalculate the layout of the entire page, or a large part of it**. For example, when an element gets removed from the **DOM**, **the positions of the other elements need to be recalculated again**. The **more elements on the page, the more expensive these re-calculations become**.
    

### Browser Repainting

*   Secondly, after **reflow**, the browser may need to **repaint the affected parts** of the screen. **Repainting** involves **redrawing elements** (borders, shadows, colors, shapes, and so on). Despite being lighter than **reflow,** it's **still not counted as a trivial operation**.
    

### DOM Updates are synchronous.

*   Finally, in addition to **reflow** and **repaint**, **DOM** updates are **synchronous,** which means that they can **block UI interactions** and ruin the entire user experience **(UX).**
    

Well, fortunately **React does not touch the DOM when a component renders**. **Rendering** is nothing more than the process of **calling your function component by React**, which is way faster than **DOM** updates.

## The Three Phases

Instead of updating the DOM on every render, **React** is **splitting the work into 3 phases**: **trigger**, **render,** and **commit**. The **DOM** updates are **deferred** to the last phase (**the commit phase**).

### 1\. Trigger Phase

The trigger phase consists of asking React to render or re-render a specific component.

A render can be triggered by **two different reasons**:

#### **Initial Render**:

Firstly, **when the whole component tree gets initially rendered**.

As you may know, your app gets initially rendered via the **React** root element, which is created by the **createRoot** function that is imported from "**react-dom/client."**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

The **createRoot** function receives the wrapper **DOM** node, where the final rendered **HTML** that corresponds to your component's tree needs to be injected (root **div**). And then **renders your component tree given the parent App component**.

So the first render happens when the **React** root render method gets initially called.

#### **State Updates**:

Secondly, once **your component tree has been initially rendered, you can trigger further renders** by **calling the setter function returned by the useState hook**.

**Whenever the setter function is called**, **React** queues or schedules a future render. Even if you've called the **setter function** **multiple times**, the **new state** won't be reflected until the **next render**.

Put differently, using the **setter function** means just asking **React** for a future render while mentioning the state changes.

**React** will take that into consideration and schedule the next render with the **new state value**. **Consequently, it will update the parts of the JSX code that are derived from the new state** during the next render.

### 2\. Render Phase

Now let's move into the second phase that comes after **triggering a render**, which is obviously **rendering**.

To put it in simple words, **rendering is just when React decides to call your function component**.

As we saw earlier, a render can be triggered either on app start, during which the root object triggers the initial render of the whole component tree, or on demand when a state gets updated in a specific component.

When a specific component's state changes, all of its direct or indirect children will re-render recursively. In other terms, if the grandpa re-renders, all of the descendant family will get re-rendered sequentially starting from the children to the grandchildren and so on.

Each component in the tree will return the JSX code that corresponds to the UI segment that it is responsible for.

As we saw in the JSX article, despite looking like **HTML code,** it's just a **JavaScript** language extension, meaning that it's getting converted into a bunch of objects representing the real **HTML** DOM nodes.

So during the initial render of the component's tree, React builds a **virtual representation of the real DOM** as raw **JavaScript** objects.

When a given component re-renders because of a state update, the component and its descendants will re-render as we saw previously, so the **JSX** returned by some components may differ compared with the initial re-render.

**React will keep track of all the changes that are caused by the re-renders** while **calculating a minimal number of DOM operations that are needed to move from the previous state (before rendering) to the newest state (after rendering)**.

### 3\. Commit Phase

After the process of re-rendering, during which **React creates a bunch of objects representing the DOM elements** and **calculates a lot of information regarding the minimal required DOM operations to get from the oldest state to the newest**.

**React** will finally start modifying the **DOM** during what is called the **commit phase**.

The commit phase happens in two cases:

**Initial rendering:** Just after rendering or calling all the components in the tree, **React** reads the collected information that consists of, remember, **the constructed objects representing the DOM nodes**. And then uses the **DOM** API to insert all the nodes inside the wrapping **div** whose **ID** is equal to **root**.

**When re-rendering:** **React** will use the information collected during the **rendering phase** and apply a minimal number of **DOM** operations in order to make it match the latest rendering output.

So React is smart enough to only change the **DOM** nodes that have been modified during the previous phase.

## Conclusion

By **delaying DOM operations to the commit phase** and **calculating the optimal number of DOM operations after re-rendering**.

**React** manages to achieve great performance while simplifying the process of **UI** development by taking care of the **complex stuff like DOM manipulation** and providing you, the user, with a **simple and descriptive language** that allows you to model the **UI** as a function of its state using **React** components.

```
UI = fn(State)
```

In the next article, we will be diving more into the concept of **state** in **React**.

Thank you for your attentive reading and happy coding.