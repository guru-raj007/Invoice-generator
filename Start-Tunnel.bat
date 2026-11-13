@echo off
title EventPro - Cloudflare Mobile Tunnel
echo ======================================================
echo   EventPro - High-Speed Mobile Cloudflare Tunnel
echo ======================================================
echo.
echo Starting secure tunnel directly to port 5173...
echo.
cloudflared.exe tunnel --url http://127.0.0.1:5173
pause
