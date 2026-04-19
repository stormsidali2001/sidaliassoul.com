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
- How to choose between asyncio, threads, and subprocesses.
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

## How to Choose between Asyncio, Threads and Subprocesses

In software engineering, there is no silver bullet that works for everything and in all cases. That's why we need to make sure that we are employing the right solution for the right use case. 

1. Asyncio: As we previously stated, whenever you hear the word "async," think about I/O-bound tasks. If you think that your program will deal with a lot of external systems such as databases, file system operations, or network requests, then asyncio is your best choice.



2. Threads: Use them for parallel (concurrent if GIL enabled) tasks that share data with minimal CPU use. 

- Threads are not really parallel in Python because of the Global Interpreter Lock (GIL). Which is a mutex ensuring that only one thread is executing python bytecode at a time
- In the latest version of Python, they introduced a free-threaded build, but it's not enabled by default for compatibility reasons.

3. Multiprocessing: Unlike threads, each process has its own instance of the Python interpreter. This means you can truly utilize 100% of your multi-core processor. 

- Subprocesses cost more memory as each one has its own memory and instance of the Python interpreter.
- But isolation pays for that cost; a crash in one subprocess won't affect the others

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

Let's declare another coroutine called "fetch," which simulates an I/O-bound task by stopping its execution for 2 seconds, using the asyncio.sleep method and a 200 success code.

As we can't call the fetch coroutine without awaiting it, we need to use the await built-in keyword, which can only be used inside async functions.

So in the main coroutine, await the fetch call and get its result, then print it.

```

import asyncio
async def fetch():
   await asyncio.sleep(2) # 2 seconds delay, simulates I/O operation.
   return 200

async def main():

  print("Start of main coroutine")
  result = await fetch()
  print("result: {result}")
  
asyncio.run(main())


```

Output:

```

Start of main coroutine
result: 200

```

The main coroutine prints first, the program pauses for 2 seconds, and then the fetch function executes.

Let's now try to call the fetch coroutine three times in main, retrieve the result of each call, and then print them all.



```

import asyncio
import time

async def fetch():
   await asyncio.sleep(2)
   return 200


async def main():
 
  start_time = time.perf_counter()
  
  print("Start of main coroutine")

  start_time = time.perf_counter()
  result1 = await fetch()
  result2 = await fetch()
  result3 = await fetch()
  end_time = time.perf_counter()
  duration = end_time - start_time
  print(f"The time took {duration} to execute")

  print(f"results: {[result1,result2,result3]}")
  
asyncio.run(main())


```

Output:

```
Start of main coroutine
The time took 6.003185832989402 to execute
results: [200,200,200]
```

There is no performance gain here yet. The fetches are executing one after another. We are essentially waiting for each I/O task to finish before starting the next one, which defeats the purpose of being asynchronous.

In other words, we are not taking advantage of our event loop here.

## Introducing Tasks

By default, asyncio doesn't schedule coroutines in the event loop; we need to wrap each coroutine object in a task. 

Once you wrap a coroutine object with a task, the event loop will start managing its execution in the event loop immediately.

Let's wrap all the fetch calls in the previous example with a task. 

```
async def main():
 
  start_time = time.perf_counter()
  
  print("Start of main coroutine")

  start_time = time.perf_counter()
  task1 = asyncio.create_task(fetch())
  task2 = asyncio.create_task(fetch())
  task3 = asyncio.create_task(fetch())
  result1 = await task1
  result2 = await task2
  result3 = await task3
  end_time = time.perf_counter()
  duration = end_time - start_time
  print(f"The time took {duration} to execute")

  print(f"results: {[result1,result2,result3]}")
  
asyncio.run(main())


```

## What is the event loop?

Asynchronous execution of our program allows us to leverage the wasted waiting time of I/O-bound operations by switching from one blocked task to another until all tasks are executed. But how is that achieved in practice by asyncio? 

That's where the Event Loop comes in.

The `asyncio.run` method creates what's called an event loop. 

```python

asyncio.run(main())

```

You can think of the event loop as the orchestrator that tracks all the async coroutines. Here's how it works in practice.

1. **Execution Start**: When you call "**asyncio.run(main()),"** the event loop starts and maintains a list of all the tasks that need to be executed. At any given moment, the loop is running exactly one task.
2. **The Yield Point:** The loop executes a task until it hits an **"await,"** which is a signal that means that the coroutine/task is waiting for an external I/O operation. 
3. **The Switch & Resume:** Instead of waiting, the loop immediately switches to another ready task. It keeps track of the "waiting" tasks in the background and resumes them exactly where they left off the moment their I/O operation is finished.





## Conclusion



&nbsp;

&nbsp;

&nbsp;