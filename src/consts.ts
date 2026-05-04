// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_URL = "https://sidaliassoul.com";
export const SITE_TITLE = "Sidali Assoul";
export const SITE_DESCRIPTION =
  "Full Stack Engineer specializing in scalable SaaS platforms and AI microservices. NestJS, Next.js, TypeScript, Laravel.";

export const CONTACT = {
  subtitle:
    "I'm open to full-time remote roles, international opportunities, and freelance projects. Pick the channel that works best for you.",
  availabilityText: "Available for new opportunities",
  platforms: [
    {
      name: "X",
      handle: "Follow on X",
      url: "https://x.com/stormsidali",
      icon: "/x-icon.png",
      group: "social",
    },
    {
      name: "YouTube",
      handle: "Watch on YouTube",
      url: "https://www.youtube.com/@notjustcoders",
      icon: "/youtube-icon.png",
      group: "social",
    },
    {
      name: "Upwork",
      handle: "Freelance profile",
      url: "https://www.upwork.com/freelancers/~01edce0d724b5aa1d2",
      icon: "/upwork-icon.png",
      group: "freelancing",
    },
    {
      name: "Fiverr",
      handle: "Freelance profile",
      url: "https://www.fiverr.com/s/pd1m6zY",
      icon: "/fiverr-icon.png",
      group: "freelancing",
    },
    // {
    //   name: "Toptal",
    //   handle: "Expert network",
    //   url: "https://www.toptal.com",
    //   icon: "/toptal-icon.png",
    //   group: "freelancing",
    // },
    // {
    //   name: "Freelancer",
    //   handle: "Freelance profile",
    //   url: "https://www.freelancer.com",
    //   icon: "/freelancer-icon.png",
    //   group: "freelancing",
    // },
  ] as const,
} as const;

export const SKILLS = [
  { label: 'Languages', details: 'Python, PHP, Java, SQL, TypeScript, JavaScript, C++' },
  { label: 'Frameworks and Libraries', details: 'NestJS, Django, FastAPI, Laravel' },
  { label: 'Backend and Infrastructure', details: 'AWS, GCP, Kubernetes, Docker, MySQL, PostgreSQL, GitHub Actions' },
] as const;

export const AUTHOR = {
  name: "Sidali Assoul",
  jobTitle: "Full Stack Engineer",
  headline:
    "Software Engineer | Full Stack Developer | Master in Computer Science",
  location: "Bejaia, Algeria",
  phone: "+213561536838",
  tagline:
    "I build scalable SaaS platforms and AI microservices that stay stable in production, leveraging Clean Architecture, DDD, and high-performance engineering.",
  bio: "Full-stack engineer obsessed with understanding the core gist of your business before touching the keyboard. I build scalable SaaS platforms and AI microservices that stay stable in production, leveraging Clean Architecture, DDD, and high-performance engineering.",
  email: "assoulsidali@gmail.com",
  linkedin: "https://linkedin.com/in/sidali-assoul",
  github: "https://github.com/stormsidali2001",
  avatar: "/profile.jpg",
} as const;
