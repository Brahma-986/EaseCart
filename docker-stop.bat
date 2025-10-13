@echo off
echo 🛑 Stopping EaseCart Application...

REM Stop and remove containers
docker-compose down

echo ✅ EaseCart has been stopped successfully!
echo.
echo 💡 To start again: docker-start.bat
echo 🗑️  To remove all data: docker-compose down -v
echo 🧹 To remove images: docker-compose down --rmi all
echo.
pause

