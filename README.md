# SafeText Guardian

## Problem
Older adults are frequently targeted by SMS and WhatsApp scams. They often lack the technical tools to distinguish between a genuine bank alert and a phishing attempt.

## Solution
SafeText Guardian is a specialized scam-text and phishing-link inspector. It combines deterministic rule-based analysis (for links and phrases) with the reasoning power of Gemma 4 to provide a clear, accessible risk verdict in multiple languages.

## How It Works
1. **Redaction**: Personal info (OTPs, phone numbers) is masked before AI processing.
2. **Rules Engine**: Scans for known phishing patterns, risky TLDs, and brand lookalikes.
3. **Gemma 4 Analysis**: The AI reviews the redacted text and rule evidence to produce a final risk level (Low/Medium/High) and a plain-language explanation.
4. **Accessible UI**: Results are presented with large badges and a read-aloud feature for ease of use.


## AI / Partner Technology Used
- **Gemma 4**: Used for final risk assessment and explanation.
- **Gemini API**: The infrastructure providing Gemma 4 access.
- **Flask**: Python backend.

## Setup Instructions
1. Install Python 3.10+.
2. Run `setup.bat`.
3. Create/edit `.env` and add your `GEMINI_API_KEY`.

## How to Run
Double-click `run.bat` and open `http://localhost:5000` in your browser.

## Team Members
- OPEN CRAFT

## Limitations
- Requires internet connection for AI analysis.
- Accuracy depends on the Gemini API's interpretation of the prompt.

## Credits
AI coding assistance was used: OpenCode with gemma4:31b-cloud.

## License
MIT
