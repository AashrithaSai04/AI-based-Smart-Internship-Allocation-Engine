import os
import pandas as pd
import numpy as np
import pickle
import re
import string
import nltk
from datetime import datetime, timedelta
import PyPDF2
from docx import Document
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load internships data
internships_file_path = 'internships_updated.csv'
try:
    internships_df_loaded = pd.read_csv(internships_file_path)
    # Add Capacity column with mock data (e.g., random integers between 1 and 10)
    internships_df_loaded['Capacity'] = np.random.randint(1, 11, size=len(internships_df_loaded))
    # Add Allocated_Spots column and initialize to 0
    internships_df_loaded['Allocated_Spots'] = 0
except FileNotFoundError:
    print(f"Error: The file '{internships_file_path}' was not found.")
except Exception as e:
    print(f"An error occurred: {e}")

# Initialize application storage
applications_storage = []
deadlines_storage = {}

# Download NLTK resources if not already present
try:
    nltk.data.find('corpora/stopwords')
    nltk.data.find('corpora/wordnet')
    nltk.data.find('corpora/omw-1.4')
except LookupError:
    nltk.download('stopwords')
    nltk.download('wordnet')
    nltk.download('omw-1.4')

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))


def preprocess_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'http\S+|www\S+|https\S+|[^\s]+@[^\s]+', '', text, flags=re.MULTILINE)
    text = re.sub(r'\d+', '', text)
    text = text.translate(str.maketrans('', '', string.punctuation))
    text = re.sub(' +', ' ', text).strip()
    tokens = text.split()
    cleaned_tokens = [
        lemmatizer.lemmatize(word) for word in tokens
        if word not in stop_words and len(word) > 1
    ]
    return ' '.join(cleaned_tokens)


def calculate_final_score(skills_score, resume_location, internship_location, resume_social_cat, internship_aa_preference, past_participation,
                          w_skills=0.7, w_location=0.1, w_social_cat=0.1, w_past_part=0.1):
    location_score = 0
    if isinstance(resume_location, str) and isinstance(internship_location, str):
        if resume_location.strip().lower() == internship_location.strip().lower():
            location_score = 1.0
        else:
            location_score = 0.5
    else:
        location_score = 0.5

    social_cat_score = 0
    if isinstance(resume_social_cat, str) and isinstance(internship_aa_preference, str):
        if resume_social_cat.strip().lower() == internship_aa_preference.strip().lower():
            social_cat_score = 1.0
        elif internship_aa_preference.strip().lower() == 'general':
             social_cat_score = 0.7
        else:
             social_cat_score = 0.3
    else:
        social_cat_score = 0.5

    past_part_score = 1.0 if not past_participation else 0.8

    final_score = (w_skills * skills_score) + (w_location * location_score) + \
                  (w_social_cat * social_cat_score) + (w_past_part * past_part_score)

    return final_score


resumes_df_loaded = None
resume_embeddings = None
internship_embeddings = None
similarity_matrix = None
model = None

def load_data_and_model():
    global resumes_df_loaded, internships_df_loaded, resume_embeddings, internship_embeddings, similarity_matrix, model

    try:
        resumes_df_loaded = pd.read_csv('resumes_updated.csv')

        resumes_df_loaded['cleaned_resume'] = resumes_df_loaded['Resume'].astype(str).fillna('').apply(preprocess_text)

        global internships_df_loaded

        # internships_df_loaded is already loaded in Cell 1, so just preprocess
        internships_df_loaded['cleaned_description'] = internships_df_loaded['Role'].astype(str).fillna('').apply(preprocess_text)

        if 'Capacity' not in internships_df_loaded.columns:
            internships_df_loaded['Capacity'] = np.random.randint(1, 11, size=len(internships_df_loaded))
        if 'Allocated_Spots' not in internships_df_loaded.columns:
            internships_df_loaded['Allocated_Spots'] = 0

        model = SentenceTransformer('all-MiniLM-L6-v2')
        internship_embeddings = model.encode(internships_df_loaded['cleaned_description'].tolist(), convert_to_tensor=True).cpu().numpy()
        resume_embeddings = model.encode(resumes_df_loaded['cleaned_resume'].tolist(), convert_to_tensor=True).cpu().numpy()
        similarity_matrix = cosine_similarity(resume_embeddings, internship_embeddings)

    except FileNotFoundError:
        print("Error: 'resumes_updated.csv' not found in backend folder")
    except Exception as e:
        print(f"An error occurred: {e}")

