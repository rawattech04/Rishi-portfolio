import { FaYoutube, FaFacebook } from "react-icons/fa";
import {
  RxDiscordLogo,
  RxGithubLogo,
  RxInstagramLogo,
  RxTwitterLogo,
  RxLinkedinLogo,
} from "react-icons/rx";

export const SKILL_DATA = [
  {
    skill_name: "HTML",
    image: "html.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "CSS",
    image: "css.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "JavaScript",
    image: "js.png",
    width: 65,
    height: 65,
  },
  {
    skill_name: "Tailwind CSS",
    image: "tailwind.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "React",
    image: "react.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Redux",
    image: "redux.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "React Query",
    image: "reactquery.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "TypeScript",
    image: "ts.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Next.js 14",
    image: "next.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Framer Motion",
    image: "framer.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Stripe",
    image: "stripe.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Node.js",
    image: "node.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "MongoDB",
    image: "mongodb.png",
    width: 40,
    height: 40,
  },
] as const;

export const SOCIALS = [
  {
    name: "Instagram",
    icon: RxInstagramLogo,
    link: "https://instagram.com/rishitech04",
  },
  {
    name: "Twitter",
    icon: RxTwitterLogo,
    link: "https://x.com/Rishi_Rawat_04",
  },
  {
    name: "LinkedIn",
    icon: RxLinkedinLogo,
    link: "https://www.linkedin.com/in/rishi-rawat-a6632a251",
  },
] as const;

export const FRONTEND_SKILL = [
  {
    skill_name: "HTML",
    image: "html.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "CSS",
    image: "css.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "JavaScript",
    image: "js.png",
    width: 65,
    height: 65,
  },
  {
    skill_name: "Tailwind CSS",
    image: "tailwind.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Material UI",
    image: "mui.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "React",
    image: "react.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Redux",
    image: "redux.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "React Query",
    image: "reactquery.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "TypeScript",
    image: "ts.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Next.js 14",
    image: "next.png",
    width: 80,
    height: 80,
  }
] as const;

export const BACKEND_SKILL = [
  {
    skill_name: "Node.js",
    image: "node.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Express.js",
    image: "express.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "MongoDB",
    image: "mongodb.png",
    width: 40,
    height: 40,
  },
  {
    skill_name: "Firebase",
    image: "firebase.png",
    width: 55,
    height: 55,
  },
  {
    skill_name: "PostgreSQL",
    image: "postgresql.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "MySQL",
    image: "mysql.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Prisma",
    image: "prisma.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Graphql",
    image: "graphql.png",
    width: 80,
    height: 80,
  },
] as const;

export const FULLSTACK_SKILL = [
  {
    skill_name: "React Native",
    image: "reactnative.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Tauri",
    image: "tauri.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Docker",
    image: "docker.png",
    width: 70,
    height: 70,
  },

  {
    skill_name: "Figma",
    image: "figma.png",
    width: 50,
    height: 50,
  },
] as const;

export const OTHER_SKILL = [
  {
    skill_name: "Go",
    image: "go.png",
    width: 60,
    height: 60,
  },
] as const;

export const PROJECTS = [
  {
    title: "Tour & Travel Website",
    description:
      "A fully responsive tour and travel booking platform developed with Next.js and Redux for state management. It includes dynamic tour listings, filtering, and a secure booking system powered by Node.js and MongoDB. Real-time charts provide insights using Chart.js.",
    image: "/projects/project2.png",
    link: "https://tour-travels-39t9.vercel.app/",
    technologies: ["Next.js", "React", "Redux", "Node.js", "MongoDB", "Chart.js", "Prisma"]
  },
  {
    title: "Grocery Store Website",
    description:
      "An eCommerce grocery platform built with the MERN stack, offering real-time product browsing, cart management, and order tracking. Enhanced with Tailwind CSS and MUI for a modern UI, GraphQL for data querying, and CI/CD workflows for seamless deployment.",
    image: "/projects/project1.png",
    link: "https://grocery04.netlify.app/",
    technologies: ["MongoDB", "Express", "React", "Node.js", "Tailwind CSS", "MUI", "GraphQL", "CI/CD"]
  },
  {
    title: "Full Dashboard To Manage Your Business",
    description:
      "An immersive 3D business management dashboard leveraging React Three Fiber, Three.js, and Blender for a highly visual interface. Includes analytics, real-time interaction, and WebGL-powered visuals for data-rich storytelling and user engagement.",
    image: "/projects/project3.png",
    link: "https://tour-travels-theta.vercel.app/signin",
    technologies: ["React", "Three.js", "React Three Fiber", "WebGL", "GLSL", "Blender"]
  }
] as const;


export const FOOTER_DATA = [
  {
    title: "Social Media",
    data: [
      {
        name: "Instagram",
        icon: RxInstagramLogo,
        link: "https://instagram.com/rishitech04",
      },
      {
        name: "Twitter",
        icon: RxTwitterLogo,
        link: "https://x.com/Rishi_Rawat_04",
      },
      {
        name: "LinkedIn",
        icon: RxLinkedinLogo,
        link: "https://www.linkedin.com/in/rishi-rawat-a6632a251",
      },
    ],
  },
  {
    title: "Professional",
    data: [
      {
        name: "GitHub",
        icon: RxGithubLogo,
        link: "https://github.com/rishirawat04",
      },
      {
        name: "Upwork",
        icon: null,
        link: "https://www.upwork.com/freelancers/~014d03d2c1e31483c9",
      },
      {
        name: "Freelancer",
        icon: null,
        link: "https://www.freelancer.in/u/rishir61",
      },
    ],
  },
  {
    title: "Contact",
    data: [
      {
        name: "Email",
        icon: null,
        link: "mailto:contact@example.com",
      },
    ],
  },
] as const;

