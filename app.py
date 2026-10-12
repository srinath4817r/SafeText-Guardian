import os
import json
import logging
import traceback
from flask import Flask, request, jsonify, render_template
from guardian.analyzer import analyze_message

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        text = request.form.get('text', '').strip()
        language = request.form.get('language', 'English')
        
        image_file = request.files.get('image')
        image_bytes = None
        mime_type = None
        
        if image_file and image_file.filename:
            mime_type = image_file.content_type
            if mime_type not in ['image/png', 'image/jpeg', 'image/webp']:
                return jsonify({"error": "Unsupported image type. Use PNG, JPG or WebP"}), 400
            
            image_bytes = image_file.read()
            if len(image_bytes) > 5 * 1024 * 1024:
                return jsonify({"error": "Image exceeds 5MB limit"}), 400
            
        result = analyze_message(text, image_bytes, mime_type, language)
        return jsonify(result)
        
    except RuntimeError as e:
        traceback.print_exc()
        return jsonify({"error": "API Key missing: please check your .env file"}), 500
    except ValueError as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        traceback.print_exc()
        err_msg = str(e)
        err_lower = err_msg.lower()
        if "429" in err_msg or "resource_exhausted" in err_lower:
            return jsonify({"error": "API rate limit reached (429). Please wait a moment."}), 429
        elif "spikes in demand" in err_lower or "unavailable" in err_lower:
            return jsonify({"error": "Gemini API temporarily busy (high demand). Please try again shortly."}), 503
        elif "not found" in err_lower or "404" in err_msg or ("model" in err_lower and "invalid" in err_lower):
            return jsonify({"error": "Model not found. Please check GEMMA_MODEL in .env"}), 500
        elif "connection" in err_lower or "network" in err_lower:
            return jsonify({"error": "Network error connecting to API"}), 500
        return jsonify({"error": f"An unexpected error occurred: {err_msg}"}), 500

@app.route('/api/model-info')
def get_model_info():
    model = os.getenv("GEMMA_MODEL", "gemma-4-31b-it")
    if model and "GEMMA_MODEL=" in model:
        model = model.split("GEMMA_MODEL=")[-1].strip()
    return jsonify({"model": model.strip() if model else "gemma-4-31b-it"})

@app.route('/static/samples/sample_result.json')
def get_sample():
    sample_file = os.path.join(os.path.dirname(__file__), 'samples', 'sample_result.json')
    if os.path.exists(sample_file):
        with open(sample_file, 'r', encoding='utf-8') as f:
            return jsonify(json.load(f))
    return jsonify({"error": "Sample file not found"}), 404

if __name__ == '__main__':
    app.run(port=5000, debug=True)