# Load data and model
load_data_and_model()


def get_top_matches_with_final_score(resume_index, similarity_matrix, resumes_df, internships_df, top_n=5):
    resume_scores = similarity_matrix[resume_index]
    selected_resume = resumes_df.iloc[resume_index]

    combined_scores = internships_df.copy()
    combined_scores['Skills_Score'] = resume_scores

    combined_scores['Final_Score'] = combined_scores.apply(
        lambda row: calculate_final_score(
            skills_score=row['Skills_Score'],
            resume_location=selected_resume['Location'],
            internship_location=row['Location'],
            resume_social_cat=selected_resume['SocialCategory'],
            internship_aa_preference=row['AA_Preference'],
            past_participation=(selected_resume['PastParticipation'] > 0)
        ), axis=1
    )

    available_internships = combined_scores[combined_scores['Allocated_Spots'] < combined_scores['Capacity']].copy()

    top_matches = available_internships.sort_values(by='Final_Score', ascending=False).head(top_n)

    return top_matches[['Role', 'Skills_Score', 'Final_Score', 'Location', 'AA_Preference', 'Capacity', 'Allocated_Spots']]


def get_top_resumes_for_job(job_index, similarity_matrix, resumes_df, internships_df, top_n=15):
    job_scores = similarity_matrix[:, job_index]
    selected_job = internships_df.iloc[job_index]

    combined_scores = resumes_df.copy()
    combined_scores['Skills_Score'] = job_scores

    combined_scores['Final_Score'] = combined_scores.apply(
        lambda row: calculate_final_score(
            skills_score=row['Skills_Score'],
            resume_location=row['Location'],
            internship_location=selected_job['Location'],
            resume_social_cat=row['SocialCategory'],
            internship_aa_preference=selected_job['AA_Preference'],
            past_participation=(row['PastParticipation'] > 0)
        ), axis=1
    )

    top_matches = combined_scores.sort_values(by='Final_Score', ascending=False).head(top_n)

    return top_matches[['Category', 'Resume', 'Skills_Score', 'Final_Score', 'Location', 'SocialCategory', 'PastParticipation']]


# File upload configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'docx'}

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(file_path):
    """Extract text from PDF file"""
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

def extract_text_from_docx(file_path):
    """Extract text from DOCX file"""
    try:
        doc = Document(file_path)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except Exception as e:
        print(f"Error extracting text from DOCX: {e}")
        return ""

