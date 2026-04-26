---
title: "Mastering Asyncio Synchronization: A Python Guide"
description: Stop race conditions in Python! Master asyncio synchronization
  using Lock, Semaphore, Bounded Semaphore, Event, Condition, and Barrier in
  this expert guide.
pubDate: 2026-04-23
updatedDate: 2026-04-23
tags:
  - python
  - programming
  - tutorial
series: python-asyncio
seriesOrder: 2
published: true
---
## Introduction

A common beginner mistake when starting out with asynchronous programming is thinking that your code is safe from race conditions just because it runs in a single thread. 

**That’s totally wrong!** 

Despite running in a single thread, async code runs concurrently. This means that as long as there is an `await` keyword inside your async function, your program is prone to race conditions. 

The reason is simple: as soon as an `await` line is executed, the decision of whether to proceed or switch to another coroutine is left entirely to the event loop.

Picture this: a credit coroutine reads a shared balance variable, awaits an I/O-bound task for a second, and then increments the previously read balance by 1.

```python
async def credit():
  global balance
  # read balance
  current_balance = balance # read current balance
  await asyncio.sleep(1) # Simulate an I/O-bound task.
  # write new balance balance
  balance = current_balance + 1
  
```

If you run these concurrently, you risk a race condition. Because the read and write operations are separated by an **await**, each coroutine can be paused at that point. While the first coroutine is suspended, another runs and updates the balance; when the first coroutine resumes, it overwrites the second one's work. This is known as a **lost update race condition**!

```text
  CREDIT        DEBIT
    │              │
  read(0)          │
    │              │
  await ───────►   │
    │           read(0)
    │              │
    │           await
    │              │
  write(1)      write(-1)
    │              │
    │         ─overwrites!─
              balance = -1  ✗
```

In this tutorial, I took a deep dive into **asyncio** synchronization primitives. These are essential tools for building flexible programs that are resilient to race conditions like the one we just saw. We will explore: Locks, Semaphores, Bounded Semaphores, events, Conditions And Barriers.



Without any further ado, let's dive straight into one of the most classic synchronization primitives.

## Lock

The most common way to handle **race conditions** in systems programming is through **mutexes**. A mutex ensures **mutually exclusive** access to a resource, meaning only one coroutine can access it at any given time.

In **asyncio**, this is implemented via the `asyncio.Lock` class. The Lock object acts as a guard; when a coroutine holds the lock, any other coroutine attempting to acquire it will be suspended until the lock is released.

```text
  CREDIT          DEBIT
    │                │
  acquire            │
  ╔══════════╗     blocked
  ║   read   ║       ⟳
  ║   await  ║       ⟳
  ║   write  ║       ⟳
  ╚══════════╝       │
  release        acquire
    │            ╔══════════╗
    │            ║   read   ║
    │            ║   await  ║
    │            ║   write  ║
    │            ╚══════════╝
    │              release
```



Here's an example of how you would create a mutex lock in asyncio:

```python

lock = asyncio.Lock() # <----------- lock object or mutex
balance = 0 # shared resource


async def credit():
    try:
      await lock.acquire() # <------- acquire, code guarded!
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



Let's create another **debit coroutine** that performs the same logic but **decrements** the balance by 1 instead of incrementing it. Next, we will run the credit and debit coroutines concurrently using **asyncio.gather**.

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

```text
 Semaphore(2)  counter=2

 [0] acquire  counter 2→1  ████
 [1] acquire  counter 1→0  ████
 [2]          counter = 0  ░░░░ ┐
 [3]          counter = 0  ░░░░ │ queue
 [4]          counter = 0  ░░░░ ┘

  ↑ [0],[1] release
    counter 0→2

 [2] acquire  counter 2→1  ████
 [3] acquire  counter 1→0  ████
 [4]          counter = 0  ░░░░

  ↑ [2],[3] release
    counter 0→2

 [4] acquire  counter 2→1  ████
