# NiceHash Excavator

Excavator is GPU miner by NiceHash for mining various altcoins on NiceHash.com. Excavator is being actively developed by djeZo and zawawa. Miner is using custom built code base with modern approach and supporting modern video cards - NVIDIA and AMD. (For AMD support, please see amd/README.txt for important details.)


# How to use Excavator?
-----------------------

Simple: No simple usage; Excavator can be only used by mining experts!

Advanced: There are two methods to use Excavator. Both rely on API commands you can find in file 'excavator-man-API.txt'. Do note that API manuals are still being created and that is just an incomplete draft so far.

1. Using API port; for that, you need an application that will pass commands to the Excavator. We do not provide any such application, nor there is any public source code available (yet). The API works over standard TCP port and is JSON-message based with '\n' terminated messages. Do note that once you build up such application, you virtually have no limits anymore. You can truly optimize your mining to the max; you can launch various algorithms (at the same time), you can randomly assign workers (turn devices on off), do dual/triple mining, algorithm switching, adjusting TDPs, core or memory clock and fan speeds. Additionally to that, you can also read various GPU parameters and algorithm speeds reached by GPUs.

2. Using start-up commanding file. See example 'command_file_example.json'.

File contains a JSON array of all actions that would happen during runtime of Excavator. Each array item has two mandatory fields and one optional. Mandatory is 'time' which tells you after how many seconds since start of Excavator commands should execute and 'commands' which is a JSON array of commands you can find in 'excavator-man-API.txt'. 

Optionally you can specify 'loop' which repeat commands every 'loop' seconds. When creating algorithms and workers, note that IDs of returned objects always  run from 0 and on, so first algorithm always has ID 0, second 1 etc. 

You will want to figure out ID of each card; use telnet to connect to Excavator then send command 
> {"id":1,"method":"device.list","params":[]}
to retreive all available devices and their IDs.

After you have your commanding file ready, use '-c' command line switch to provide file name when starting Excavator.


Additional notices
------------------

WARNING! Excavator supports overclocking. Use overclocking at your own risk. OVERCLOCKING MAY PERMANENTLY DAMAGE YOUR COMPUTER HARDWARE! If you overclock, we suggest you to set '-or' to reset clocks after miner quits. This may prevent driver crashes or freezes due to high clocks. With parameter '-od' you can adjust overclock delay and apply new clocks when mining is already happening. This can also prevent crashes or freezes due to high clocks.


Changelog
---------

v1.2.0a
- changed commanding interface to JSON based messages over startup file or API
- CUDA: added decred
- added OpenCL support
- OpenCL: added pascal
- OpenCL: added equihash

v1.1.4a
- slight equihash efficiency improvement for GTX 1060 cards
- equihash GTX 750 Ti fix
- added missing MSVC files
- fixed issue of inability to display proper power usage
- general improvements

v1.1.3a
- slight equihash speed improvement with same TDP
- added support for GTX 1080 Ti
- added option '-od' to set custom overclock delay
- bug fixes and improvements

v1.1.2a
- added reading of temperatures
- added reading of gpu and memory controller load
- added reading of power usage in W
- slight pascal speed improvement
- bug fixes and improvements

v1.1.1a
- improved sha256t speed
- bug fixes and improvements

v1.1.0a
- added equihash algorithm
- added sha256t algorithm (experiment)
- added support for overclocking and setting TDP
- bug fixes and improvements

v1.0.0b
- fixed cudart64_65.dll dep
- fixed job parsing mem leak
- fixed diff parsing in rare cases
- fixed extranonce2 counter
- few % faster pascal algorithm
- added '-cb' and '-ct' params to specify number of blocks and tpb

v1.0.0a
- initial public alpha release
- added support for PascalCoin
