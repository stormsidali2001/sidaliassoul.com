---
title: "Master Python Asyncio: A Comprehensive Guide"
description: Description
pubDate: 2026-04-19
updatedDate: 2026-04-19
tags:
  - - python
series: python-asyncio
seriesOrder: 1
published: false
---
## Introduction



&nbsp;

By the end of this tutorial, you'll understand:

- What Does "Asynchronous" Even Mean? And how it's the key for handling waiting IO tasks.
- How asyncio's event loop manages and schedules async operations.
- How to choose between asyncio, threads, and processes.
- How to Implement Your First Async Code.
- Tasks
- Types of Awaitables in python
- Future
- Synchronisation Primitives



&nbsp;

## Mastering Asynchronous I/O: How to Handle Waiting Tasks

So what does async even mean? And how exactly does it exactly help in handling I/O-bound computations?

Whatever the programming language, the framework, or the environment, when you hear about async, you should instantly think about I/O-bound tasks.

And by IO-bound tasks I mean literally any computing task where our process/program spends most of its time waiting for data. Think of:

- Reading a file from disk.
- Fetching data in the network via API calls...
- User interaction: Waiting for a user to type something on the keyboard or to click on a button.
- And so on.

Let's say you just woke up, prepared a cup of coffee, turned on your machine, and started typing on your keyboard, chuckling and sipping coffee with every keystroke. 

You soon find out, however, that your task has a dependency on a teammate. In other words, you cannot proceed until your coworker finishes their task first.

"Okay, good, let's just take a walk in nature until John finishes the task. I'm blocked, after all; I can't do anything.**"** That's what a synchronous program would have said.

But you aren't one. Instead of waiting for your coworker (a.k.a. the external I/O-bound task) to finish their work, you can just proceed asynchronously by switching to another task until they are done.

The same analogy can be applied to our program. If a part of the program is waiting for a record to be written to the database or a file to be saved to the disk, it should not stay idle. Instead, it can leverage that time to switch to other asynchronous tasks, such as fetching data from external APIs.

As you can see, async is not about executing tasks in parallel. It is all about avoiding doing nothing while our program stays idle waiting for an external I/O-bound operation to be completed. It’s about leveraging that waiting time to execute other operations.

## Your First Async Code

Now that we understand the importance of asynchronous operations, let's write our first async code:

```
async def main():
    print("Start of main coroutine")

main()

```

To declare an async function, we use the built-in async keyword; adding async in front of a function transforms it into an async function or what's called a **coroutine.**

Trying to run the code above will result in printing the following runtime warning:

```python
RuntimeWarning: coroutine 'main' was never awaited
```

You can notice as well that the main function's code never executes as well. Nothing gets printed except the warning.

Hmm, interesting. Let's try to print what's returned by the async main function

```

async def main():
    print("Start of main coroutine")

print(main()) # --> <coroutine object main at 0x10711bf40>

```

We can extrapolate from this that when a function is wrapped with the async keyword, it returns what's known as the coroutine object!

But wait, what's a coroutine object? And how can we "await for it" to avoid the previous warning?

A coroutine object is one of the three awaitable objects in Python: coroutines, tasks, and futures. To await it, we need to import asyncio and wrap the main coroutine call with its `run` method.

> "asyncio" is a built-in python libraray so there is no need to install anything."

```z
import asyncio
async def main():
  print("Start of main coroutine")

asyncio.run(main())

```

We usually only use the run method at the top level of our code because it does two things: start the async event loop and await the passed coroutine "main." 

Let's declare another coroutine called "fetch," which simulates an I/O-bound task by stopping its execution for 2 seconds, using the sleep asyncio method.

As we can't call the fetch coroutine without awaiting it, we need to use the await built-in keyword, which can only be used inside async functions.

```

import asyncio
async def fetch():
   asyncio.sleep(2)
   print("Fetch: Nested coroutine")

async def main():

  print("Start of main coroutine")
  await fetch()
  
asyncio.run(main())


```

Output:

```

Start of main coroutine
Fetch: Nested coroutine

```

The main coroutine prints first, the program pauses for 2 seconds, and then the fetch function executes.



## How to Choose between Asyncio, Threads and Subprocesses



&nbsp;

## Conclusion



&nbsp;

&nbsp;

&nbsp;