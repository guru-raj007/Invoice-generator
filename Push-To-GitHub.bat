@echo off
title Push Mahapathi GST Invoice to GitHub
echo ======================================================
echo   Push Mahapathi GST Invoice to GitHub
echo   Configured Email: gururajkumareswaran@gmail.com
echo ======================================================
echo.

set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/USERNAME/mahapathi-gst-invoice.git): "

if "%REPO_URL%"=="" (
    echo No repository URL entered. Exiting.
    pause
    exit /b
)

echo.
echo Adding remote origin...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo.
echo Pushing branch 'main' to GitHub...
git push -u origin main

echo.
echo Done! Now connect this repository in Cloudflare Pages.
pause
