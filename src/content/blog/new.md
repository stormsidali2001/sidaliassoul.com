---
title: "new"
description: "new"
pubDate: 2026-04-21
updatedDate: 2026-04-21
tags:
  -  python
  -  tutorial
  -  programming
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

```
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

```
```
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
```

Under the hood, the `Lock` class implements the **asynchronous context manager** protocol, which automatically acquires the lock when entering the block and releases it upon exiting.



# running 5 concurrent instances of the coroutine

   await asyncio.gather(*(modify_shared_resource() for _ in range(5)))

  
  
## Semaphore  
  
## Event  
  
## Condition  
  
## Bounded Semaphore  
  
## Barrier  



