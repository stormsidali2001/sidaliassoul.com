---
title: new
description: new
pubDate: 2026-04-21
updatedDate: 2026-04-21
tags:
  - - python
    - tutorial
    - programming
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

Since **asyncio.gather** accepts any number of coroutines, tasks, or futures, we can use it to schedule them on the event loop. It returns a **Future object** that aggregates the results of all passed coroutines. 

To pause execution and wait for these tasks to complete, we must **await** the gather call, therefore the returned **future** object.

```python

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

### Introduction

A **semaphore** works similarly to a **lock**, but it allows multiple coroutines to have access to the same resource at the same time.

A semaphore manages an internal counter, which is **decremented** every time you call `acquire()` and **incremented** by each `release()` call. 

When the counter reaches zero, any **subsequent** coroutine that calls **acquire()** will be suspended. These tasks are queued and will only resume execution one by one as the counter becomes greater than zero through **release()** calls.

While locks totally prevent access to resources, semaphores are shine when you want to throttle requests or when a given resource **requires limited concurrent access**.

### Practical Example

When instantiating a semaphore object, we should specify a number that indicates the maximum number of coroutines that can run concurrently until they get blocked.

```python
semaphore = asyncio.Semaphore(2)
```

`

We will declare a simple coroutine that uses the **async with semaphore** syntax to guard a block of code accessing a shared resource. This block will include an **await** call for a simulated I/O-bound task using **asyncio.sleep**.

```python
async def access_resource(resource_id):
    global semaphore
    async with semaphore:
        print(f"Accessing resource {resource_id}")
        await asyncio.sleep(1)
        print(f"Rleasing resource {resource_id}")
```

Next, we will call the **access_resource** coroutine function five times to create five coroutine objects. These will be stored in a list and then executed concurrently using **asyncio.gather**.

```python

async def main():
    coroutines = [access_resource(i) for i in range(5)]
    await asyncio.gather(*coroutines)

asyncio.run(main())

```

Let's combine all the previous code into a single file and run it.

```

Accessing resource 0
Accessing resource 1
Rleasing resource 0
Rleasing resource 1
-------------> After one second
Accessing resource 2
Accessing resource 3
Rleasing resource 2
Rleasing resource 3
-------------> After two seconds
Accessing resource 4
Rleasing resource 4
-------------> After three seconds
```

As you can see from the output code above, only a maximum of 2 coroutines get access to the resource at any given time.

1. **Coroutines 0 and 1** acquire the semaphore first, decrementing the counter from 2 to 0. All other coroutines are suspended.
2. While the first two tasks are "sleeping," the event loop tries to run the others, but they remain blocked in a queue because the counter is **0**.
3. Once Coroutines 0 and 1 call `release()`, the counter returns to **2**, allowing **Coroutines 2 and 3** to exit the queue and begin their work.
4. After another second, Coroutines 2 and 3 release the semaphore, finally permitting **Coroutine 4** to acquire it and finish.
5. The program concludes in approximately **3 seconds**, processing the five tasks in waves of two.

## Bounded Semaphore

Bounded semaphores are a safer alternative to standard semaphores. 

While a normal semaphore allows its **internal counter** to increase beyond its initial value, a bounded semaphore prevents this by raising a **ValueError** during the `release()` call if the counter exceeds that initial limit.



To demonstrate this, let's modify our previous code. 

First, we will update the instantiation line to use a `BoundedSemaphore` instead of a standard one:

```
```python
semaphore = asyncio.BoundedSemaphore(2)
```
```

Next, we will add an extra `release()` call at the end of our `main` function. By wrapping it in a `try...except` block, we can see exactly how the bounded semaphore handles a counter that exceeds its initial limit:

```
```python
async def main():
    coroutines = [access_resource(i) for i in range(5)]
    await asyncio.gather(*coroutines)
    try:
      semaphore.release() <--- extra release, throws an error when using a bounded semaphore.
    except ValueError as e:
      print(f"Safety Triggered: {e}")

asyncio.run(main())
```
```

Output:

```
# same logs as before
Safety Triggered: BoundedSemaphore released too many times

```

As you can see, an extra "**release()"** call results in a "**ValueError"** with the message "BoundedSemaphore released too many times."

## Event

### Introduction

An event is a synchronization primitive that is used to notify multiple tasks that a specific state has been reached or an action has occurred. 

Under the hood, it manages an internal boolean flag that tasks can wait on.

Events shine in **one-to-many communication**, where a single "setter" task needs to trigger the simultaneous resume of multiple "waiter" tasks.

### Practical Example

```python
import asyncio

event = asyncio.Event()
```

Let's instantiate our event object using the `asyncio.Event` class. 

Subsequently, we will declare the **"one"** side of the **one-to-many communication** mentioned earlier: the **"setter"** coroutine.

```python

async def setter():
    await asyncio.sleep(2) # simulate some IO
    event.set()
    print("setter: event has been set!")

```

The setter simply waits for an I/O-bound task to finish and then sets the event. 

You can think of it as someone shouting an alert: "The event is set, and enemies are coming!" 

Under the hood, this sets an internal boolean flag to **True**, signaling that the event has occurred and that all waiting tasks should awaken immediately. By default, this flag is set to **False**.



