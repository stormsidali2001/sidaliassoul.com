---
title: "React State Snapshots Explained: Why State Values Don't Change During Renders"
description: Understand how React state snapshots work and why state values
  remain constant within a single render, with practical examples and
  explanations.
pubDate: 2025-04-09
tags:
  - react
  - javascript
  - tutorial
series: react-fundamentals
seriesOrder: 12
---

```javascript

function App(){
  const [counter,seCounter] =useState(1)
return (
  <div>
    <p>{counter}</p>
    <button onClick={()=>{

      setCounter(counter + 1); 
      setTimeout(() => { 
    console.log(counter);
      }, 5000);

    }}></button>
  </div>
)
}
```

You may get shocked to know that this code, **will not print 2**.

Despite **incrementing the counter by 1**, and then **deferring the execution of the console log by 5 seconds using the `setTimeout` browser `API`**,which means that by the time the `console.log` is executed the **state will have been already incremented by 1**.

**But** reality shows nothing but that, in fact, a 1 gets printed.


In this article, we will be clarifying what's exactly happening here under the scene while explaining the concept of a **state snapshot in `React`**. So without any further ado let's get started.


As you might know, `State` doesn't live inside the function component but it's stored within the `React` package itself!.

And **provided as a snapshot** or in other terms, as **a copy of the original state** via the `useState` hook.

In fact, `useState` is named a hook because \*\*it's hooking into the external state stored in `React` itself! \*\*

Components re-renders can be triggered via a state updates. Therefore when a given component re-renders or `gets called by React` a new snapshot mirroring the latest updated state value is given to it, and then based on that value the whole `JSX` including the **attached event handlers** gets re-created again.

So the **deferred `console.log`** in the previous code **was printing 1**, because it **was referencing the state snapshot of the first render**.

By the time the second render happens, the whole `JSX` including its corresponding **attached event handlers** will be re-created again with the **new `counter` state value which will be equal to 2**.

Therefore, **Every render is associated with**:

*   **A state snapshot**.
*   And a **`JSX` code including event handlers.**

Similarly, If you re-tried to re-click on the `button` again **the `counter` state will be incremented to 3**.

Then the component will **re-render displaying 3 on the `UI`**. After 5 seconds are elapsed 2 will be printed, because as we said previously the event handler was attached to the previous render hence the **callback function** is referencing the **old state snapshot**.

In other words, we can briefly say that:

**The state that is returned by the `useState` hook is constant during every render,** even if the event handler that is attached to one of the returned `JSX` elements was executing asynchronously, in the future when many potential renders may have already occurred.

Every render is allocated its own constant `state` snapshot, that never change before the next render.

All the derived `JSX` code including **event listeners** is tied to that specific render.

In more specific words, **renders are totally isolated**.

> Render 1 can never access state snapshots in render 2.

## Conclusion


To sum up, you can think of a **re-render** as a component starting a brand **new life** with a brand **new state snapshot**, **`JSX` code** and **event handlers**.

Now, imagine if we try to update the `counter` state using `setCounter` setter function two times sequentially. What would be the value of the `counter` state after the second render?

```tsx
// counter = 1
setCounter(counter +1)
setCounter(counter +1)
// counter = ?? 
```

Well, that's what we are going to discover in the next article, where we introduce `React State Batching`.

Thank you for your attentive reading and happy coding.