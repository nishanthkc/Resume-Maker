import Accordion from './accordion';

interface FAQSectionProps {
  className?: string;
}

export default function FAQSection({ className = '' }: FAQSectionProps) {
  const faqItems = [
    {
      question: 'What file formats do you support?',
      answer: 'We support PDF, DOCX, and LaTeX formats for resume uploads. Our AI can extract text from PDFs and DOCX files, and directly process LaTeX files.',
    },
    {
      question: 'How does the AI tailoring work?',
      answer: 'Our AI analyzes your resume content and the job description you provide. It then optimizes your resume by highlighting relevant skills, experiences, and keywords that match the job requirements, creating a tailored version that stands out to recruiters.',
    },
    {
      question: 'Can I customize the generated resume?',
      answer: 'Yes! After generation, you\'ll receive a LaTeX file that you can open in Overleaf for further customization. You have full control to make any edits you want.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We take data privacy seriously. Your resume and job descriptions are processed securely and are not stored permanently unless you choose to create an account.',
    },
    {
      question: 'Do I need to create an account?',
      answer: 'No, you can use our service as a guest. However, creating an account allows you to save your resume history and access additional personalization features.',
    },
  ];

  return (
    <section className={`py-20 px-8 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-foreground text-center mb-12">
          Questions?
        </h2>

        {/* Accordion */}
        <Accordion items={faqItems} />
      </div>
    </section>
  );
}

