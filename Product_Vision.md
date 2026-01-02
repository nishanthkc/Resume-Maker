# Resume Maker V0 - Product Vision Document

## Vision Statement

Help job seekers confidently create a job-specific, professional resume in minutes, with full control to review and edit, so their real experience is presented clearly for every opportunity.

---

## 1. Current Situation

Job seekers are applying to many roles in parallel. Tailoring is expected, but the work is repetitive and slow. Formatting is a distraction. Many AI tools produce output that feels generic, inconsistent, or risky to trust, especially when it adds or exaggerates details.

---

## 2. The Problem

Candidates need a resume that is:

- **Tailored** to a specific job description and title
- **Consistently formatted** and professional
- **Fast** to generate
- **Trustworthy**, meaning it does not invent facts and the user can review and edit easily

**The real pain is not "I need a prettier resume."**

**It is "I need a tailored resume quickly, and I need to trust what it says."**

---

## 3. Trends That Matter

- **Higher application volume** means tailoring time becomes a bottleneck.
- **Keyword relevance and role alignment** matter more than ever.
- **LLMs enable fast rewriting**, but hallucination risk creates distrust.
- **Users increasingly prefer tools** that preserve control and let them edit output without friction.

---

## 4. Opportunity

Build a guided resume tailoring flow that prioritizes speed, consistency, and trust:

1. Ingest resume (PDF, DOCX, LaTeX) and extract usable text
2. Collect job description and job title
3. Let user select an output template
4. Optionally accept personalization instructions for authenticated users
5. Generate LaTeX output that matches the selected template
6. Hand off to Overleaf for final editing

**The differentiator is not just "AI rewrite."**

**It is "editable, professional output with guardrails and privacy."**

---

## 5. Product Principles

1. **Speed to first usable output**
2. **Trust over creativity**
3. **User control through editability** (Overleaf handoff)
4. **Privacy by default**
5. **Simple workflow, minimal steps**

---

## 6. Strategic Commitments

### A. Privacy Will Be Safe

**What this means in product terms:**

- Store generated LaTeX in S3 as private objects by default.
- Use time-limited signed URLs for any access needed to hand off to Overleaf or to the user.
- Do not store raw uploaded files in the database.
- Store only necessary extracted text and metadata, and only if/when you implement history for authenticated users.
- Use least-privilege IAM for upload and read operations.
- Add retention controls (example: delete objects after N days unless user saves), if you want privacy plus cost control.

### B. Guardrails Against Hallucinations Will Be in V0

**What this means in product terms:**

- **Prompt rules** that explicitly forbid inventing employers, titles, dates, degrees, metrics, and projects.
- **Output validation** that checks:
  - LaTeX structure sanity (basic compile-safe checks)
  - Obvious "new claims" patterns (numbers, awards, tools, employers) not present in the input
- When uncertain, the system should:
  - Avoid adding specifics
  - Rewrite more conservatively
  - Optionally insert placeholders like "(confirm metric)" instead of guessing
- **Clear UI messaging**: "Review before sending. You are responsible for final content."

**Brutal truth:** Without these guardrails, users will eventually get fabricated bullets. That kills trust and can harm candidates. You made the right call by including guardrails in V0.

---

## 7. Stepping Stones

### Step 1: V0, Fast First Output with Trust Baseline

- 4-step guided builder
- Extraction for PDF and DOCX, direct read for LaTeX
- Template selection
- Auth gated personalization
- LaTeX generation with guardrails
- Private S3 storage and signed URL access
- Overleaf handoff

### Step 2: V1, Quality and Correction Loop

- Show extracted text preview and allow user edits before generation
- Stronger claim-checking and warnings with highlighted diffs
- Better template previews and error recovery

### Step 3: V2, Repeatable Tailoring System

- Saved history for authenticated users
- Reusable base resume profiles
- Multiple output variants (conservative vs aggressive)
- Optional keyword alignment insights if they measurably improve outcomes

---

## 8. What Winning Looks Like

✅ A user goes from landing page to editable Overleaf resume in one session without confusion.

✅ Output is mostly usable with light edits, not a rewrite from scratch.

✅ Users trust the tool because it does not invent facts and flags uncertainty.

✅ Privacy posture is clear and default-safe.

---

## The "Why" - Core Motivation

**Why does this product exist?**

Job seekers face a critical challenge: they need to apply to multiple positions, each requiring a tailored resume. The current process is:

- **Time-consuming**: Manually tailoring resumes for each application
- **Error-prone**: Risk of formatting inconsistencies
- **Untrustworthy**: AI tools that invent or exaggerate details
- **Frustrating**: Repetitive work that distracts from actual job searching

**Our solution addresses the real pain:** Not just making resumes prettier, but making them **tailored, trustworthy, and fast** - giving users confidence that their real experience is presented clearly without fabrication.

---

## The "What" - Product Scope

**What are we building?**

A guided resume tailoring system that:

1. **Ingests** user's existing resume (multiple formats)
2. **Extracts** relevant information automatically
3. **Collects** job-specific requirements (description + title)
4. **Generates** tailored LaTeX output with guardrails against hallucinations
5. **Hands off** to Overleaf for final user control and editing

**Key differentiators:**

- **Trust-first approach**: Guardrails prevent AI from inventing facts
- **Privacy by default**: Secure storage with time-limited access
- **User control**: Editable output in Overleaf, not locked-in
- **Speed**: From upload to usable output in minutes
- **Consistency**: Professional templates ensure formatting quality

---

## Success Metrics (Future)

- Time from landing to first usable output
- User trust score (surveys on output accuracy)
- Edit frequency in Overleaf (lower = better initial quality)
- User retention and repeat usage
- Privacy compliance and data retention metrics

---

*This document serves as the north star for all product decisions and development priorities.*

