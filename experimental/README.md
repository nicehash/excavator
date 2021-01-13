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

# FAQ
1. Why is NiceHashQuickMiner started with administrator privileges?

Administrator privileges are needed for overclocking. MSI Afterburner (which you'd not need anymore) is started with administrator privileges aswell. Since up to 20% extra performance is possible to achieve with up to 50% reduced power load, we do not believe it is smart to mine without adjusting clocks and power limits which require administrator privileges.

2. What happens when DAG is being generated?

Excavator would set memory overclock to 0 for the time DAG is being generated. This is done to prevent generation of corrupted DAG which causes all future shares to be invalid. Note that this feature only works if you set your overclock with Excavator and it DOES NOT work when using MSI Afterburner for overclocking. With this feature you can clock your card higher and do not need to worry about corrupted DAGs because these cannot happen anymore.
