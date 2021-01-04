@echo off
:: CONFIG STARTS
SET COMMAND_FILE=default_command_file.json
SET CONSOLE_LOG_LEVEL=2
SET FILE_LOG_LEVEL=6
SET WEB_PORT=38080
SET WEB_HOST=::1
SET WEB_AUTH_TOKEN=
SET RESTART_DELAY=4
:: CONFIG ENDS

echo Welcome to NiceHash Excavator

:start
@setlocal enableextensions
@cd /d "%~dp0"
echo Starting Excavator...
excavator.exe -c %COMMAND_FILE% -d %CONSOLE_LOG_LEVEL% -f %FILE_LOG_LEVEL% -p 0 -wp %WEB_PORT% -wi %WEB_HOST% -wa %WEB_AUTH_TOKEN%
echo Excavator has crashed... restarting in %RESTART_DELAY% seconds...
ping 127.0.0.1 -n %RESTART_DELAY% > nul
goto start
