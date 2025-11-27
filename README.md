# HealthNudge: AI-Powered & Medical Report Analysis💡

##### An AI-powered health management platform with OCR-based medical report parsing, personalized diet plans, and accessibility-focused Text-to-Speech support.

## 📌 Overview

**HealthNudge** is a **full-stack** platform designed to help users manage their health using AI-driven tools.
It allows secure upload of medical reports **(PDF/image)** and uses a hybrid parsing approach **(OCR + text extraction)** to generate summaries.
Users receive personalized **veg/non-veg diet plans**, can track progress on a **dynamic dashboard**, and benefit from an accessibility-first **Text-to-Speech** feature that reads reports aloud.

## ✨ Features

- Secure Medical Report Uploads (PDF/Image)

- Hybrid Parsing: OCR (Tesseract.js) + text-based extraction (pdf-parse, pdf-poppler)

- AI-Powered Report Summary using OpenAI APIs

- Personalized Diet Plans (Veg / Non-Veg options)

- Dynamic Activity Dashboard for tracking health metrics

- User Authentication: Firebase Auth, cookies, email verification, and protected routes

- Text-to-Speech (TTS) for accessibility – reads reports & summaries aloud for users

- RESTful API Architecture with secure backend handling

# Look at the flow chart of "How Uploading Works" 

<img width="788" height="1000" alt="image" src="https://github.com/user-attachments/assets/f9023629-931f-4cbb-94db-520e473b1fac" />


## 🛠️ Tech Stack

#### Frontend

- Next.js

- Tailwind CSS

- Web Speech API / Google Cloud TTS

#### Backend

- Node.js

- Express.js

- MongoDB

- Tesseract.js, pdf-parse, pdf-poppler

- OpenAI API

Deployment

- Vercel (Frontend)

- Railway (Backend)
