# AI-Based Smart Internship Allocation Engine

An AI-powered internship recommendation and allocation platform that matches student resumes with internship opportunities using semantic similarity and natural language processing.

The system leverages Sentence-BERT embeddings and cosine similarity to analyze resumes and internship descriptions, enabling intelligent matching and ranking of candidates and opportunities.

## Features

### Resume-to-Internship Matching

* Upload or select a resume
* Generate semantic embeddings using Sentence-BERT
* Rank internships based on similarity scores
* Display the most relevant opportunities

### Internship-to-Candidate Matching

* Match internship requirements against candidate profiles
* Rank resumes based on job relevance
* Support recruiter and admin workflows

### Resume Processing

* PDF and DOCX resume upload support
* Resume content validation
* Automatic text extraction and preprocessing

### Application Management

* Submit internship applications
* Track application status
* Deadline management
* Candidate ranking after application deadlines

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* Axios

### Backend

* Flask
* Python

### Machine Learning & NLP

* Sentence Transformers
* Sentence-BERT (SBERT)
* Cosine Similarity
* NumPy
* Pandas

## Project Architecture

```text
frontend (React + Vite)
        │
        ▼
Flask REST API
        │
        ├── Resume Processing
        ├── Internship Matching
        ├── Application Management
        └── Candidate Ranking
                │
                ▼
      Sentence-BERT Model
                │
                ▼
     Similarity-Based Matching
```

## Project Structure

```text
AI-Based-Smart-Internship-Allocation-Engine/

├── backend/
│   ├── app.py
│   ├── internships_updated.csv
│   ├── resumes_updated.csv
│   ├── uploads/
│   └── sentence_bert_model/
│
└── frontend/
    ├── src/
    ├── package.json
    └── vite.config.js
```

## Installation

### Backend Setup

```bash
cd backend

pip install -r requirements.txt

flask --app app run --debug
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

## API Endpoints

| Method | Endpoint                     | Description                     |
| ------ | ---------------------------- | ------------------------------- |
| POST   | `/match_internships`         | Match internships for a resume  |
| POST   | `/match_resumes`             | Match resumes for an internship |
| POST   | `/upload_resume`             | Upload and validate resume      |
| POST   | `/submit_application`        | Submit application              |
| POST   | `/set_deadline`              | Set internship deadline         |
| GET    | `/get_applications`          | Retrieve applications           |
| POST   | `/process_deadline_matching` | Rank applicants after deadline  |

## How Matching Works

1. Resume text and internship descriptions are converted into sentence embeddings using Sentence-BERT.
2. Embeddings are transformed into numerical vectors.
3. Cosine similarity is computed between resumes and internship descriptions.
4. Opportunities and candidates are ranked according to similarity scores.
5. The highest-ranked matches are returned to the user.

## Future Improvements

* Real-time internship recommendations
* User authentication and role-based access
* Database integration for persistent storage
* Explainable AI recommendations
* Advanced filtering and skill-gap analysis
* Resume feedback generation

## Learning Outcomes

Through this project, I gained experience with:

* Natural Language Processing (NLP)
* Semantic Search and Recommendation Systems
* Sentence Embeddings
* Similarity-Based Ranking
* Flask API Development
* React Frontend Development
* Full-Stack AI Application Design

```
```
