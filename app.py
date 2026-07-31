from flask import Flask, render_template, request, jsonify
from google import genai
import os

app = Flask(__name__)

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()

        if not data or "message" not in data:
            return jsonify({"reply": "Please enter a message."})

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=data["message"]
        )

        return jsonify({
            "reply": response.text
        })

    except Exception as e:
        return jsonify({
            "reply": str(e)
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
