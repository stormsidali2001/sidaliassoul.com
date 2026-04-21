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

```

```

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


async def credit():
    try:
      lock.aquire()
      global balance
      # 1. Read the current value
      current_balance = balance 
      print(f"debit read: {current_balance}")
    
      # 2. Yield control (The event loop switches to another   coroutine here)
      await perform_io_bound_update() 
    
      # 3. Write back based on the OLD value
      balance = current_balance + 1 
      print(f"debit wrote: {balance}")

    finally:
         lock.release()

    
```

1. First, we instantiate an `asyncio.Lock` object.
2. Inside the coroutine, we **acquire** the lock. This allows us to safely read the `balance` variable, **await** an I/O-bound task, and then increment the balance.
3. The lock ensures that the sequence of reading and writing is treated as a protected operation; it guards the code block and pauses any other concurrent coroutine that attempts to enter the same block while the lock is held.

While the code above is valid, it's easy to forget to release the lock, which can lead to many subtle bugs.

That's why it's recommended to use the `async with lock` syntax. The previous code is equivalent to:

```python

lock = asyncio.Lock()
balance = 0 # shared resource


async def credit():
   async with lock:
      global balance
      # 1. Read the current value
      current_balance = balance 
      print(f"credit read: {current_balance}")
    
      # 2. Yield control (The event loop switches to another   coroutine here)
      await perform_io_bound_update() 
    
      # 3. Write back based on the OLD value
      balance = current_balance + 1 
      print(f"credit wrote: {balance}")

 
```

Under the hood, the `Lock` class implements the **asynchronous context manager** protocol, which automatically acquires the lock when entering the block and releases it upon exiting.



Let's create another **debit coroutine** that performs the same logic but **decrements** the balance by 1 instead of incrementing it. Subsequently, we will run the credit and debit coroutines concurrently using **asyncio.gather**.

```
```python
async def debit():
   async with lock:
      global balance
      # 1. Read the current value
      current_balance = balance 
      print(f"debit read: {current_balance}")
    
      # 2. Yield control (The event loop switches to another   coroutine here)
      await perform_io_bound_update() 
    
      # 3. Write back based on the OLD value
      balance = current_balance - 1 
      print(f"debit wrote: {balance}")
```
```

Since **asyncio.gather** accepts any number of coroutines, tasks, or futures, we can use it to schedule them on the event loop. It returns a **Future object** that aggregates the results of all passed coroutines. 

To pause execution and wait for these tasks to complete, we must **await** the gather call, therefore the returned **future** object.

```

async def main():
    await asyncio.gather(credit(),debit())
    print(f"The final balance is: {balance}")


asyncio.run(main())

```

```python
import asyncio

lock = asyncio.Lock()
balance = 0 # shared resource

async def perform_io_bound_update():
    await asyncio.sleep(1) # Simulate an I/O Operation


async def debit():
  # ... previous code


async def credit():
  # ... previous code


async def main():
    await asyncio.gather(credit(),debit())
    print(f"The final balance is: {balance}")


asyncio.run(main())


```

What do you expect as an output in these cases:

1. When we remove async with lock.
2. When we keep async with lock

Output with synchronization (with async lock):

```
credit read: 0
credit wrote: 1
debit read: 1
debit wrote: 0
The final balance is: 0
```

  
Output without synchronization:

```

credit read: 0
debit read: 0
credit wrote: 1
debit wrote: -1
The final balance is: -1
```

## Semaphore

## Event

## Condition

## Bounded Semaphore

## Barrier

