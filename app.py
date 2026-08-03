from flask import Flask, render_template, request, jsonify
from google import genai
import os
from werkzeug.utils import secure_filename

# ==========================
# Flask App
# ==========================

app = Flask(__name__)

# ==========================
# Upload Folder
# ==========================

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

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

        user_message = data.get("message", "").strip()

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
# File Upload API
# ==========================

@app.route("/upload", methods=["POST"])
def upload():

    try:

        if "file" not in request.files:
            return jsonify({
                "success": False,
                "message": "No file selected."
            })

        file = request.files["file"]

        if file.filename == "":
            return jsonify({
                "success": False,
                "message": "Empty filename."
            })

        filename = secure_filename(file.filename)

        filepath = os.path.join(
            app.config["UPLOAD_FOLDER"],
            filename
        )

        file.save(filepath)

        return jsonify({
            "success": True,
            "filename": filename,
            "message": "File uploaded successfully."
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        })

# ==========================
# Run App
# ==========================

if __name__ == "__main__":
    app.run(debug=True)