```

While locks totally prevent access to resources, semaphores shine when you want to throttle requests or when a given resource **requires limited concurrent access**.

### Practical Example

When instantiating a semaphore object, we should specify a number that indicates the maximum number of coroutines that can run concurrently until they get blocked.

```python
semaphore = asyncio.Semaphore(2)
```

We will declare a simple coroutine that uses the **async with semaphore** syntax to guard a block of code accessing a shared resource. This block will include an **await** call for a simulated I/O-bound task using **asyncio.sleep**.

```python
async def access_resource(resource_id):
    global semaphore
    async with semaphore:
        print(f"Accessing resource {resource_id}")
        await asyncio.sleep(1)
        print(f"Releasing resource {resource_id}")
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
Releasing resource 0
Releasing resource 1
-------------> After one second
Accessing resource 2
Accessing resource 3
Releasing resource 2
Releasing resource 3
-------------> After two seconds
Accessing resource 4
Releasing resource 4
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

```python
semaphore = asyncio.BoundedSemaphore(2)
```

Next, we will add an extra `release()` call at the end of our `main` function. By wrapping it in a `try...except` block, we can see exactly how the bounded semaphore handles a counter that exceeds its initial limit:

```python
async def main():
    coroutines = [access_resource(i) for i in range(5)]
    await asyncio.gather(*coroutines)
    try:
      semaphore.release() # <--- extra release, throws an error when using a bounded semaphore.
    except ValueError as e:
      print(f"Safety Triggered: {e}")

asyncio.run(main())
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

Then, we will declare the **"one"** side of the **one-to-many communication** mentioned earlier: the **"setter"** coroutine.

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
    print(f"waiter {id}: event has been set, continuing execution")

```



Next, let's call two **waiters** and one **setter** inside the `main()` function to run them all concurrently:

```python
async def main():
    await asyncio.gather(waiter(1), waiter(2), setter())
```

> **Note:** The order in which parameters are passed to `gather()` does not matter.

Finally, let's combine everything together, then run the code:

```python
import asyncio
import time

event = asyncio.Event()

# setter coroutine function code
# waiter coroutine function code...

async def main():
    start_time = time.perf_counter()

    await asyncio.gather(waiter(1), waiter(2), setter())

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

waiter 1: event has been set, continuing execution
waiter 2: event has been set, continuing execution

Program executed in 2.001378541928716 seconds

```

1. First, each **waiter** executes the code above the "**await event.wait()"** statement until the event loop pauses its execution.
2. After two seconds, the **setter** sets the internal flag to **True**, triggering the suspended coroutines to resume.

The program takes approximately two seconds to finish, matching the duration of the I/O-bound task that the **setter** was awaiting.

## Condition

### Introduction

You can think of a condition as a combination of a **lock** and an **event**.

1. The Lock Side: It ensures mutual exclusion. You cannot **check the condition** or **modify the shared state** without holding the lock.
2. The Event Side: It allows a task to pause and wait for a specific signal (notify() or notify_all()).

In fact, it's possible to have multiple condition objects sharing the same lock; you can just pass the lock as a parameter to the condition object when instantiating it.

```
lock = asyncio.Lock()
condition1 = asyncio.Condition(lock)
#... 1-N relationship between lock and condition
conditionN = asyncio.Condition(lock)
```



The recommended way to use a condition is inside an `async with` statement.

```python
condition = asyncio.Condition()
shared_resource = 0
# inside a coroutine
async def waiter():
    global condition
    async with condition:
        await cond.wait()
        # or with a predicate
        await cond.wait_for(lambda: shared_resource > 3)
```

The `async with` syntax is equivalent to the following:

```python
async def waiter():
    global condition
    await condition.acquire()
    try:
        await condition.wait()
        # or with a predicate
        await condition.wait_for(lambda: shared_resource == 3)
    finally:
        condition.release()
```

Whether you're using `wait` or `wait_for`, a `RuntimeError` will be raised if you haven't acquired the lock yet, either manually or implicitly via the previously discussed `async with` syntax.



The "**await condition.wait()"** statement operates in two distinct phases:

```text
  WAITER         NOTIFIER
    │                │
  acquire             │
    │                │
  wait() ──────────► │
  release          acquire
  SUSPENDED ⟳     mutate
            ⟳     notify()
            ⟳     release
  re-acquire ◄────────┘
  returns True
    │
  continue
```

- **Release and Suspend:** The coroutine atomically releases the lock and yields control back to the event loop, remaining suspended until it is resumed by "**condition.notify"** or "**condition.notify_all."**
- **Reacquisition:** Once notified, the condition requires its lock.

