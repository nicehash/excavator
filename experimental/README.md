NiceHash QuickMiner (nhqm package) contains latest version of Excavator bundled with:
* watchdog (NiceHashQuickMiner.exe),
* autostart service (nhqmservice.exe),
* example command file (commands.json) and
* example startup command line (startcmdline.conf).

# Installation
Simply extract all files in .zip archive into any folder you want.

# Before first use
You HAVE to modify `commands.json` file by putting in your NiceHash BTC address. If you have more than one GPU, you should also add `worker.add` commands so you'd mine on other GPUs not only first one. You may use other features. Check [API page](/api) for more info.

# How to run
Simply double click `NiceHashQuickMiner.exe` and mining process will start. Some extra features are available in your Windows tray (notification area); right click NiceHash icon and you can add/remove autostart service. By enabling autostart, NiceHash QuickMiner will start with Windows automatically.

# Deinstallation
Delete all files. If you have added autostart, make sure to disable autostart before you delete all files.

# Recommendations
Also download [octune](/experimental/octune_v1.zip). Unzip and run `octune.html` when Excavator is running. You will get a (not-so-good-looking) interface to manage Excavator over your web browser. You can play with overclock settings. Once you are happy with your settings, just save everything by clicking on button `Save current configuration`. Next time Excavator is started, your saved configuration will be used. You do not have to modify `commands.json` file manually anymore.
