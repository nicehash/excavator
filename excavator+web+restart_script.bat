@echo off
:: CONFIG STARTS
SET COMMAND_FILE=default_command_file.json
SET CONSOLE_LOG_LEVEL=2
SET FILE_LOG_LEVEL=6
SET WEB_PORT=38080
SET WEB_HOST=127.0.0.1
SET WEB_LAUNCH_DELAY=5
SET RESTART_DELAY=10
:: CONFIG ENDS

:: AMD SPECIFIC SETTERS (DO NOT MODIFY!)
SET GPU_FORCE_64BIT_PTR=1
SET GPU_MAX_HEAP_SIZE=100
SET GPU_USE_SYNC_OBJECTS=1
SET GPU_MAX_ALLOC_PERCENT=100
SET GPU_SINGLE_ALLOC_PERCENT=100

echo Welcome to NiceHash Excavator
echo Opening website
start cmd /c "@echo off & echo Please, wait %WEB_LAUNCH_DELAY% seconds for Excavator status page to open... & ping 127.0.0.1 -n %WEB_LAUNCH_DELAY% > nul & if "%WEB_HOST%"=="0.0.0.0" (explorer http://127.0.0.1:%WEB_PORT%) else (explorer http://%WEB_HOST%:%WEB_PORT%) & exit"

:start
echo Starting Excavator...
excavator.exe -c %COMMAND_FILE% -d %CONSOLE_LOG_LEVEL% -f %FILE_LOG_LEVEL% -p 0 -wp %WEB_PORT% -wi %WEB_HOST%
echo Excavator has crashed... restarting in %RESTART_DELAY% seconds...
ping 127.0.0.1 -n %RESTART_DELAY% > nul
goto start