import uuid


def uid():
    return str(uuid.uuid4())[:8]


def default_content() -> dict:
    return {
        "hero": {
            "greeting": "Hello, I'm",
            "firstName": "Dinesh",
            "lastName": "Singh",
            "roles": ["Data Analyst", "Web Developer", "ML Engineer", "Power BI Expert"],
            "bio": "B.Tech AI & Data Science student skilled in SQL, Power BI, Python & React. I transform raw data into meaningful insights and build modern web applications.",
            "resumeUrl": "/assets/Resume.pdf",
            "profileImage": "/assets/images/profile.png",
            "badges": ["Data Analyst", "React Dev", "ML Engineer"],
            "socialLinks": {
                "github": "https://github.com/dineshsingh099",
                "linkedin": "https://linkedin.com/in/dineshsingh09",
                "instagram": "https://instagram.com/dineshsingh_077",
                "email": "dineshrawatdd088@gmail.com",
            },
        },
        "about": {
            "heading": "Building Digital",
            "highlight": "Experiences",
            "paragraphs": [
                "I'm a final-year B.Tech student in AI & Data Science at Poornima University, Jaipur — CGPA 8.1/10. I work at the intersection of data analysis and web development, turning complex datasets into actionable business insights and building performant, modern web apps.",
                "Backed by an ML Research Internship at Axis India and industry simulations with Deloitte and Tata Forage, I bring real-world analytical thinking to every project.",
            ],
            "techPills": ["Python", "SQL", "Power BI", "React", "FastAPI", "MongoDB", "Scikit-learn"],
            "stats": [
                {"icon": "fa-solid fa-graduation-cap", "value": "8.1", "suffix": "/10", "label": "CGPA – B.Tech AI & DS"},
                {"icon": "fa-solid fa-folder-open", "value": "15", "suffix": "+", "label": "Projects Completed"},
                {"icon": "fa-solid fa-certificate", "value": "5", "suffix": "+", "label": "Certifications"},
                {"icon": "fa-solid fa-briefcase", "value": "2", "suffix": "mo", "label": "Industry Internship"},
            ],
        },
        "skills": [
            {
                "id": uid(), "category": "frontend", "title": "Frontend", "icon": "fa-solid fa-laptop-code",
                "items": [
                    {"icon": "fa-brands fa-html5", "label": "HTML5"},
                    {"icon": "fa-brands fa-css3-alt", "label": "CSS3"},
                    {"icon": "fa-brands fa-js", "label": "JavaScript"},
                    {"icon": "fa-brands fa-react", "label": "React"},
                ],
            },
            {
                "id": uid(), "category": "backend", "title": "Backend", "icon": "fa-solid fa-server",
                "items": [
                    {"icon": "fa-brands fa-python", "label": "FastAPI"},
                    {"icon": "fa-brands fa-node-js", "label": "Node.js"},
                    {"icon": "fa-solid fa-gears", "label": "REST APIs"},
                    {"icon": "fa-solid fa-shield-halved", "label": "JWT Auth"},
                ],
            },
            {
                "id": uid(), "category": "data", "title": "Data & ML", "icon": "fa-solid fa-chart-bar",
                "items": [
                    {"icon": "fa-brands fa-python", "label": "Pandas / NumPy"},
                    {"icon": "fa-solid fa-brain", "label": "Scikit-learn"},
                    {"icon": "fa-solid fa-chart-area", "label": "Matplotlib"},
                    {"icon": "fa-solid fa-file-excel", "label": "Power BI / Excel"},
                ],
            },
            {
                "id": uid(), "category": "data", "title": "Databases", "icon": "fa-solid fa-database",
                "items": [
                    {"icon": "fa-solid fa-database", "label": "MySQL"},
                    {"icon": "fa-solid fa-leaf", "label": "MongoDB"},
                    {"icon": "fa-solid fa-code", "label": "SQL Queries"},
                    {"icon": "fa-solid fa-table", "label": "Data Modeling"},
                ],
            },
            {
                "id": uid(), "category": "tools", "title": "Tools & Design", "icon": "fa-solid fa-toolbox",
                "items": [
                    {"icon": "fa-brands fa-git-alt", "label": "Git / GitHub"},
                    {"icon": "fa-brands fa-figma", "label": "Figma"},
                    {"icon": "fa-solid fa-terminal", "label": "Linux / WSL"},
                    {"icon": "fa-solid fa-code", "label": "VS Code"},
                ],
            },
            {
                "id": uid(), "category": "data", "title": "Analytics", "icon": "fa-solid fa-magnifying-glass-chart",
                "items": [
                    {"icon": "fa-solid fa-broom", "label": "Data Cleaning"},
                    {"icon": "fa-solid fa-microscope", "label": "EDA"},
                    {"icon": "fa-solid fa-chart-pie", "label": "Dashboards"},
                    {"icon": "fa-solid fa-lightbulb", "label": "Insight Generation"},
                ],
            },
        ],
        "experience": [
            {
                "id": uid(), "badgeText": "Internship", "badgeIcon": "fa-solid fa-briefcase",
                "date": "May 2024 – June 2024", "title": "Research & Development Intern (Machine Learning)",
                "organization": "Axis India Machine Learning · Jaipur, Rajasthan",
                "bullets": [
                    "Implemented ML models including Perceptron and Multi-Layer Perceptron (MLP)",
                    "Developed neural network from scratch (XOR problem) using forward and backpropagation",
                    "Designed modular ML pipelines for preprocessing, training, evaluation, and prediction",
                    "Managed ML workflows in Linux (WSL) and maintained repositories using Git and GitHub",
                ],
                "tags": ["Python", "Machine Learning", "Neural Networks", "Git"],
            },
            {
                "id": uid(), "badgeText": "Job Simulation", "badgeIcon": "fa-solid fa-laptop",
                "date": "2024", "title": "Data Analytics Job Simulation",
                "organization": "Deloitte · via Forage",
                "bullets": [
                    "Completed real-world data analysis and forensic technology tasks",
                    "Analyzed datasets to uncover patterns and support business decisions",
                    "Delivered insights through structured reporting and dashboards",
                ],
                "tags": ["Data Analytics", "Excel", "Problem Solving"],
            },
            {
                "id": uid(), "badgeText": "Job Simulation", "badgeIcon": "fa-solid fa-laptop",
                "date": "2024", "title": "Data Visualization Simulation",
                "organization": "Tata Group · via Forage",
                "bullets": [
                    "Framed business scenarios and chose appropriate visual representations",
                    "Created effective dashboards to communicate insights to stakeholders",
                    "Practiced data storytelling and executive-level reporting skills",
                ],
                "tags": ["Power BI", "Data Visualization", "Business Insights"],
            },
        ],
        "education": [
            {
                "id": uid(), "badgeText": "B.Tech", "badgeIcon": "fa-solid fa-graduation-cap",
                "date": "2022 – Present", "title": "B.Tech – Artificial Intelligence & Data Science",
                "organization": "Poornima University · Jaipur, Rajasthan",
                "bullets": [
                    "Specializing in Artificial Intelligence, Data Science, and Machine Learning",
                    "Maintaining a CGPA of 8.1/10",
                    "Completed 15+ projects across ML, Data Analytics, and Web Development",
                ],
                "tags": ["AI & ML", "Data Science", "CGPA 8.1"],
            },
            {
                "id": uid(), "badgeText": "Senior Secondary", "badgeIcon": "fa-solid fa-school",
                "date": "2021 – 2022", "title": "Higher Secondary – Class XII",
                "organization": "Galaxy English Sr. Sec. School · Beawar, Rajasthan",
                "bullets": [
                    "Completed Class XII with Science stream (PCM)",
                    "Strong foundation in Mathematics and Physics",
                ],
                "tags": ["Science Stream", "PCM"],
            },
        ],
        "projects": [
            {
                "id": uid(), "number": "01", "title": "Taxi Fare Data Analysis Dashboard",
                "description": "Interactive Power BI dashboard analyzing 150,000+ taxi rides. Visualized revenue trends, peak demand hours, and payment patterns. Data cleaned via SQL & Excel with actionable KPIs for business decisions.",
                "image": "/assets/projects/proj1.png",
                "techTags": [
                    {"icon": "fa-solid fa-chart-bar", "label": "Power BI"},
                    {"icon": "fa-solid fa-database", "label": "SQL"},
                    {"icon": "fa-solid fa-file-excel", "label": "Excel"},
                ],
                "liveUrl": "#", "githubUrl": "#",
            },
            {
                "id": uid(), "number": "02", "title": "SMS Spam Classification",
                "description": "NLP-based spam detector using TF-IDF, Naive Bayes & Logistic Regression. Processed 5,572 SMS messages via tokenization, stopword removal & stemming. Achieved 97.78% accuracy, evaluated with precision, recall & confusion matrix.",
                "image": "/assets/projects/proj2.png",
                "techTags": [
                    {"icon": "fa-brands fa-python", "label": "Python"},
                    {"icon": "fa-solid fa-comment-dots", "label": "NLP"},
                    {"icon": "fa-solid fa-brain", "label": "Scikit-learn"},
                ],
                "liveUrl": "#", "githubUrl": "https://github.com/dineshsingh099/sms_spam_classifier",
            },
            {
                "id": uid(), "number": "03", "title": "DriveX – Ride Sharing Platform",
                "description": "Full-stack ride-sharing app with booking & trip management. REST APIs via FastAPI, JWT-based secure authentication, MongoDB schema design, and a responsive React frontend with real-time ride tracking.",
                "image": "/assets/projects/proj3.png",
                "techTags": [
                    {"icon": "fa-solid fa-bolt", "label": "FastAPI"},
                    {"icon": "fa-brands fa-react", "label": "React"},
                    {"icon": "fa-solid fa-leaf", "label": "MongoDB"},
                ],
                "liveUrl": "#", "githubUrl": "https://github.com/dineshsingh099/Ride-Sharing-Platform",
            },
        ],
        "certifications": [
            {
                "id": uid(), "icon": "fa-solid fa-chart-pie", "title": "Data Analytics Job Simulation",
                "description": "Completed real-world tasks including data analysis and forensic technology.",
                "issuer": "Deloitte (Forage)", "fileUrl": "/assets/certificate/Forage Deloitte Certificate.pdf",
            },
            {
                "id": uid(), "icon": "fa-solid fa-chart-line", "title": "Data Visualization: Empowering Business with Effective Insights",
                "description": "Framing business scenarios, choosing visuals, and communicating insights effectively.",
                "issuer": "Tata (Forage)", "fileUrl": "/assets/certificate/Tata Forage.pdf",
            },
            {
                "id": uid(), "icon": "fa-solid fa-brain", "title": "Machine Learning with Python",
                "description": "Completed an IBM-authorized course covering machine learning concepts, data analysis, and practical Python implementation.",
                "issuer": "IBM (via Coursera)", "fileUrl": "/assets/certificate/Coursera.pdf",
            },
            {
                "id": uid(), "icon": "fa-solid fa-cloud", "title": "Google Cloud Career Launchpad",
                "description": "Completed Data Analytics track with hands-on labs and real-world cloud concepts.",
                "issuer": "Google Cloud", "fileUrl": "/assets/certificate/Google Cloud Data Analytics.pdf",
            },
        ],
        "resume": {
            "name": "Dinesh Singh",
            "role": "Data Analyst & Web Developer",
            "description": "Covers Python, SQL, Power BI, React & FastAPI. Includes ML internship, 3 live projects, 5+ certifications, and education from Poornima University.",
            "chips": ["ML Internship", "3 Projects", "5+ Certs", "CGPA 8.1"],
            "fileUrl": "/assets/Resume.pdf",
        },
        "contact": {
            "heading": "Let's Work Together",
            "intro": "Open to data analyst roles, internships, and freelance projects. Let's connect and build something great!",
            "email": "dineshrawatdd088@gmail.com",
            "phone": "+91 8955524407",
            "location": "Jaipur, Rajasthan, India",
            "socialLinks": {
                "github": "https://github.com/dineshsingh099",
                "linkedin": "https://linkedin.com/in/dineshsingh09",
                "instagram": "https://instagram.com/dineshsingh_077",
                "email": "dineshrawatdd088@gmail.com",
            },
        },
        "testimonials": [],
        "seo": {
            "siteTitle": "Dinesh Singh Portfolio",
            "metaTitle": "Dinesh Singh | Full Stack Python Developer",
            "metaDescription": "Professional Full Stack Developer specializing in FastAPI, React and MongoDB.",
            "metaKeywords": ["Python", "FastAPI", "React", "MongoDB", "Portfolio", "Data Analyst"],
            "ogImage": "/assets/images/profile.png",
            "canonicalUrl": "",
            "googleAnalyticsId": "",
            "googleSiteVerification": "",
        },
    }