export const NAV_LINKS = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "Projects",
    link: "/projects",
  },
  {
    title: "Blogs",
    link: "/blog",
  },
  {
    title: "Contact",
    link: "/contact",
  },
] as const;

export const LINKS = {
  sourceCode: "https://github.com/rishirawat04",
};

export interface BlogSection {
  title: string;
  content: string;
  image?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  image: string;
  date: string;
  sections?: BlogSection[];
}

export const BLOGS: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Web Development",
    summary: "Exploring the latest trends and technologies shaping the future of web development",
    content: "Web development is constantly evolving, with new technologies and methodologies emerging at a rapid pace. From AI-powered development tools to revolutionary frameworks, the landscape of web development is undergoing a significant transformation.",
    image:  "/projects/project3.png",
    date: "2024-03-15",
    sections: [
      {
        title: "The Rise of AI in Web Development",
        content: "Artificial Intelligence is revolutionizing how we build and maintain web applications. From code generation to automated testing, AI tools are becoming an integral part of the modern developer's toolkit. This shift is not just about automation; it's about enhancing developer productivity and enabling more innovative solutions.",
        image: "/projects/project2.png"
      },
      {
        title: "New Frontend Frameworks",
        content: "Modern frontend frameworks are becoming more powerful and developer-friendly. With the advent of meta-frameworks and improved build tools, developers can now create more sophisticated applications with less code. The focus is shifting towards better performance, developer experience, and end-user satisfaction."
      }
    ]
  },
  {
    id: "2",
    title: "Mastering React Performance",
    summary: "Learn the best practices for optimizing React applications",
    content: "Performance optimization is crucial for delivering a smooth user experience in React applications. Understanding how React works under the hood and implementing proper optimization techniques can significantly improve your application's performance.",
    image: "/projects/project2.png",
    date: "2024-03-10",
    sections: [
      {
        title: "Component Optimization",
        content: "Understanding how to optimize React components is essential for building performant applications. This includes proper use of hooks, memoization techniques, and efficient state management. By following these best practices, you can ensure your components render efficiently and maintain smooth user interactions."
      }
    ]
  },
  {
    id: "3",
    title: "Building Scalable Backend Systems",
    summary: "A comprehensive guide to building scalable backend architectures",
    content: "Scalability is a critical aspect of modern web applications. As your user base grows, your backend system needs to handle increased load efficiently while maintaining performance and reliability.",
    image: "/projects/project1.png",
    date: "2024-03-05",
    sections: [
      {
        title: "Microservices Architecture",
        content: "Exploring the benefits and challenges of microservices architecture. While microservices offer great flexibility and scalability, they also introduce complexity in terms of deployment, monitoring, and maintenance. Understanding when and how to implement microservices is crucial for building successful scalable systems."
      }
    ]
  },
  {
    id: "4",
    title: "The Future of Web Development",
    summary: "Exploring the latest trends and technologies shaping the future of web development",
    content: "Web development is constantly evolving, with new technologies and methodologies emerging at a rapid pace. From AI-powered development tools to revolutionary frameworks, the landscape of web development is undergoing a significant transformation.",
    image:  "/projects/project3.png",
    date: "2024-03-15",
    sections: [
      {
        title: "The Rise of AI in Web Development",
        content: "Artificial Intelligence is revolutionizing how we build and maintain web applications. From code generation to automated testing, AI tools are becoming an integral part of the modern developer's toolkit. This shift is not just about automation; it's about enhancing developer productivity and enabling more innovative solutions.",
        image: "/projects/project2.png"
      },
      {
        title: "New Frontend Frameworks",
        content: "Modern frontend frameworks are becoming more powerful and developer-friendly. With the advent of meta-frameworks and improved build tools, developers can now create more sophisticated applications with less code. The focus is shifting towards better performance, developer experience, and end-user satisfaction."
      }
    ]
  },
  {
    id: "5",
    title: "Mastering React Performance",
    summary: "Learn the best practices for optimizing React applications",
    content: "Performance optimization is crucial for delivering a smooth user experience in React applications. Understanding how React works under the hood and implementing proper optimization techniques can significantly improve your application's performance.",
    image: "/projects/project2.png",
    date: "2024-03-10",
    sections: [
      {
        title: "Component Optimization",
        content: "Understanding how to optimize React components is essential for building performant applications. This includes proper use of hooks, memoization techniques, and efficient state management. By following these best practices, you can ensure your components render efficiently and maintain smooth user interactions."
      }
    ]
  },
  {
    id: "6",
    title: "Building Scalable Backend Systems",
    summary: "A comprehensive guide to building scalable backend architectures",
    content: "Scalability is a critical aspect of modern web applications. As your user base grows, your backend system needs to handle increased load efficiently while maintaining performance and reliability.",
    image: "/projects/project1.png",
    date: "2024-03-05",
    sections: [
      {
        title: "Microservices Architecture",
        content: "Exploring the benefits and challenges of microservices architecture. While microservices offer great flexibility and scalability, they also introduce complexity in terms of deployment, monitoring, and maintenance. Understanding when and how to implement microservices is crucial for building successful scalable systems."
      }
    ]
  }
];
