import mindwellImg from '../assets/gemma.avif';
import stockscreenerImg from '../assets/stockscreener.avif';
import datasetImg from '../assets/electoral.avif';
import mlopsImg from '../assets/Mlflow.avif';
import keysightLogo from '../assets/kt.jpg';
import resoluteLogo from '../assets/rai.jpg';
import githubLogo from '../assets/gh.jpg';
import meImg from '../assets/me.jpg';
import wassertumimg from '../assets/wassertum.jpg'

// ===================================
// Type Definitions
// ===================================

export interface Experience {
    id: string;
    role: string;
    company: string;
    period: string;
    description: string;
    logo?: string;
}

export interface Certification {
    id: string;
    name: string;
    issuer: string;
    date: string;
    link?: string;
    description: string;
    icon: string;
}

export interface Interest {
    title: string;
    description: string;
    icon: string;
}

// ===================================
// Main Portfolio Data
// ===================================

export const portfolioData = {

    // --- Personal Information ---
    name: "Mirang Bhandari",
    role: "Software Engineer & AI Researcher",
    location: "Mannheim, Germany",
    profileImage: meImg,
    headerImage: wassertumimg,

    bio: `I am a software engineer who loves experimentation, building impactful software, contributing to open source and reading up on tech documentation.
  
I’m currently a Data Science & AI Grad student at SRH Heidelberg. I build data-driven and AI-powered solutions, combining Data Acquisition, Machine Learning, Backend, DevOps and Cloud Technologies to turn complex data into actionable insights for companies.

I'm also an avid Agentic Ai Researcher who is actively building industry grade agents and trying to create meaningful research with them`,

    // --- Skills ---
    skills: [
        {
            title: "Programming Languages",
            icon: "code",
            skills: ["Python", "TypeScript", "JavaScript", "SQL", "C++"]
        },
        {
            title: "AI & Data Science",
            icon: "cpu",
            skills: ["TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "Computer Vision", "NLP"]
        },
        {
            title: "Web & Backend",
            icon: "globe",
            skills: ["React", "PostgreSQL", "FastAPI"]
        },
        {
            title: "Cloud and DevOps",
            icon: "tool",
            skills: ["Docker", "AWS", "Git", "Linux", "CI/CD", "Jenkins", "MLFlow"]
        },
        {
            title: "Agentic AI",
            icon: "tool",
            skills: ["LangGraph", "LangChain", "Ollama", "n8n"]
        }
    ],

    // --- Work Experience ---
    experience: [
        {
            id: "exp1",
            role: "AI & Full Stack Engineer",
            company: "Freelancer",
            period: "2024 Aug - 2025 Nov",
            description: "Growing open-source presence: 2,000+ GitHub profile views and 30+ stars across repositories.\nBuilt \"MindWell\" for the Google DeepMind Hackathon an offline-first mental wellness desktop app focused on data privacy.\nFormer LangChain contributor identified GROQ model compatibility issues.\nFormer React Native community supporter merged PRs to help developers migrate libraries to Expo and resolve integration bottlenecks.",
            logo: githubLogo
        },
        {
            id: "exp2",
            role: "DevOps Engineer",
            company: "Keysight Technologies",
            period: "2024 Feb - 2024 July",
            description: "Implemented two seamless Jenkins automation pipelines using Groovy and Python that significantly reduced manual effort and improved efficiency for electronics testing. Over the course of five months, delivered five major pipeline enhancements using HTML5, CSS based technologies to create CI/CD Pipelines, while contributing more than 5,000 lines of production code across 500+ commits. In addition, Created detailed documentation to support pipeline improvements and ensure smooth knowledge transfer along United States and Penang Based DevOps Teams ensuring global collaboration",
            logo: keysightLogo
        },
        {
            id: "exp3",
            role: "Deep Learning Intern",
            company: "Resolute.AI",
            period: "2023 Jan - 2023 May",
            description: "Developed Computer Vision proof-of-concepts and worked extensively with NLP and machine learning using Python. This included building, testing, and evaluating ML/DL models to address real-world challenges. I also conducted image annotation to create custom datasets tailored for object detection tasks",
            logo: resoluteLogo
        }
    ] as Experience[],

    // --- Certifications ---
    certifications: [
        {
            id: "cert1",
            name: "AWS Certified Solutions Architect",
            issuer: "Amazon Web Services",
            date: "2024",
            description: "Validated expertise in designing distributed systems on AWS, covering security, reliability, and scalability best practices.",
            link: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
            icon: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"
        },
        {
            id: "cert2",
            name: "TensorFlow Developer Certificate",
            issuer: "Google",
            date: "2023",
            description: "Demonstrated proficiency in building and training neural networks using TensorFlow, including CNNs, RNNs, and NLP models.",
            link: "https://www.credential.net/",
            icon: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg"
        }
    ] as Certification[],

    // --- Projects ---
    projects: [
        {
            id: "mindwell",
            title: "Mindwell",
            category: "Offline AI Application",
            description: "An offline AI application focused on mental wellness and privacy-first interactions.",
            link: "https://mirang.framer.ai/projects/mindwell",
            image: mindwellImg
        },
        {
            id: "stockscreener",
            title: "StockScreener Agent",
            category: "Local StockAnalyser AI Agent",
            description: "A local AI agent designed to analyze stock market trends and provide screening data.",
            link: "https://mirang.framer.ai/projects/stockscreener",
            image: stockscreenerImg
        },
        {
            id: "dataset",
            title: "Electoral Dataset",
            category: "Custom Dataset",
            description: "A comprehensive custom dataset curated for electoral analysis and data science projects.",
            link: "https://mirang.framer.ai/projects/dataset",
            image: datasetImg
        },
        {
            id: "mlops",
            title: "MLOPS Pipeline",
            category: "MLOPS Simulation",
            description: "A complete simulation of an MLOps pipeline demonstrating CI/CD for machine learning models.",
            link: "https://mirang.framer.ai/projects/mlops",
            image: mlopsImg
        }
    ],

    // --- Social Media ---
    socials: [
        {
            name: "Email",
            url: "mailto:bhandarimirang03@gmail.com",
            handle: "bhandarimirang03@gmail.com"
        },
        {
            name: "GitHub",
            url: "https://github.com/Bloodwingv2",
            handle: "@Bloodwingv2"
        },
        {
            name: "X (Twitter)",
            url: "https://x.com/Angrycoder97",
            handle: "@Angrycoder97"
        },
        {
            name: "LinkedIn",
            url: "https://www.linkedin.com/in/mirangbhandari/",
            handle: "Mirang Bhandari"
        }
    ],

    // --- Other Interests ---
    hobbies: [
        "Photography",
        "Hiking",
        "Reading Sci-Fi",
        "Gaming"
    ],

    interests: [
        {
            title: "Generative AI",
            description: "Exploring LLMs and image generation models.",
            icon: "brain"
        },
        {
            title: "Open Source",
            description: "Contributing to community-driven projects.",
            icon: "github"
        }
    ] as Interest[],

    // --- Resume & Fun Facts ---
    resumeUrl: "/resume.pdf",

    funFacts: [
        "I once debugged code in my sleep.",
        "I can explain Neural Networks using pizza toppings.",
        "My favorite keyboard shortcut is Ctrl+Z (for obvious reasons)."
    ]
};

// ===================================
// Chat Prompts
// ===================================

export const suggestPrompts = [
    "Tell me about yourself",
    "Show me your projects",
    "What are your skills?",
    "Work Experience",
    "Certifications",
    "My Hobbies",
    "Contact Me"
];
