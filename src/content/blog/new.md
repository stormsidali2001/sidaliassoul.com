---
title: new
description: new
pubDate: 2026-04-21
updatedDate: 2026-04-21
tags:
  - - python
  - - tutorial
  - - programming
series: python-asyncio
seriesOrder: 1
published: false
---
## Introduction

By the end of this tutorial, you'll learn six synchronization primitives that you can use in different scenarios to protect your program from race conditions:

1. Lock:
2. Semaphore
3. Event
4. Condition
5. Bounded Semaphore
6. Barrier

## Lock

The most common way to handle **race conditions** in systems programming is through **mutexes**. A mutex ensures **mutually exclusive** access to a resource, meaning only one coroutine can access it at any given time.

In **asyncio**, this is implemented via the `asyncio.Lock` class. The Lock object acts as a guard; when a coroutine holds the lock, any other coroutine attempting to acquire it will be suspended until the lock is released. 



Here's an example of how you would create a mutex lock in asyncio:

```python
lock = asyncio.Lock()
balance = 0 # shared resource

# inside a coroutine
def credit():
    global balance
    await lock.aquire()
    try:
     # Access shared state here.
     balance += 1
     # No other coroutine using this lock can enter this section.
     await perform_io_bound_update()
    finally:
      lock.release()
    
```

1. First we instantiate an asyncio Lock object.
2. Right inside the coroutine code, we acquire the lock, safely mutate the balance shared variable, "**await"** some I/O-bound task, and then release the lock.
3. When acquiring the lock and then suspending execution, the event loop can execute another coroutine.

While the code above is valid, it's easy to forget to release the lock, which can lead to many subtle bugs.

That's why it's recommended to use the `async with lock` syntax. The previous code is equivalent to:

```python
lock = asyncio.Lock()
balance = 0 # shared resource

# inside a coroutine
async def credit():
    global balance
    async with lock:
        # Access shared state here.
        balance += 1
        await perform_io_bound_update()

```

Under the hood, the `Lock` class implements the **asynchronous context manager** protocol, which automatically acquires the lock when entering the block and releases it upon exiting.



Let's create another debit coroutine that does exactly the same thing, but instead of incrementing the balance by 1, it decrements it.

Subsequently, let's run the credit and debit coroutines concurrently using asyncio.gather, which takes any number of coroutines, tasks or futures and then schedule them to run on the event loop.

asyncio.gather returns a future object, aggregating the results of all the returned values of the coroutines that are passed to it. To pause the execution and wait for all the sub routines we need to await it.

```python
import asyncio

lock = asyncio.Lock()
balance = 0 # shared resource

async def perform_io_bound_update():
    await asyncio.sleep(1) # Simulate an I/O Operation


async def debit():
    global balance
    async with lock:
        # Access shared state here.
        balance -= 1
        # No other coroutine using this lock can enter this section.
        await perform_io_bound_update()

async def credit():
    global balance
    async with lock:
        # Access shared state here.
        balance += 1
        # No other coroutine using this lock can enter this section.
        await perform_io_bound_update()

async def main():
    await asyncio.gather(credit(),debit())
    print(f"The final balance is: {balance}")


asyncio.run(main())

```

What do you expect as an output in these cases:

1. When we remove the lock.
2. When we keep the lock.

```
The final balance is: 0
```

If you expect

## Semaphore

## Event

## Condition

## Bounded Semaphore

## Barrier

