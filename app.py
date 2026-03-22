from flask import Flask, render_template, request, jsonify
from openai import OpenAI

app = Flask(__name__)

# 🔑 Put your API key here
client = OpenAI(api_key="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")

# Home page
@app.route("/")
def home():
    return render_template("index.html")

# Chat API route
@app.route("/chat", methods=["POST"])
def chat():
    user_msg = request.json.get("message")

    if not user_msg:
        return jsonify({"reply": "No message received"})

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": user_msg}
            ]
        )

        reply = response.choices[0].message.content
        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"reply": "Error: " + str(e)})

# Run app
if __name__ == "__main__":
    app.run(debug=True)
