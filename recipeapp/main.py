from website import create_app
from flask_cors import CORS

import os
import json
from flask import Flask, request, render_template, jsonify
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, CouldNotRetrieveTranscript
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv('dev.env')
gemini_api_key = 'AIzaSyC8TXINh7qxkn_EAjctpB3RdssvoOh402I'
print(f"GEMINI_API_KEY: {gemini_api_key}")
app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
