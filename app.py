from flask import Flask, render_template, request, jsonify
import os
from openai import OpenAI

app = Flask(__name__)

client = OpenAI(api_key=os.getenv("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"))

@app.route("/", methods=["GET", "HEAD"])
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_msg = data.get("message") if data else None

        if not user_msg:
            return jsonify({"reply": "Enter message"})

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": user_msg}]
        )

        reply = response.choices[0].message.content
        return jsonify({"reply": reply})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"reply": "Error occurred"})

if __name__ == "__main__":
    app.run(debug=True)
