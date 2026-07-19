from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import os

app = Flask(__name__)

client = OpenAI(
    api_key="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"
)
