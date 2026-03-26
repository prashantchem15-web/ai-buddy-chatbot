from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import os

app = Flask(__name__)

# Secure API key
client = OpenAI(api_key=os.getenv("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"))

# Home route (handles GET + HEAD safely)
@app.route("/", methods=["GET", "HEAD"])
def home():
    try:
        return render_template("index.html")
    except Exception as e:
        print("HOME ERROR:", e)
        return "Home Page Error"

# Chat route
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"reply": "No data received"})

        user_msg = data.get("message")

        if not user_msg:
            return jsonify({"reply": "Please enter a message"})

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": user_msg}
            ]
        )

        reply = response.choices[0].message.content
        return jsonify({"reply": reply})

    except Exception as e:
        print("CHAT ERROR:", e)
        return jsonify({"reply": "Server error occurred"})

# Run app locally
if __name__ == "__main__":
    app.run(debug=True)
