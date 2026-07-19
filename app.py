from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import os

app = Flask(__name__)

api_key = os.getenv("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")

if not api_key:
    raise RuntimeError("OPENAI_API_KEY environment variable is not set.")

client = OpenAI(api_key=api_key)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()

        if not data or "message" not in data:
            return jsonify({"reply": "Please enter a message."})

        user_message = data["message"]

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are AI Buddy, a friendly and helpful AI assistant."
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ]
        )

        reply = response.choices[0].message.content

        return jsonify({"reply": reply})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"reply": f"Error: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
