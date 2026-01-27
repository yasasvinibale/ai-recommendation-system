@echo off
echo Setting up AI Recommendation System...
echo.

echo Installing Python dependencies...
cd backend
pip install -r requirements.txt
if errorlevel 1 (
    echo Failed to install Python dependencies
    pause
    exit /b 1
)

echo.
echo Installing Node.js dependencies...
cd ../frontend
npm install
if errorlevel 1 (
    echo Failed to install Node.js dependencies
    pause
    exit /b 1
)

echo.
echo Setup completed successfully!
echo.
echo To start the application:
echo 1. Start the backend: cd backend && python app.py
echo 2. Start the frontend: cd frontend && npm start
echo.
echo The backend will run on http://localhost:8000
echo The frontend will run on http://localhost:3000
echo.
pause