def validate_resume_content(text):
    """Validate if the extracted text appears to be a resume"""
    if not text or len(text.strip()) < 100:
        return False, "Document too short to be a resume"
    
    text_lower = text.lower()
    
    # Resume keywords - must have at least 3 categories
    resume_indicators = {
        'personal_info': ['resume', 'cv', 'curriculum vitae'],
        'experience': ['experience', 'work experience', 'employment', 'job', 'position', 'role', 'worked at', 'intern', 'internship'],
        'education': ['education', 'degree', 'university', 'college', 'school', 'graduated', 'bachelor', 'master', 'phd', 'diploma'],
        'skills': ['skills', 'programming', 'software', 'technology', 'proficient', 'familiar', 'knowledge', 'languages', 'tools'],
        'contact': ['email', 'phone', 'contact', 'linkedin', 'github']
    }
    
    categories_found = 0
    found_keywords = []
    
    for category, keywords in resume_indicators.items():
        category_matches = [kw for kw in keywords if kw in text_lower]
        if category_matches:
            categories_found += 1
            found_keywords.extend(category_matches)
    
    # Strong indicators that this is NOT a resume
    strong_non_resume_indicators = [
        'invoice #', 'bill to:', 'amount due:', 'payment terms:', 'total cost:', 'invoice number:',
        'menu', 'appetizers', 'main courses', 'desserts', 'restaurant menu',
        'abstract\n', 'methodology\n', 'bibliography\n', 'references cited\n', 'chapter 1',
        'once upon a time', 'the end', 'dear sir/madam', 'sincerely yours',
        'recipe:', 'ingredients:', 'cooking instructions:', 'serves 4',
        'terms and conditions', 'warranty information', 'disclaimer:',
        'patient name:', 'diagnosis:', 'treatment plan:', 'medication:',
        'balance sheet', 'profit and loss statement', 'financial statement'
    ]
    
    # Weak indicators (less certain)
    weak_non_resume_indicators = [
        'table of contents', 'introduction', 'conclusion',
        'figure', 'chart', 'graph', 'data analysis'
    ]
    
    strong_non_resume_found = sum(1 for indicator in strong_non_resume_indicators if indicator in text_lower)
    weak_non_resume_found = sum(1 for indicator in weak_non_resume_indicators if indicator in text_lower)
    
    # Validation logic - stricter requirements
    if strong_non_resume_found > 0:
        return False, f"Document appears to be a {strong_non_resume_indicators[0] if 'invoice' in text_lower else 'non-resume document'} based on content analysis"
    
    if categories_found < 3:
        return False, f"Document doesn't appear to be a resume. Found only {categories_found}/5 resume categories. Expected keywords like experience, education, skills, etc."
    
    if weak_non_resume_found > 3:
        return False, "Document appears to be an academic paper or report rather than a resume"
    
    # Check if it's too repetitive (spam-like content)
    words = text_lower.split()
    if len(set(words)) < len(words) * 0.3:  # Less than 30% unique words
        return False, "Document content appears to be repetitive or spam-like"
    
    # Additional check: ensure we have both experience/education AND skills/contact
    has_career_info = any(kw in text_lower for kw in resume_indicators['experience'] + resume_indicators['education'])
    has_skills_or_contact = any(kw in text_lower for kw in resume_indicators['skills'] + resume_indicators['contact'])
    
    if not (has_career_info and has_skills_or_contact):
        return False, "Document lacks essential resume components (career info + skills/contact details)"
    
    return True, f"Valid resume detected with {categories_found} resume categories"

def parse_resume_file(file_path, filename):
    """Parse resume file and extract text based on file type"""
    file_extension = filename.rsplit('.', 1)[1].lower()
    
    if file_extension == 'pdf':
        return extract_text_from_pdf(file_path)
    elif file_extension == 'docx':
        return extract_text_from_docx(file_path)
    else:
        return ""


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return "Flask app is running. Matchmaking endpoints available at /match_internships and /match_resumes."

@app.route('/match_internships', methods=['POST'])
def match_internships():
    try:
        resume_data = request.get_json()
        resume_index = resume_data.get('resume_index')
        top_n = resume_data.get('top_n', 15)

        if resume_index is None:
            return jsonify({"error": "Missing 'resume_index'"}), 400

        global resumes_df_loaded, internships_df_loaded, similarity_matrix
        if resumes_df_loaded is None or internships_df_loaded is None or similarity_matrix is None:
            load_data_and_model()
            if resumes_df_loaded is None or internships_df_loaded is None or similarity_matrix is None:
                return jsonify({"error": "Data and model could not be loaded"}), 500

        top_matches = get_top_matches_with_final_score(
            resume_index=resume_index,
            similarity_matrix=similarity_matrix,
            resumes_df=resumes_df_loaded,
            internships_df=internships_df_loaded.copy(),
            top_n=top_n
        )

        return jsonify(top_matches.to_dict(orient='records'))

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/match_resumes', methods=['POST'])
def match_resumes():
    try:
        job_data = request.get_json()
        job_index = job_data.get('job_index')
        top_n = job_data.get('top_n', 15)

        if job_index is None:
            return jsonify({"error": "Missing 'job_index'"}), 400

        global resumes_df_loaded, internships_df_loaded, similarity_matrix
        if resumes_df_loaded is None or internships_df_loaded is None or similarity_matrix is None:
            load_data_and_model()
            if resumes_df_loaded is None or internships_df_loaded is None or similarity_matrix is None:
                return jsonify({"error": "Data and model could not be loaded"}), 500

        top_matches = get_top_resumes_for_job(
            job_index=job_index,
            similarity_matrix=similarity_matrix,
            resumes_df=resumes_df_loaded.copy(),
            internships_df=internships_df_loaded,
            top_n=top_n
        )

        return jsonify(top_matches.to_dict(orient='records'))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/upload_resume', methods=['POST'])
