@echo off
echo Setting up SafeText Guardian...
if not exist .venv (
    python -m venv .venv
)
call .venv\Scripts\activate
python -m pip install -r requirements.txt
if not exist .env (
    copy .env.example .env
)
echo Setup complete. Please add your API key to .env.
pause