> Once the lock is re-acquired, the `await condition.wait()` call returns `True`.

The "**await condition.wait_for(predicate)"** method functions similarly, but it accepts a callable that returns a boolean value. It effectively wraps **wait()** in a loop, repeatedly calling it until the predicate evaluates to **True**.

### Practical Example

Let's understand how conditions work in practice through a simpler waiters incrementer example.



Let's start by declaring a variable representing a shared resource and then instantiate a condition object using "asyncio.Condition" class.

```python
import asyncio

shared_resource = 0
cond = asyncio.Condition()
```



Next, we define the **waiter** coroutine. It uses the **wait_for** method to ensure the coroutine remains suspended until two requirements are met: it must be notified via **notify()** or **notify_all()**, and the predicate condition on the shared resource must evaluate to **True**. 

Once these conditions are satisfied, the coroutine reacquires the lock, sleeps for one second, and then releases the lock as the **async with condition** block exits.



```python
async def waiter(name):
    global shared_resource
    async with condition:
        print(f"Task {name} is waiting for resource to reach 3...")

        await cond.wait_for(lambda: shared_resource == 3)

        print(f"Task {name} sees resource is {shared_resource}. Starting work!")

        await asyncio.sleep(1) # Simulate an I/O-bound task.
```

Now, let's create our **incrementer** coroutine. The **incrementer's** job, as the name implies, is to modify the shared resource by incrementing it five times every **0.5** seconds. For each iteration, it sleeps, increments the shared resource by **1**, and notifies all the waiters.

Note that we had to wrap the resource mutation and notification code within an **async with condition** block because the **Condition** mechanism requires it. If you call it without a lock, a **RuntimeError** will be raised.

```python
async def incrementer():
    global shared_resource
    for i in range(5):
        await asyncio.sleep(0.5)

        async with condition:
            shared_resource += 1
            print(f"Incrementer: shared_resource is now {shared_resource}")

            condition.notify_all()
```

Finally, let's create two waiters, **A** and **B**, and run them concurrently with the incrementer using the **asyncio.gather** method.

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

I think that the output should be self explanatory.

1. First, the waiters acquire the lock, release it, and pause just after the **wait_for** line. They remain suspended until the **incrementer** calls **notify** and the predicate condition is satisfied.
2. As you can see from the output, Waiters **A** and **B** only start their work once the **shared_resource** value reaches **3**.



## Barrier

### Introduction

As the name implies, a **Barrier** can be thought of as an imaginary gate that stops tasks from progressing so they can wait for each other and meet at a single synchronization point. 

No task is allowed to pass the gate until the required number of participants has arrived. 



### Code Example

Let's start by instantiating a **Barrier** object, which is a gate that only opens when three participants or coroutines arrive.

```python
barrier = asyncio.Barrier(3)
```

Then, let's create a **worker** coroutine which does the following: it sleeps for one second to simulate an I/O-bound task and then awaits the **barrier**, which pauses the worker until the number of suspended workers at that line reaches three.

```python
async def worker(name):
    global barrier
    print(f"Worker {name} is preparing...")
    await asyncio.sleep(1) # simulate an I/O-bound task

    print(f"Worker {name} is waiting at the barrier.")
    try:
        # Execution pauses here until the 'parties' count is met
        await barrier.wait()
    except asyncio.BrokenBarrierError:
        print(f"Worker {name}: The barrier was reset or broken.")
        return

    print(f"Worker {name} passed the barrier! Starting work...")
```



Finally, let's run three workers concurrently using the **asyncio.gather** method.

```python
import asyncio

async def main():
    await asyncio.gather(
        worker("A"),
        worker("B"),
        worker("C")
    )

asyncio.run(main())
```

Output:

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

As you can see from the output, workers **A**, **B**, and **C** don't start their work until all of them reach the barrier line of code. The barrier ensures that the workers meet at a single synchronization point, **"the gate"**, and then start running together concurrently.



## Conclusion

If you’ve made it this far, I’d like to thank you for taking the time to read. I wrote this article for my past self, who struggled to understand these concepts.

I hope you found this helpful and informative. If you have any questions or suggestions, feel free to reach out. You'll find all my social media links on the [Contact Page](/contact).


&nbsp;