Next, let's declare our **waiter** coroutine. It simply calls the `event.wait()` method, which pauses the coroutine's execution until the internal flag is set to **True** by the **setter** coroutine.

```python
async def waiter(id):
    print(f"waiter {id}: waiting for the event to be set")
    await event.wait()
    print(f"waiter {id}: even has been set, continuing execution")

```



Next, let's call two **waiters** and one **setter** inside the `main()` function to run them all concurrently:

```python
def main():
 await asyncio.gather(waiter(1),waiter(2),setter())
```

> **Note:** The order in which parameters are passed to `gather()` does not matter.

Finally, let's combine everything together, then run the code:

```python
`
import asyncio
import time 

event = asyncio.Event()

# setter coroutine function code
# waiter coroutine function code...

async def main():
    start_time = time.perf_counter()

    await asyncio.gather(waiter(1),waiter(2),setter())

    end_time = time.perf_counter()
    duration = end_time - start_time
    print(f"Program executed in {duration} seconds")

asyncio.run(main())

```

Output:

```

waiter 1: waiting for the event to be set
waiter 2: waiting for the event to be set

setter: event has been set!

waiter 1: even has been set, continuing execution
waiter 2: even has been set, continuing execution

Program executed in 2.001378541928716 seconds

```

1. First, each **waiter** executes the code above the "**await event.wait()"** statement until the event loop pauses its execution.
2. After two seconds, the **setter** sets the internal flag to **True**, triggering the suspended coroutines to resume.

The program takes approximately two seconds to finish, matching the duration of the I/O-bound task that the **setter** was awaiting.

## Condition

### Introduction

You can think of a condition as a combination of a **lock** and an **event**.

1. The Lock Side: It ensures mutual exclusion. You cannot **check the condition** or **modify the shared state** without holding the lock.
2. The Event Side: It allows a task to pause and wait for a specific signal (notify() or notifiy_all()).

In fact, it's possible to have multiple condition objects sharing the same lock; you can just pass the lock as a parameter to the condition object when instantiating it.

```
lock = asyncio.Lock()
condition1 = asyncio.Condition(lock)
#... 1-N relationship between lock and condition
conditionN = asyncio.Condition(lock)
```



The recommended way for using a condition is inside an async with statement.

```
condition = asyncio.Condition()
shared_resource = 0 
# inside a coroutine
async waiter():
 async with condition:
   await cond.wait()
   # or with a condition
   await cond.wait_for(shared_resource > 3)
```

The async with syntax is equivalent to the following:

```
async waiter():
 await condition.aquire()
 try:
   await condition.wait()
   # or with a condition
   await conditionl.wait_for(shared_resource > 3)
  finally:
   condition.release()
```

### Practical Example

Let's start by declaring a variable representing a shared resource and then instantiate a condition object using asyncio. Condition class.

```
```python
import asyncio

shared_resource = 0
cond = asyncio.Condition()
```
```



&nbsp;

```
```python
async def waiter(name):
    global shared_resource

    print(f"Task {name} is waiting for resource to reach 3...")
       
    await cond.wait_for(lambda: shared_resource == 3)
 

    print(f"Task {name} sees resource is {shared_resource}. Starting work!")

    await asyncio.sleep(1) # Simulate an I/O-bound task.`
        
 
```
```



```
```python
async def incrementer():
    global shared_resource
    for i in range(5):
        await asyncio.sleep(0.5)
        
        async with cond:
            shared_resource += 1
            print(f"Incrementer: shared_resource is now {shared_resource}")

            cond.notify_all()
            
        
```
```



```python

async def main():
    await asyncio.gather(
        waiter("A"),
        waiter("B"),
        incrementer()
    )

asyncio.run(main())
```

Output:

```

Task A is waiting for resource to reach 3...
Task B is waiting for resource to reach 3...
Incrementer: shared_resource is now 1
Incrementer: shared_resource is now 2
Incrementer: shared_resource is now 3
Task A sees resource is 3. Starting work!
Task B sees resource is 3. Starting work!
Incrementer: shared_resource is now 4
Incrementer: shared_resource is now 5

```

## Barrier

```
```
import asyncio

async def worker(barrier, name):
    print(f"Worker {name} is preparing...")
    await asyncio.sleep(1)
    
    print(f"Worker {name} is waiting at the barrier.")
    try:
        # Execution pauses here until the 'parties' count is met
        await barrier.wait()
    except asyncio.BrokenBarrierError:
        print(f"Worker {name}: The barrier was reset or broken.")
        return

    print(f"Worker {name} passed the barrier! Starting work...")

async def main():
    # Define a barrier for 3 tasks
    barrier = asyncio.Barrier(3)

    await asyncio.gather(
        worker(barrier, "A"),
        worker(barrier, "B"),
        worker(barrier, "C")
    )

asyncio.run(main())
```
```

Output:

```
```
Worker A is preparing...
Worker B is preparing...
Worker C is preparing...
Worker A is waiting at the barrier.
Worker B is waiting at the barrier.
Worker C is waiting at the barrier.
Worker C passed the barrier! Starting work...
Worker A passed the barrier! Starting work...
Worker B passed the barrier! Starting work...
```
```



&nbsp;

&nbsp;

&nbsp;

&nbsp;