---
title: "Title Here"
description: "Description Here"
pubDate: 2025-04-16
# heroImage: "/assets/courses/react-fundamentals/your-first-component.jpg"
tags: []
# videoUrl: "https://www.youtube.com/embed/chapter4-example"
# videoTitle: "Creating Your First React Component"
series: "react-fundamentals-course"
seriesOrder: 13
resources: []
---

<!-- Hook: Problem-solution hook -->
<!-- Problem -->
<!-- 🎥 [Visual: Sid's face, dramatic zoom-in with a meme of a counter stuck at 1] -->
Picture this: You're clicking a button, hammering `setCounter` three times in a row to bump up your `React` `counter`.

```tsx
function App() {
  const [counter, setCounter] = useState(0);
  return (
    <>
      {counter}
      <button
        onClick={() => {
          setCounter(counter + 1);
          setCounter(counter + 1);
          setCounter(counter + 1);
        }}
      >
        Increment
      </button>
    </>
  );
}
```

You're expecting it to increment by 3 right?
But React decides to throw big no, and make fun of you and just increment it by 1.
Come on, is React trolling us on purpose? What kind of sneaky state queuing tricks is it playing with us?

<!-- Introduction -->
Well, we are here just to unveil this mystery. We will understand why is React doing that? And what alternatives does it offer to achieve this intended behavior?

<!-- Visualizing the behavior -->
So if that's sounds interesting, Let's dive in.

<!-- Body -->
<!-- CTA + Call to action -->
<!-- Attention -->
<!-- Curiosity -->
<!-- Action -->
