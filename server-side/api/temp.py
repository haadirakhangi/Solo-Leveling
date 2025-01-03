from dotenv import load_dotenv
from serpapi import GoogleSearch
import os
import requests

load_dotenv()
serper_api_key = os.getenv('SERPER_API_KEY')
google_serp_api_key = os.getenv('GOOGLE_SERP_API_KEY')

def extract_course_links(search_results):
    """Extracts valid course links from inline sitelinks."""
    trusted_sources = ["Coursera","edX", "Udacity", "upGrad", "FutureLearn", "Udemy", "Harvard University"]
    course_links = []

    if "organic_results" not in search_results:
        return course_links
    for result in search_results.get("organic_results", []):
        source = result.get("source")
        sitelinks = result.get("sitelinks", {}).get("inline", [])
        if source in trusted_sources and sitelinks:
            for sitelink in sitelinks:
                link = sitelink.get("link")
                if link :
                    course_links.append({
                        "source": source,
                        "title": sitelink.get("title", "No Title"),
                        "link": link
                    })

    return course_links

def find_courses(skills):
    """Searches for courses and extracts valid links."""
    course_links = {}
    for skill in skills:
        params = {
            "q": f"courses related to {skill}",
            "engine": "google",
            "api_key": google_serp_api_key,
            "location": "India"
        }
        try:
            search = GoogleSearch(params)
            results = search.get_dict()
            extracted_links = extract_course_links(results)
            if extracted_links:
                course_links[skill] = extracted_links
        except Exception as e:
            print(f"Error searching for {skill}: {e}")
            course_links[skill] = []
    return course_links

# Example usage
skills = ["data science", "machine learning", "deep learning"]
courses = find_courses(skills)
print(courses)
