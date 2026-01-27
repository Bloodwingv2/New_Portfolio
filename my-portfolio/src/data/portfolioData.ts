export interface Experience {
    id: string;
    role: string;
    company: string;
    period: string;
    description: string;
}

export interface Certification {
    name: string;
    issuer: string;
    date: string;
    link?: string;
}

export interface Interest {
    title: string;
    description: string;
    icon: string;
}

export const portfolioData = {
    name: "Mirang Bhandari",
    role: "Software Engineer & AI Researcher",
    location: "Mannheim, Germany",
    profileImage: "me.jpg", // Update this with your actual image path (e.g., /profile.jpg)
    bio: `I am a software engineer who loves experimentation, building impactful software, contributing to open source and reading up on tech documentation.
  
  I’m currently a Data Science & AI Grad student at SRH Heidelberg. I build data-driven and AI-powered solutions, combining Data Acquisition, Machine Learning, Backend, DevOps and Cloud Technologies to turn complex data into actionable insights for companies.`,
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
            skills: ["React", "Next.js", "Node.js", "PostgreSQL", "GraphQL", "FastAPI"]
        },
        {
            title: "Tools & Cloud",
            icon: "tool",
            skills: ["Docker", "AWS", "Git", "Linux", "CI/CD", "MLOps"]
        }
    ],
    experience: [
        {
            id: "exp1",
            role: "Software Engineer",
            company: "Tech Corp",
            period: "2023 - Present",
            description: "Developing scalable web applications and AI solutions."
        },
        {
            id: "exp2",
            role: "Junior Developer",
            company: "Startup Inc",
            period: "2021 - 2023",
            description: "Built full-stack applications using React and Node.js."
        }
    ] as Experience[],
    certifications: [
        {
            name: "AWS Certified Solutions Architect",
            issuer: "Amazon Web Services",
            date: "2024"
        },
        {
            name: "TensorFlow Developer Certificate",
            issuer: "Google",
            date: "2023"
        }
    ] as Certification[],
    hobbies: [
        "Photography",
        "Hiking",
        "Reading Sci-Fi",
        "Gaming"
    ],
    interests: [
        { title: "Generative AI", description: "Exploring LLMs and image generation models.", icon: "brain" },
        { title: "Open Source", description: "Contributing to community-driven projects.", icon: "github" }
    ] as Interest[],
    projects: [
        {
            id: "mindwell",
            title: "Mindwell",
            category: "Offline AI Application",
            description: "An offline AI application focused on mental wellness and privacy-first interactions.",
            link: "https://mirang.framer.ai/projects/mindwell",
            image: "https://placehold.co/600x400/1a1a1a/ffffff?text=Mindwell"
        },
        {
            id: "stockscreener",
            title: "StockScreener Agent",
            category: "Local StockAnalyser AI Agent",
            description: "A local AI agent designed to analyze stock market trends and provide screening data.",
            link: "https://mirang.framer.ai/projects/stockscreener",
            image: "https://placehold.co/600x400/1a1a1a/ffffff?text=StockScreener"
        },
        {
            id: "dataset",
            title: "Electoral Dataset",
            category: "Custom Dataset",
            description: "A comprehensive custom dataset curated for electoral analysis and data science projects.",
            link: "https://mirang.framer.ai/projects/dataset",
            image: "https://placehold.co/600x400/1a1a1a/ffffff?text=Dataset"
        },
        {
            id: "mlops",
            title: "MLOPS Pipeline",
            category: "MLOPS Simulation",
            description: "A complete simulation of an MLOps pipeline demonstrating CI/CD for machine learning models.",
            link: "https://mirang.framer.ai/projects/mlops",
            image: "https://placehold.co/600x400/1a1a1a/ffffff?text=MLOps"
        }
    ],
    socials: [
        { name: "Email", url: "mailto:bhandarimirang03@gmail.com", handle: "bhandarimirang03@gmail.com" },
        { name: "GitHub", url: "https://github.com/Bloodwingv2", handle: "@Bloodwingv2" },
        { name: "X (Twitter)", url: "https://x.com/Angrycoder97", handle: "@Angrycoder97" },
        { name: "LinkedIn", url: "https://www.linkedin.com/in/mirangbhandari/", handle: "Mirang Bhandari" }
    ],
    resumeUrl: "/resume.pdf", // Place your resume in the public folder
    funFacts: [
        "I once debugged code in my sleep.",
        "I can explain Neural Networks using pizza toppings.",
        "My favorite keyboard shortcut is Ctrl+Z (for obvious reasons)."
    ]
};

export const suggestPrompts = [
    "Tell me about yourself",
    "Show me your projects",
    "What are your skills?",
    "Work Experience",
    "Certifications",
    "My Hobbies",
    "Contact Me"
];
