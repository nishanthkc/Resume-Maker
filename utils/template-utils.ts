import type { ResumeFileType, ResumeTemplate } from '@/types/resume-form';

const default_template = String.raw`
\documentclass[a4paper,11pt]{article}
\usepackage{titlesec}
\usepackage{latexsym,amssymb,amsmath,enumitem}
\usepackage{geometry}
\usepackage{hyperref}
\usepackage{xcolor}

\geometry{margin=1cm}

% Custom formatting
\titleformat{\section}
  {\large\bfseries\color{black}}{}{0pt}{}[\vspace{0.2em}\titlerule\vspace{0.4em}]
\titlespacing*{\section}{0pt}{-0.1em}{0.2em}

\titleformat{\subsection}{\normalsize\bfseries\color{black}}{}{0em}{}
\titleformat{\subsubsection}[runin]{\bfseries}{\thesubsubsection}{1em}{}
\renewcommand{\labelitemi}{--}

\pagestyle{empty}

\begin{document}

%----------------------------------
% Header
%----------------------------------
\begin{center}
  \textbf{\LARGE John Doe} \\[3pt]
  City, State \quad $\vert$ \quad \href{mailto:johndoe@email.com}{johndoe@email.com} \quad $\vert$ \quad (555) 123-4567 $\vert$ \quad
  \href{https://github.com/johndoe}{github/johndoe} \quad $\vert$ \quad \href{https://www.linkedin.com/in/johndoe}{LinkedIn/johndoe}
\end{center}

%----------------------------------
% Education
%----------------------------------
\section*{Education}
\textbf{State University}, City, State \hfill \textit{Aug 2021 -- May 2025}\\
\small \textbf{Bachelor of Science in Computer Science} \hfill GPA: 3.8/4.0 \\
Relevant Coursework: Data Structures, Algorithms, Databases, Operating Systems, Software Engineering\\
\textbf{State University}, City, State \hfill \textit{Aug 2021 -- May 2025}\\
\small \textbf{Bachelor of Science in Computer Science} \hfill GPA: 3.8/4.0 \\
Relevant Coursework: Data Structures, Algorithms, Databases, Operating Systems, Software Engineering\\

%----------------------------------
% Skills
%----------------------------------
\section*{Skills}
\textbf{Languages \& Frameworks:} Python, Java, C++, JavaScript, React, Node.js \\
\textbf{Cloud Platforms:} AWS, Google Cloud Platform, Azure \\
\textbf{DevOps \& Tools:} Docker, Git, GitHub Actions, CI/CD, Linux \\
\textbf{Databases:} MySQL, PostgreSQL, MongoDB, Redis \\

%----------------------------------
% Experience
%----------------------------------
\section*{Professional Experience}
\textbf{Tech Company Inc.}, Software Engineer Intern \hfill \textit{May 2024 -- Aug 2024}
\begin{itemize}[leftmargin=1.5em, itemsep=0.01em]
  \item \textbf{Developed} scalable backend services using Python and REST APIs, supporting features used by over 10,000 users.
  \item \textbf{Implemented} frontend components with React, improving page load performance by \textbf{25\%}.
  \item \textbf{Collaborated} with cross-functional teams to design and ship new features on a bi-weekly release cycle.
  \item \textbf{Automated} testing and deployment workflows using GitHub Actions, reducing manual effort by \textbf{30\%}.
\end{itemize}
\textbf{Tech Company Inc.}, Software Engineer Intern \hfill \textit{May 2024 -- Aug 2024}
\begin{itemize}[leftmargin=1.5em, itemsep=0.01em]
  \item \textbf{Developed} scalable backend services using Python and REST APIs, supporting features used by over 10,000 users.
  % EXTRA CHANGES START HERE
  \item \textbf{Implemented}...
% EXTRA CHANGES END HERE
\end{itemize}

\textbf{Startup Labs}, Software Developer \hfill \textit{Jun 2023 -- Apr 2024}
\begin{itemize}[leftmargin=1.5em, itemsep=0.01em]
  \item \textbf{Built} full-stack web applications using React, Node.js, and MongoDB.
  \item \textbf{Designed} RESTful APIs and integrated third-party services for authentication and payments.
  \item \textbf{Improved} application reliability by adding logging, monitoring, and error handling.
\end{itemize}

%----------------------------------
% Projects
%----------------------------------
\section*{Projects}
\textbf{Campus Marketplace Platform} \hfill \textit{Jan 2025 -- Present}
\begin{itemize}[leftmargin=1.5em, itemsep=0.01em]
  \item \textbf{Designed and built} a student-only marketplace web application enabling buying, selling, and auctions within a university campus.
  \item \textbf{Implemented} user authentication, listings, bidding logic, and search functionality using modern web technologies.
  \item \textbf{Deployed} the application on AWS with containerized services using Docker.
\end{itemize}
% EXTRA CHANGES START HERE
\textbf{Project name here} \hfill \textit{Jan 2025 -- May 2025}
\begin{itemize}[leftmargin=1.5em, itemsep=0.01em]
  \item Built ...
% EXTRA CHANGES END HERE
\end{itemize}

\end{document}
`;
/**
 * Returns the available templates based on the uploaded file type
 * @param fileType - The type of resume file (pdf, docx, tex) or null
 * @returns Array of available template types
 */
export function getAvailableTemplates(fileType: ResumeFileType | null): ResumeTemplate[] {
  if (!fileType) {
    return [];
  }

  // For LaTeX files, show all 4 templates including "Your Format"
  if (fileType === 'tex') {
    return ['modern', 'classic', 'old-school', 'your-format'];
  }

  // For PDF and DOCX files, show only 3 templates (exclude "Your Format")
  if (fileType === 'pdf' || fileType === 'docx') {
    return ['modern', 'classic', 'old-school'];
  }

  // Fallback: return empty array for unknown file types
  return [];
}

/**
 * Returns the LaTeX template example structure based on the selected template
 * @param resumeTemplate - The selected resume template type
 * @param extractedData - Optional extracted text from user's resume (required for 'your-format')
 * @returns LaTeX template string as example for the LLM
 */
export function getLatexTemplate(
  resumeTemplate: ResumeTemplate,
  extractedData?: string
): string {
  switch (resumeTemplate) {
    case 'your-format':
      // For 'your-format', return the user's actual resume template
      if (!extractedData) {
        throw new Error('extractedData is required for your-format template');
      }
      return extractedData;
    
    case 'modern':
      // TODO: Add modern template LaTeX structure
      return default_template;
    
    case 'classic':
      // TODO: Add classic template LaTeX structure
      return default_template;
    
    case 'old-school':
      // TODO: Add old-school template LaTeX structure
      return default_template;
    
    default:
      // Fallback to modern template
      return default_template;
  }
}

