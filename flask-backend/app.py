import anthropic
import os
import json
from fuzzywuzzy import fuzz
from flask import Flask, request, jsonify
from flask_cors import CORS
import difflib
from dotenv import load_dotenv
from google import generativeai as genai
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = Flask(__name__)
CORS(app)

client = anthropic.Anthropic(
    api_key=os.getenv("CLAUDE_API_KEY")
)

summaryModel = genai.GenerativeModel("gemini-1.5-pro")

summaryChat = summaryModel.start_chat(history=[
    {
        "role": "user",
        "parts": [
            "You are a helpful chatbot, designed to summarize the doctor's responses to the patient"
            "Provide an accurate, but concise summmary that hits every main point"
            "Do not leave out any potential important information"

            "The first word of your response should be the langauge chosen. For example, if the langauge is Spanish, before you summarize the rest of the text, put `Spanish. (summary starts)`"
        ]
    },
    {
        "role": "model",
        "parts": ["Understood! I will provide an accurate summary of the doctor's responses!"]
    }
])

translationModel = genai.GenerativeModel("gemini-1.5-pro")
translationChat = translationModel.start_chat(history=[
    {
        "role": "user",
        "parts": [
            "You are a helpful translator, designed to translate english into a designated language"
            "Provide accurate responses that allow foreigners to easily read in their native language"
        ]
    },
    {
        "role": "model",
        "parts": ["Understood! I will provide an accurate translation to the designated language!"]
    }
])

@app.route("/summarize", methods=["POST"])
def summarize_response():
    try:
        data = request.get_json()
        print("Incoming data:", data)

        prompt = f"Summarize the following text: {data}"
        response = summaryChat.send_message(prompt)

        output = response.text.strip()
        return {"response": output}
        
    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/translate", methods=["POST"])
def translate_transcription():
    try:
        data = request.get_json()

        text = data.get("text", "")

        if not text.strip():
            return {"error": "No text provided"}, 400

        parts = text.strip().split(" ", 1)

        if len(parts) < 2:
            return {"error": "Text must start with a target language followed by the content to translate"}, 400

        target_language = parts[0]
        content_to_translate = parts[1]

        prompt = f"Translate the following text to {target_language}:\n\n{content_to_translate}"

        response = translationChat.send_message(prompt)
        output = response.text.strip()

        return {"response": output}
    
    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500


def load_anatomy_json():
    path = os.path.join(os.path.dirname(__file__), "anatomyJSON.json")
    try:
        with open(path, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading anatomy JSON: {e}")
        return []


def match_part_to_object_id(part_name, anatomy, original_input=""):
    best_match = None
    highest_score = 0

    candidates = [p.strip() for p in part_name.split(";")]
    original_input = original_input.lower()

    # Infer left/right side preference
    preferred_side = None
    if "left" in original_input:
        preferred_side = "left"
    elif "right" in original_input:
        preferred_side = "right"

    for candidate in candidates:
        candidate_keywords = candidate.lower().split()

        for entry in anatomy:
            name = entry.get("name", "").lower()

            # Only proceed if any keyword is in the entry name
            if not any(kw in name for kw in candidate_keywords):
                continue

            # Optional: check side preference
            score = fuzz.token_sort_ratio(name, candidate)
            if preferred_side and preferred_side in name:
                score += 10

            if score > highest_score:
                highest_score = score
                best_match = entry

    return best_match if highest_score > 70 else None

latest_result = {"objectId": None, "part_name": "", "name": ""}

@app.route("/anatomy", methods=["POST"])
def ask():
    try:
        user_input = request.json.get("question", "")
        if not user_input:
            return jsonify({"error": "No question provided"}), 400
        
        message = client.messages.create(
            model="claude-opus-4-20250514",
            max_tokens=100,
            temperature=0,
            system="You are a medical assistant. Extract the *specific muscle or anatomical structure* mentioned in the sentence. If the language is vague, guess the most likely muscles based on typical anatomy. Output just the names, separated by semicolons.",
            messages=[
                {
                    "role": "user",
                    "content": [{"type": "text", "text": user_input}]
                }
            ]
        )

        part_name = message.content[0].text.strip()
        anatomy_data = load_anatomy_json()
        matched = match_part_to_object_id(part_name, anatomy_data, user_input)

        if matched:
            latest_result.update({
                "part_name": part_name,
                "objectId": matched["objectId"],
                "name": matched["name"]
            })
            return jsonify(latest_result)
        else:
            latest_result.update({"objectId": None, "name": "", "part_name": ""})
            return jsonify({"error": "No matching anatomy part found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/latest-object", methods=["GET"])
def get_latest_object():
    return jsonify(latest_result)

if __name__ == "__main__":
    app.run(debug=True)
