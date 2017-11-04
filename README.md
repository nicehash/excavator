# NiceHash Excavator

Excavator is GPU miner by NiceHash for mining various altcoins on [NiceHash.com](https://www.nicehash.com) and other pools. Excavator is being actively developed by djeZo, zawawa, dropky and voidstar. Miner is using custom built code base with modern approach and supporting modern video cards - NVIDIA and AMD. For AMD support, please see [AMD readme](amd/README.md) for important details.

Download from here: https://github.com/nicehash/excavator/releases

**WARNING!!! Excavator is a proprietary software by NiceHash and has a special [EULA](excavator-EULA.txt).
YOU ARE NOT ALLOWED TO REDISTRIBUTE IT!**


# How to Use Excavator?

First, make sure you have Visual C++ 2013 redistributable (x64) installed.

**ADVANCED** There are two methods to use Excavator. Both rely on API commands you can find in [API section](/api).

1. Using API port or HTTP API; for that, you need an application that will pass commands to the Excavator. We do not provide any such application (except [web example](/web)), nor there is any public source code available (yet).

   The API works over standard TCP port and is JSON-message based with '\n' terminated messages. Do note that once you build up such application, you virtually have no limits anymore. You can truly optimize your mining to the max; you can launch various algorithms (at the same time), you can randomly assign workers (turn devices on off), do dual/triple mining, algorithm switching, adjusting TDPs, core or memory clock and fan speeds. Additionally to that, you can also read various GPU parameters and algorithm speeds reached by GPUs.

   Default API bind port is 3456, but you can change it with '-p' command line parameter.

   HTTP API is disabled by default. You can enable it by configuring [command line parameters](#cmdline).

2. Using start-up commanding file. See example [default_command_file.json](default_command_file.json).

   File contains a JSON array of all actions that would happen during runtime of Excavator. Each array item has two mandatory fields and one optional. Mandatory is 'time' which tells you after how many seconds since start of Excavator commands should execute and 'commands' which is a JSON array of commands you can find in [API section](/api).

   Optionally you can specify 'loop' which repeat commands every 'loop' seconds. When creating algorithms and workers, note that IDs of returned objects always  run from 0 and on, so first algorithm always has ID 0, second 1 etc.

   You will want to figure out ID of each card; use telnet to connect to Excavator then send command
   > {"id":1,"method":"device.list","params":[]}

   to retreive all available devices and their IDs.

   After you have your commanding file ready, use '-c' command line switch to provide file name when starting Excavator.

   We suggest using [excavator+web+restart_script.bat](excavator+web+restart_script.bat) that automatically launches web browser displaying status and has a restart script to put Excavator back on if it crashes.

Excavator also supports configuring console logging level and file logging level. Level '0' means full detail logging, level '6' means no logging. By default console logging is set to '2', file logging set to '6'. You can change file logging with '-f' and console logging with '-d' command line parameters.

To get details about specific algorithms that are available in Excavator, check [AMD information](/amd) or [NVIDIA information](/nvidia).


# <a name="cmdline"></a> Command Line Parameters

Parameter | Range | Description | Default
-----------------|----------|----------|---------
-h | none | Displays help; details about all supported command line parameters |
-p | 0-65535 | API bind port; set to 0 to disable API | 3456
-i | local IP | API bind IP | 127.0.0.1
-wp | 0-65535 | HTTP API bind port | 0
-wi | local IP | HTTP API bind IP | 127.0.0.1
-wa | string | HTTP API authorization token |
-d | 0-6 | Console log level | 2
-f | 0-6 | File log level | 6
-fn | file name | Log file | log_$timestamp.log
-c | file name | Use commanding file |
-na |  | Disable AMD support |


# Additional Notices

WARNING! Excavator supports overclocking. Use overclocking at your own risk. OVERCLOCKING MAY PERMANENTLY DAMAGE YOUR COMPUTER HARDWARE!


# Changelog

v1.3.6a
- cryptonight bug fixes & improvements

v1.3.5a
- cryptonight bug fixes & improvements

v1.3.4a
- bug fixes & improvements
- speed improvements for equihash
- speed improvements for keccak
- speed improvements for lyra2rev2

v1.3.3a
- bug fixes & improvements
- added algorithm cryptonight
- added algorithm keccak

v1.3.2a
- equihash bug fixes & improvements

v1.3.1a
- bug fixes & improvements
- equihash speed improvement
- support for P106-100 and P104-100

v1.3.0a
- bug fixes & improvements
- improve DAG cache handling for daggerhashimoto/ethash
- improve hardware acceleration, including reduced power consumption and named parameters for memory timings etc
- added dual mining CUDA daggerhashimoto_sia, daggerhashimoto_pascal, daggerhashimoto_decred
- speed improvements for CUDA sia
- added CUDA DAG device memory storage
- added initial Linux support

v1.2.11a
- added support for TITAN Xp
- added algorithm CUDA lyra2rev2
- added API method message
- bug fixes & improvements

v1.2.10a
- added DAG cache host memory storage for quicker DAG switches
- speed improvements for all CUDA algorithms for certain cards
- CUDA faster DAG generation
- bug fixes for AMD cards
- added option to disable AMD support

v1.2.9a
- further phymem.sys bug fixes
- added algorithm CUDA daggerhashimoto
- bug fixes

v1.2.8a
- improved phymem.sys handling

v1.2.7a
- digitally signed phymem.sys
- added named parameters
- added algorithm CUDA blake2s
- bug fixes and improvements

v1.2.6a
- stabilized hardware acceleration
- improved DAG handling
- improved lbry parameters
- zero division bug fix

v1.2.5a
- added hardware acceleration for Radeon RX 460/470/480/560/570/580
- added daggerhashimoto (a.k.a. Ethash) OpenCL kernel for NiceHash
- added algorithm details (pool stats)
- added system details to info API
- added optional HTTP API auth token
- wrong OpenCL.dll fix attempt
- improved OpenCL hardware management
- added algorithm CUDA lbry

v1.2.4a
- improved OpenCL hardware detection and monitoring
- improved web page

v1.2.3a
- added algorithm OpenCL sia
- added algorithm OpenCL decred

v1.2.2a
- added algorithm CUDA sia
- general fixes and improvements

v1.2.1a
- support for API and commanding file at the same time
- added commanding file event: on_quit
- fixed connection bug
- added HTTP server for API commands
- fixed a bug in phymem.sys
- optimized equihash OpenCL kernel
- added API method: info
- general fixes and improvements

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
