# AI-Based Smart Allocation Engine

An AI-powered internship and resume matching platform with a Flask backend and a React + Vite frontend. The backend uses sentence embeddings and cosine similarity to rank candidates against internships, supports resume upload and validation, and exposes endpoints for matching and application workflows.

## Overview

The project is organized into two parts:

* `backend/` contains the Flask API, pretrained sentence-transformer model files, and CSV datasets used for matching.
* `frontend/` contains the React user interface for student and admin flows.

## Features

* Resume-to-internship matching using `sentence-transformers` and cosine similarity
* Internship-to-resume matching for admin workflows
* Resume upload support for PDF and DOCX files
* Resume content validation before processing
* Simple application, deadline, and selection tracking endpoints
* React dashboard UI for admin and student views

## Project Structure

```text
backend/
  app.py
  internships_updated.csv
  resumes_updated.csv
  sentence_bert_model/
  uploads/

frontend/
  src/
  package.json
  vite.config.js
```

## Prerequisites

* Python 3.10 or newer
* Node.js 18 or newer
* npm

## Backend Setup

1. Open a terminal in `backend/`.
2. Create and activate a virtual environment if desired.
3. Install the Python dependencies:

```bash
pip install -r requirements.txt
```

4. Start the Flask application:

```bash
flask --app app run --debug
```

The backend expects the CSV files and model folder to remain in the backend directory because it loads them using relative paths.

## Frontend Setup

1. Open a separate terminal in `frontend/`.
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## Main API Endpoints

| Method | Endpoint                     | Description                                   |
| ------ | ---------------------------- | --------------------------------------------- |
| POST   | `/match_internships`         | Get internship matches for a resume index     |
| POST   | `/match_resumes`             | Get resume matches for an internship index    |
| POST   | `/upload_resume`             | Upload and validate a PDF or DOCX resume      |
| POST   | `/submit_application`        | Store a student application in memory         |
| POST   | `/set_deadline`              | Set an application deadline for an internship |
| GET    | `/get_applications`          | List submitted applications                   |
| POST   | `/process_deadline_matching` | Score and rank applications after a deadline  |

## Data Files

The backend uses the following local files for matching:

* `resumes_updated.csv`
* `internships_updated.csv`
* `sentence_bert_model/`

Keep these files in place unless you also update the backend file paths.

## Notes

* Uploaded resumes are stored temporarily in `uploads/` and removed after processing.
* Applications and deadlines are currently stored in memory, so restarting the server clears them.
* If you change the frontend API base URL, update the request configuration accordingly.
