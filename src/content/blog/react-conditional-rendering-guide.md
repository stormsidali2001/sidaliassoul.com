---
title: "React Conditional Rendering: Complete Guide with If Statements and JSX"
description: Learn how to render different UI elements based on conditions, a
  key technique for creating dynamic React applications.
pubDate: 2025-03-05
# heroImage: /assets/courses/react-fundamentals/conditional-rendering.jpg
tags:
  - frameworks
  - javascript
  - frontend
series: react-fundamentals
seriesOrder: 7
---
## Introduction

A **React** component is a **building block** that runs **JavaScript logic** and then returns the UI code in a special **HTML-like** syntax known as **JSX**.

Some **UI** elements like **dropdowns**, **navbars,** and so on need to **display different things** depending on **different conditions**.

In a **React** component there are two different ways to conditionally render the **UI:**

1.  The first one is using **if** statements directly in the function's body and returning different **JSX** codes depending on the **conditions**.
    
2.  The second approach consists of directly **embedding the conditions in the** `JSX` code within **curly braces** `{}`.
    

In this article, we're going to explore both cases and master **JSX** conditional rendering.

## Conditional Rendering with If Statements

With these core concepts in mind, let's look at a practical example where an **emoji component** receives a **"type"** input prop that can be either **"angry"** or **"smile**."

The corresponding **emoji** gets rendered depending on the value of **"type."**

We have **two ways** to achieve this in **React**:

Right in the emoji component's body, we can use a **branching control flow statement** such as an **"if"** or "**switch case"** to return the right **emoji's** **JSX** code depending on the value of **"type."**

```tsx
function Emoji({type}: {type: 'angry' | 'smile'}) {
  if(type === 'angry') {  
    return (
      <div>....</div>
    );
  } else if (type === 'sad') {
    return <div>,....</div>;
  } else {
    console.warn("An invalid type prop was passed to Emoji component");
    return null;
  }
}

function App() {
  return (
    <div style={{display: 'flex', gap: '20px'}}>
      <Emoji type="angry" />
      <Emoji type="sad" />
    </div>
  );
}
```

And then inside the **app** component, we can **call the component multiple times** while passing **different values** to the **"type"** prop.

That's nice and all, but imagine if we needed to update the style of one **"div."** With the current setup, we will have to add the styles to every if statement branch, which is **repetitive** and **unconvenient**.

One solution for that is to store the emoji in a **shared local variable,** and then depending on the **type** prop value, we assign the corresponding emoji.

After that we can wrap the value stored in the variable in a **common shared "div."**

```tsx
function Emoji({type}: {type: 'angry' | 'smile'}) {
  let emoji;
  if(type === 'angry') {
    emoji = "...";
  } else if (type === 'sad') {
    emoji = "...";
  } else {
    console.warn("An invalid type prop was passed to Emoji component");
    return <>Wrong emoji type</>;
  }
  return <div style="">{emoji}</div>;
}
```

That was conditional rendering in the **JavaScript** **land**, let's now explore conditionally displaying elements **directly inside** the `JSX` code.

## Conditional Rendering in JSX

If anything that you put inside the JSX curly braces syntax should always return an expression, is it possible to embed a condition directly? within it?

Well, if you're thinking about an **if statement, then** the answer is wrong, because as the name implies, it's a statement. In other words, it does not return anything.

Hopefully, JavaScript has our backs covered with what's known as a ternary operator, which is a short way of representing an if statement that always returns something—it's an expression!

```typescript
condition ? exprIfTrue : exprIfFalse;
```

> You can read it as: `if` some condition is `true` (**question mark**) `return` this expression `else` (**colon**) return this alternative expression.

For example, let's say that we want to know the user's **age category** and then store it in a variable; we can use a **ternary operator,** which reads as follows: **If age is greater than or equal to 18, return "adult"; else, return "minor."**

```typescript
const userAgeCategory = age >= 18 ? "adult" : "minor";
```

Using the ternary operator inside **JSX** will save us from the burden of creating a **shared local variable** as we did previously or duplicating the styles everywhere. Therefore, making the component more maintainable.

```tsx
function Emoji({type}: {type: 'angry' | 'smile'}) {
  return <div style="">{type === 'angry' ? "..." : "..."}</div>;
}
```

## Using the Logical AND Operator

While the ternary operator is great for conditions that switch between returning two values. It can be verbose for hide/display-like conditions. Let me explain.

Let's say that we've got an **isUserLoggedIn** **boolean** variable, and we want to display the **emojis** list only **when the user is logged in**.

We can easily do that with the **ternary operator by** displaying the emoji list when the `isLoggedIn` variable is set to it `true` and returning `null` when it's not.

```tsx
isLoggedIn ? () : null
```

Setting **"null"** like that sounds verbose, right? Let's make it more concise by using the **"&&"** operator to only render the list when the `isLoggedIn` variable gets evaluated to **"true."** By default **JavaScript** ignores the second side of an `and` operator if the first side is set to **"false."**

> Note that we should only use the `&&` operator when we're absolutely sure that the left hand side of the expression is not a number.

> A common mistake is to use a `number` as the condition, that works for most of the cases because `Javascript` will automatically convert any type used there into a `boolean` but if it's of a number type and its value is equal to `0`. JavaScript will treat it a **"0"** string.

![Zero Hi Javascript Meme](/assets/courses/zero-hi-javascript-meme.jpg)

> To fix that we can either add the negation operator `!` two times just before the `number` or convert the number into a condition by **comparing it with another** **"Number"** – For example we can compare the age variable with 18: **"age >= 18"**.

## Conclusion

So with conditional rendering, we can make a `React` component display different things depending on a bunch of conditions. Those conditions are either defined on the **"JavaScript Logic"** side just before rendering the **JSX** or are directly embedded **in the JSX markup**.

While conditional rendering allows us to make decisions about what component should be rendered, they are not sufficient alone to deal with real-world data.

Real-world data often comes in collections of items such as an array of products, customers, and so on. So are the missing constructs that we need to master to avoid repeating ourselves when deleting such cases?

Yes, you guessed it right. In the next article, we're going to learn about another type of control flow statement. The kind that are not meant for making decisions but for not repeating ourselves. Yes, we are talking about loops in React.

Until then, happy coding.
