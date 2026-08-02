from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import os

app = Flask(__name__)

# ==========================
# Gemini API
# ==========================

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is missing!")

client = genai.Client(api_key=API_KEY)

MODEL = "gemini-3.5-flash-lite"

# ==========================
# Home Page
# ==========================

@app.route("/")
def home():
    return render_template("index.html")

# ==========================
# Chat API
# ==========================

@app.route("/chat", methods=["POST"])
def chat():

    try:

        data = request.get_json()

        user_message = data.get("message", "")

        if not user_message:
            return jsonify({
                "reply": "Please type a message."
            })

        response = client.models.generate_content(
            model=MODEL,
            contents=user_message
        )

        return jsonify({
            "reply": response.text
        })

    except Exception as e:

        return jsonify({
            "reply": f"⚠️ Error: {str(e)}"
        })

# ==========================
# Run
# ==========================

if __name__ == "__main__":
    app.run(debug=True)
