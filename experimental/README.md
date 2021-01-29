# NiceHash QuickMiner
[NiceHash QuickMiner](NH_QuickMiner_v0.1.1.0_Excavator_b530.zip) (latest version: 0.1.1.0) contains latest version of Excavator bundled with:
* watchdog (NiceHashQuickMiner.exe),
* autostart service (nhqmservice.exe) and
* example command file (commands.json)

# Installation
Simply extract all files in .zip archive into any folder you want.

# How to run
Simply double click `NiceHashQuickMiner.exe` and mining process will start. You have to change mining address (to your NiceHash Mining address) - you can do this by modifying `nhqm.conf` file. Besides configuring your BTC mining address, you may want to modify following:
* serviceLocation (0 is eu, 1 is usa),
* workerName (name of your rig),
* launchCommandLine (extra command line options) and
* consoleLogLevel & fileLogLevel (logging options).

**_Please, have fileLogLevel set to 0 at all times and submit all the errors and issues you find using this software bundle. Thanks!_**

Some extra features are available in your Windows tray (notification area); right click NiceHash icon and you can add/remove autostart service. By enabling autostart, NiceHash QuickMiner will start with Windows automatically.

# Deinstallation
Delete all files. If you have added autostart, make sure to disable autostart before you delete all files.

# Recommendations
Also use OCTune; run `octune.html` when Excavator is running. You will get a (not-so-good-looking) interface to manage Excavator over your web browser. You can play with overclock settings. Once you are happy with your settings, just save everything by clicking on the button `Save current configuration`. Next time Excavator is started, your saved configuration will be used. You do not have to modify `commands.json` file manually anymore.

# FAQ
_1. Why is NiceHashQuickMiner started with administrator privileges?_

Administrator privileges are needed for overclocking. MSI Afterburner (which you'd not need anymore) is started with administrator privileges aswell. Since up to 20% extra performance is possible to achieve with up to 50% reduced power load, we do not believe it is smart to mine without adjusting clocks and power limits which require administrator privileges.

_2. What happens when DAG is being generated?_

Excavator would set memory overclock to 0 for the time DAG is being generated. This is done to prevent generation of corrupted DAG which causes all future shares to be invalid. Note that this feature only works if you set your overclock with Excavator and it DOES NOT work when using MSI Afterburner for overclocking. With this feature you can clock your card higher and do not need to worry about corrupted DAGs because these cannot happen anymore.

_3. Where can I see number of accepted and rejects shares?_

You can see number of accepted and rejected shares by calling [API method algorithm.list](https://github.com/nicehash/excavator/tree/master/api#algorithm-list). Note that, to the contrary of other PPLNS pools, for NiceHash, these values are not important. The reason is, because each share has a certain value that may not be the same. NiceHash does not have a fixed difficulty but rather dynamic. Higher difficulty shares have higher value. Since NiceHash has a PPS payout scheme (pay-per-share), it is very important to know the value of the share (share at twice the difficulty is worth twice as much BTC). If you chart down shares with their values, you get accepted/rejected speed. These charts are already available at NiceHash - Rig Manager. Other pools often display accepted speed on their charts as the value that the miner is reporting to the pool - and this value can be cheated-out (sending some extreme large value for example). NiceHash does not support speed reported by miner, rather it calculates accepted/rejected speed out of your shares. Thus, contrary to the other pools, these charts have very high value as they represent direct performance of your miner and your mining payouts are based directly on that.