def upload_resume():
    """Upload and parse resume file (PDF/DOCX)"""
    try:
        print("Starting upload_resume function")
        
        if 'file' not in request.files:
            print("Error: No file in request")
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files['file']
        print(f"File received: {file.filename}")
        
        if file.filename == '':
            print("Error: Empty filename")
            return jsonify({"error": "No file selected"}), 400
        
        if file and allowed_file(file.filename):
            print("File type allowed, processing...")
            filename = secure_filename(file.filename)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            print(f"Saving to: {file_path}")
            
            try:
                file.save(file_path)
                print("File saved successfully")
            except Exception as e:
                print(f"Error saving file: {e}")
                return jsonify({"error": f"Error saving file: {str(e)}"}), 500
            
            # Extract text from file
            try:
                print("Extracting text from file...")
                resume_text = parse_resume_file(file_path, filename)
                print(f"Extracted text length: {len(resume_text)}")
            except Exception as e:
                print(f"Error parsing file: {e}")
                return jsonify({"error": f"Error parsing file: {str(e)}"}), 500
            
            if not resume_text.strip():
                print("Error: No text extracted")
                return jsonify({"error": "Could not extract text from file"}), 400
            
            # Validate if the content is actually a resume
            try:
                print("Validating resume content...")
                is_valid, validation_message = validate_resume_content(resume_text)
                print(f"Validation result: {is_valid}, Message: {validation_message}")
                
                # Additional debugging for failed validation
                if not is_valid:
                    print(f"Resume text preview (first 500 chars): {resume_text[:500]}")
                    print(f"Resume text length: {len(resume_text)}")
                    
                    # Check what triggered the rejection
                    text_lower = resume_text.lower()
                    strong_non_resume_indicators = [
                        'invoice', 'bill to', 'amount due', 'payment terms', 'total cost', 'price',
                        'menu', 'appetizers', 'main courses', 'desserts', 'restaurant',
                        'abstract', 'methodology', 'bibliography', 'references cited', 'chapter',
                        'once upon a time', 'the end', 'dear sir', 'sincerely yours',
                        'recipe', 'ingredients', 'cooking instructions', 'serves',
                        'terms and conditions', 'warranty', 'disclaimer',
                        'patient', 'diagnosis', 'treatment', 'medication',
                        'balance sheet', 'profit and loss', 'financial statement'
                    ]
                    
                    found_triggers = [indicator for indicator in strong_non_resume_indicators if indicator in text_lower]
                    if found_triggers:
                        print(f"Strong rejection triggers found: {found_triggers}")
                
                if not is_valid:
                    return jsonify({"error": f"Invalid resume content: {validation_message}"}), 400
                    
            except Exception as e:
                print(f"Error validating resume content: {e}")
                return jsonify({"error": f"Error validating resume content: {str(e)}"}), 500
            
            # Clean and preprocess the resume text
            try:
                print("Preprocessing text...")
                cleaned_resume = preprocess_text(resume_text)
                print("Text preprocessed successfully")
            except Exception as e:
                print(f"Error preprocessing text: {e}")
                return jsonify({"error": f"Error preprocessing text: {str(e)}"}), 500
            
            # Get instant matching if requested
            instant_match = request.form.get('instant_match', 'false').lower() == 'true'
            print(f"Instant match requested: {instant_match}")
            
            if instant_match:
                try:
                    print("Starting instant matching...")
                    top_n = int(request.form.get('top_n', 10))
                    
                    # Create temporary resume entry for matching
                    global model, internship_embeddings, internships_df_loaded
                    if model is None:
                        print("Loading model and data...")
                        load_data_and_model()
                    
                    print("Generating embeddings...")
                    # Generate embedding for uploaded resume
                    resume_embedding = model.encode([cleaned_resume], convert_to_tensor=True).cpu().numpy()
                    print("Embeddings generated")
                    
                    # Calculate similarity with all internships
                    similarities = cosine_similarity(resume_embedding, internship_embeddings)[0]
                    print("Similarities calculated")
                    
                    # Create mock resume data for scoring
                    mock_resume_data = {
                        'Location': request.form.get('location', 'Unknown'),
                        'SocialCategory': request.form.get('social_category', 'General'),
                        'PastParticipation': int(request.form.get('past_participation', 0))
                    }
                    print(f"Mock resume data: {mock_resume_data}")
                    
                    # Calculate final scores
                    combined_scores = internships_df_loaded.copy()
                    combined_scores['Skills_Score'] = similarities
                    combined_scores['Final_Score'] = combined_scores.apply(
                        lambda row: calculate_final_score(
                            skills_score=row['Skills_Score'],
                            resume_location=mock_resume_data['Location'],
                            internship_location=row['Location'],
                            resume_social_cat=mock_resume_data['SocialCategory'],
                            internship_aa_preference=row['AA_Preference'],
                            past_participation=(mock_resume_data['PastParticipation'] > 0)
                        ), axis=1
                    )
                    print("Final scores calculated")
                    
                    # Get top matches
                    available_internships = combined_scores[combined_scores['Allocated_Spots'] < combined_scores['Capacity']].copy()
                    top_matches = available_internships.sort_values(by='Final_Score', ascending=False).head(top_n)
                    print(f"Found {len(top_matches)} top matches")
                    
                    result = {
                        "message": "Resume uploaded and processed successfully",
                        "resume_text": resume_text[:500] + "..." if len(resume_text) > 500 else resume_text,
                        "instant_matches": top_matches[['Role', 'Company Name', 'Location', 'Skills_Score', 'Final_Score', 'Capacity']].to_dict(orient='records')
                    }
                    print("Result prepared successfully")
                    
                except Exception as e:
                    print(f"Error in instant matching: {e}")
                    return jsonify({"error": f"Error in instant matching: {str(e)}"}), 500
            else:
                print("No instant matching requested")
                result = {
                    "message": "Resume uploaded and processed successfully",
                    "resume_text": resume_text[:500] + "..." if len(resume_text) > 500 else resume_text
                }
            
            # Clean up uploaded file
            try:
                os.remove(file_path)
                print("Uploaded file cleaned up")
            except Exception as e:
                print(f"Warning: Could not remove uploaded file: {e}")
            
            print("Upload resume function completed successfully")
            return jsonify(result)
        else:
            print("File type not allowed")
            return jsonify({"error": "File type not allowed. Please upload PDF or DOCX files."}), 400
            
    except Exception as e:
        print(f"General error in upload_resume: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/submit_application', methods=['POST'])
def submit_application():
    """Submit application for internship with deadline support"""
    try:
        data = request.get_json()
        
        application = {
            "id": len(applications_storage) + 1,
            "student_name": data.get('student_name'),
            "student_email": data.get('student_email'),
            "resume_text": data.get('resume_text'),
            "internship_id": data.get('internship_id'),
            "location": data.get('location'),
            "social_category": data.get('social_category'),
            "past_participation": data.get('past_participation', 0),
            "submitted_at": datetime.now().isoformat(),
            "status": "pending"
        }
        
        applications_storage.append(application)
        
        return jsonify({
            "message": "Application submitted successfully",
            "application_id": application["id"],
            "status": "pending"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/set_deadline', methods=['POST'])
def set_deadline():
    """Set application deadline for internships"""
    try:
        data = request.get_json()
        internship_id = data.get('internship_id')
        deadline_str = data.get('deadline')  # Expected format: "2025-09-25T23:59:59"
        
        deadline = datetime.fromisoformat(deadline_str)
        deadlines_storage[internship_id] = deadline.isoformat()
        
        return jsonify({
            "message": "Deadline set successfully",
            "internship_id": internship_id,
            "deadline": deadline.isoformat()
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/get_applications', methods=['GET'])
def get_applications():
    """Get all submitted applications"""
    try:
        internship_id = request.args.get('internship_id')
        
        if internship_id:
            filtered_apps = [app for app in applications_storage if str(app['internship_id']) == str(internship_id)]
            return jsonify(filtered_apps)
        else:
            return jsonify(applications_storage)
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/process_deadline_matching', methods=['POST'])
def process_deadline_matching():
    """Process AI matching after deadline expires"""
    try:
        data = request.get_json()
        internship_id = data.get('internship_id')
        
        # Check if deadline has passed
        if internship_id in deadlines_storage:
            deadline = datetime.fromisoformat(deadlines_storage[internship_id])
            if datetime.now() < deadline:
                return jsonify({"error": "Deadline has not yet passed"}), 400
        
        # Get applications for this internship
        internship_applications = [app for app in applications_storage if str(app['internship_id']) == str(internship_id)]
        
        if not internship_applications:
            return jsonify({"error": "No applications found for this internship"}), 404
        
        # Load model if needed
        global model, internships_df_loaded
        if model is None:
            load_data_and_model()
        
        # Process each application
        results = []
        for app in internship_applications:
            # Preprocess resume text
            cleaned_resume = preprocess_text(app['resume_text'])
            
            # Generate embedding
            resume_embedding = model.encode([cleaned_resume], convert_to_tensor=True).cpu().numpy()
            
            # Find internship details
            internship_row = internships_df_loaded[internships_df_loaded.index == int(internship_id)]
            if internship_row.empty:
                continue
                
            internship_data = internship_row.iloc[0]
            internship_embedding = model.encode([preprocess_text(internship_data['Role'])], convert_to_tensor=True).cpu().numpy()
            
            # Calculate similarity
            similarity = cosine_similarity(resume_embedding, internship_embedding)[0][0]
            
            # Calculate final score
            final_score = calculate_final_score(
                skills_score=similarity,
                resume_location=app['location'],
                internship_location=internship_data['Location'],
                resume_social_cat=app['social_category'],
                internship_aa_preference=internship_data['AA_Preference'],
                past_participation=(app['past_participation'] > 0)
            )
            
            results.append({
                "application_id": app["id"],
                "student_name": app["student_name"],
                "student_email": app["student_email"],
                "skills_score": similarity,
                "final_score": final_score,
                "internship_role": internship_data['Role'],
                "internship_company": internship_data['Company']
            })
        
        # Sort by final score
        results.sort(key=lambda x: x['final_score'], reverse=True)
        
        # Update application statuses
        capacity = internships_df_loaded.loc[int(internship_id), 'Capacity']
        selected_count = 0
        
        for result in results:
            app_id = result["application_id"]
            # Find and update application
            for app in applications_storage:
                if app["id"] == app_id:
                    if selected_count < capacity:
                        app["status"] = "selected"
                        result["status"] = "selected"
                        selected_count += 1
                    else:
                        app["status"] = "not_selected"
                        result["status"] = "not_selected"
                    break
        
        return jsonify({
            "message": "Deadline matching completed",
            "total_applications": len(results),
            "selected_count": selected_count,
            "capacity": capacity,
            "results": results
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
