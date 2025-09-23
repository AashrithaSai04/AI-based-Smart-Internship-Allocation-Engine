import os
import pandas as pd
import numpy as np

# print("Files in backend folder:", os.listdir('.'))
internships_file_path = 'internships_updated.csv'

try:
    internships_df_loaded = pd.read_csv(internships_file_path)

    # Add Capacity column with mock data (e.g., random integers between 1 and 10)
    internships_df_loaded['Capacity'] = np.random.randint(1, 11, size=len(internships_df_loaded))

    # Add Allocated_Spots column and initialize to 0
    internships_df_loaded['Allocated_Spots'] = 0

    # print("\nInternships DataFrame with Capacity and Allocated_Spots:")
    # print(internships_df_loaded.head())

except FileNotFoundError:
    print(f"Error: The file '{internships_file_path}' was not found.")
except Exception as e:
    print(f"An error occurred: {e}")


import pickle
import re
import string
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
 # ...existing code...

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

    # available_internships = combined_scores[combined_scores['Allocated_Spots'] < combined_scores['Capacity']].copy()
    available_internships = combined_scores.copy()

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


app = Flask(__name__)

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

if __name__ == '__main__':
    app.run()
