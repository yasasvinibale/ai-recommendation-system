@echo off
echo Starting AI Recommendation System...
echo.

echo [1/3] Starting Backend Server...
cd backend
start "Backend Server" cmd /k "python app.py"
timeout /t 3 /nobreak > nul

echo [2/3] Starting Frontend Server...
cd ../frontend
start "Frontend Server" cmd /k "npm start"
timeout /t 5 /nobreak > nul

echo [3/3] Opening Browser...
start http://localhost:3000

echo.
echo ========================================
echo AI Recommendation System is running!
echo ========================================
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo ========================================
echo.
echo Press any key to stop all servers...
pause > nul

echo Stopping servers...
taskkill /f /im python.exe > nul 2>&1
taskkill /f /im node.exe > nul 2>&1
echo Done!
