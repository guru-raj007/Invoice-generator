@echo off
title EventPro - Android APK Builder
echo ======================================================
echo   EventPro - Android APK Generator (Capacitor)
echo ======================================================
echo.
echo Step 1: Compiling latest code and syncing to Android project...
call npm run cap:sync
echo.
echo Step 2: Opening Android project in Android Studio...
echo (In Android Studio, click Build - Build Bundle(s) / APK(s) - Build APK(s))
call npm run cap:open
pause
