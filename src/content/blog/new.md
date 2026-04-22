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

lock = asyncio.Lock() # <----------- lock object or mutex
balance = 0 # shared resource


async def credit():
    try:
      lock.aquire() # <------- aquire, code guarded!
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
         lock.release() #<------- release, access permited!

    
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

Let's combine everything into a single file and run it.

```python
import asyncio

lock = asyncio.Lock()
balance = 0 # shared resource

async def perform_io_bound_update():
    await asyncio.sleep(1) # Simulate an I/O Operation


async def debit():
  # ... previous debit code


async def credit():
  # ... previous credit code


async def main():
    start_time = time.perf_counter() # <--- start time

    await asyncio.gather(credit(),debit()) 

    print(f"The final balance is: {balance}")

    end_time = time.perf_counter() # <--- end time
    duration = end_time - start_time # <-- execution time
    print(f"The program took {duration} seconds to execute")


asyncio.run(main())


```

Let's compare the output for these two cases:

1. **Unsynchronized:** The lock is removed.
2. **Synchronized:** The lock is included.



Output **without synchronization**:

```
credit read: 0
debit read: 0   <--- debit reads balance as 0 here
credit wrote: 1
debit wrote: -1
The final balance is: -1  <----- debit uses the balance before the credit update
The program took 1.001487125060521 seconds to execute.

```

Without a lock, the two functions run concurrently, leading to a race condition:

1. **Credit’s first block (before the await):** It reads the balance as 0 and pauses at the **await** line.
2. **Debit’s first block (before the await):** The event loop switches execution to **Debit**, which reads the same balance (0) because **Credit** hasn't updated it yet.
3. **Credit’s second block (after the await):** It resumes and saves the new balance as **1** (0 + 1).
4. **Debit’s second block (after the await):** It resumes and saves its result as **-1** (0 - 1), **overwriting** Credit’s update.

Output **with synchronization** (with async lock):

```
credit read: 0
credit wrote: 1
debit read: 1
debit wrote: 0
The final balance is: 0
The program took 2.0022490409901366 seconds to execute.
```

As you can see, when using a lock, the read and write operations are treated as a single protected operation. Even though the event loop **indeed transfers** execution to the `debit` function immediately after the `credit` coroutine hits the **await** line, the lock guards the state and pauses the `debit` coroutine.



**Here is how the two approaches compare:**


|  |  |  |
| ------------------ | ------------------------ | --------------------- |
| **Feature** | **Without Lock** | **With Lock** |
| **Execution Time** | 1 Second | 2 Seconds |
| **Reliability** | **Cons:** Race Condition | **Pros:** Data Safety |


As the table shows, **there is no silver bullet**. While a **mutex** ensures data integrity, it forces the protected code to run sequentially and increases the total runtime. 

Use them sparingly. Only wrap sections where an **await** might trigger an event loop switch that leads to a race condition.

## Semaphore

```
```python
import asyncio

async def access_resource(semaphore,resource_id):
    async with semaphore:
        print(f"Accessing resource {resource_id}")
        await asyncio.sleep(1)
        print(f"Rleasing resource {resource_id}")
async def main():
    semaphore = asyncio.Semaphore(2) # allow 2 concurrent acesses
    await asyncio.gather(*(access_resource(semaphore,i) for i in range(5)))

asyncio.run(main())
```
```

```
```
Accessing resource 0
Accessing resource 1
Rleasing resource 0
Rleasing resource 1
Accessing resource 2
Accessing resource 3
Rleasing resource 2
Rleasing resource 3
Accessing resource 4
Rleasing resource 4
```
```

## Event

An Event is a synchronization primitive used to notify multiple tasks that a specific state has been reached or an action has occurred. It manages an internal boolean flag that tasks can wait on.

```
```python
import asyncio

async def waiter(event):
    print("waiter: waiting for the event to be set")
    await event.wait()
    print("waiter: even has been set, continuing execution")
async def setter(event):
    await asyncio.sleep(2) # simulate some IO
    event.set()
    print("setter: event has been set!")

async def main():
    event = asyncio.Event()
    await asyncio.gather(waiter(event),setter(event))

asyncio.run(main())
```
```

```

waiter: waiting for the event to be set
setter: event has been set!
waiter: even has been set, continuing execution

```

## Condition

```
```python
import asyncio

shared_resource = 0
cond = asyncio.Condition()

async def waiter(name):
    global shared_resource
    # ACQUIRE: Task enters and grabs the underlying Lock
    async with cond:
        print(f"Task {name} is waiting for resource to reach 3...")
        
        # 1. ATOMIC RELEASE: wait_for releases the lock so incrementer can work.
        # 2. SLEEP: Task name pauses here.
        # 3. RE-ACQUIRE: When notified, it waits to grab the lock again before continuing.
        await cond.wait_for(lambda: shared_resource == 3)
        
        # LOCK HELD: Task now holds the lock again.
        print(f"Task {name} sees resource is {shared_resource}. Starting work!")
        await asyncio.sleep(1)
        
    # RELEASE: Lock is released automatically at the end of the 'async with' block.

async def incrementer():
    global shared_resource
    for i in range(5):
        await asyncio.sleep(0.5)
        
        # ACQUIRE: Incrementer grabs the lock.
        async with cond:
            shared_resource += 1
            print(f"Incrementer: shared_resource is now {shared_resource}")
            
            # SIGNAL: This doesn't release the lock; it just wakes up the waiters
            # so they are READY to grab the lock as soon as this block ends.
            cond.notify_all()
            
        # RELEASE: Lock is released here. 
        # Now, one of the waiters (or the incrementer in its next loop) can grab it.

async def main():
    await asyncio.gather(
        waiter("A"),
        waiter("B"),
        incrementer()
    )

asyncio.run(main())
```
```

## Bounded Semaphore

## Barrier

