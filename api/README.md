# Excavator API Version 0.2.0

**WARNING! This document is not complete yet and is still being worked on. Also, during Excavator alpha versions, API may change so make sure you check this page always before updating to next alpha version!**

# Overview

There are two ways to use API. Details are explained below.

1. Using HTTP API

   You need to launch Excavator with `-wp` command line parameter being set to local HTTP bind port. Optionally, you may also set `-wi` to set local bind IP and `-wa` to set authorization token.

   To issue an API command, use following URL format:

   > http://bind-ip:bind-port/api?command={JSON-command-here}

   You may encode URL. List of available JSON commands is listed below in this document. Response is returned as JSON message in HTTP content field.

   To limit access to write-API methods, you can specify HTTP API authorization token. When calling these API methods, you need to set HTTP header with name `Authorization` and value token. Write-API methods are all methods that alter behaviour of Excavator or cause some system/device changes.

2. Using TCP stream

   You need to launch Excavator with `-p` command line parameter being set to local TCP bind port. Optionally, you may also set `-i` to set local bind IP.

   API is based on TCP-JSON messaging system. Every input JSON message (command) has an output JSON message (response). All commands and response are terminated by newline character `\n`.

Each command has three mandatory fields:

Name | Type | Description
-----|------|-------------
`id` | int | Identification number for command.
`method` | string | Method name.
`params` | array of strings | Array of parameters. All parameters are always strings and transformed into other types by Excavator if needed.

Each response has two mandatory fields:

Name | Type | Description
-----|------|-----------
`id` | int | Identification number matching command number.
`error` | string | If error happened, this field contains string. If this field is null, no error happened and action was successful.

The response usually has more fields which depends on API method being executed.


# Methods

**Subscribe managing methods**

Method | Description
-------|------------
[subscribe](#subscribe) | Connects to NiceHash stratum server.
[subscribe.info](#subscribe-info) | Lists subscribe information.
[unsubscribe](#unsubscribe) | Disconnects from NiceHash stratum server.

**Device related get and set methods**

Method | Description
-------|-------------
[device\.list](#device-list) | Queries available devices - GPUs.
[device\.get](#device-get) | Queries particular device - GPU.
[devices\.get](#devices-get) | Queries available devices - GPU.
[device\.set\.power_limit](#device-set-power-limit) | Sets device power limit in Watts.
[device\.set\.tdp](#device-set-tdp) | Sets device TDP.
[device\.set\.tdp\.simple](#device-set-tdp-simple) | Sets device power mode.
[device\.set\.core_delta](#device-set-core-delta) | Sets device core clock (delta +/-).
[device\.set\.memory_delta](#device-set-memory-delta) | Sets device memory clock (delta +/-).
[device\.set\.fan\.speed](#device-set-fan-speed) | Sets device fan speed.
[device\.set\.fan\.reset](#device-set-fan-reset) | Resets device fan speed.

**Algorithm managing methods**

Method | Description
-------|------------
[algorithm\.add](#algorithm-add) | Adds new algorithm.
[algorithm\.remove](#algorithm-remove) | Removes algorithm.
[algorithm\.clear](#algorithm-clear) | Removes all algorithms.
[algorithm\.list](#algorithm-list) | Lists all algorithms.
[algorithm\.print\.speeds](#algorithm-print-speeds) | Prints speed of all algorithms.

**Worker managing methods**

Method | Description
-------|------------
[worker\.add](#worker-add) | Adds new worker.
[worker\.free](#worker-free) | Frees worker.
[worker\.clear](#worker-clear) | Frees all workers.
[worker\.reset](#worker-reset) | Resets worker's speed.
[worker\.reset\.device](#worker-reset-device) | Resets worker's speed for device.
[worker\.list](#worker-list) | Lists all workers.
[worker\.print\.speed](#worker-speed)| Prints speed of a worker.
[worker\.print\.speeds](#worker-speeds)| Prints speed of all workers.
[workers\.add](#workers-add) | Adds multiple new workers.
[workers\.free](#workers-free) | Frees multiple workers.
[workers\.reset](#workers-reset) | Resets logged speed for multiple workers.

**Miner managing methods**

Method | Description
-------|------------
[miner\.stop](#miner-stop) | Stops mining without exiting excavator.
[miner\.alive](#miner-alive) | Check the excavator responsiveness.
[state\.set](#state-set) | Set state of all GPU devices.

**Miscellaneous methods**

Method | Description
-------|------------
[info](#info) | Gets information about Excavator.
[quit](#quit) | Quits Excavator.
[message](#message) | Displays message in console.


# <a name="subscribe"></a> subscribe

Establish connection with NiceHash stratum server.

Command parameter # | Type | Description
-------|---------|---------
1 | string | Stratum URL (hostname with port).
2 | string | Username and password (split with `:`);

NiceHash stratum servers are available at: nhmp-ssl.LOCATION.nicehash.com:443
(LOCATION: eu, usa).


Example usage:
```
{"id":1,"method":"subscribe","params":["nhmp-ssl.usa.nicehash.com:443", "34HKWdzLxWBduUfJE9JxaFhoXnfC6gmePG.test2:x"]}
```

Example response:
```
{
   "id":1,
   "error":null
}
```

# <a name="subscribe-info"></a> subscribe.info

Returns subscribe information.

This method does not take in any parameter. If connection to the remote server is established and subscribe was successful or if subscribe has not been called yet, field error is set to null. Otherwise field error contains error message of type string.

Response field | Type | Description
------|---------|---------
`address` | string | Remote address of the NiceHash stratum.
`login` | string | Login credentials.
`connected` | boolean | `True` if connected to the stratum.
`server_status` | string | Message from the stratum server.

Example usage:
```
{"id":1,"method":"subscribe.info","params":[]}
```

Example response:
```
{  
  "id":1,
  "address":"nhmp-ssl.eu.nicehash.com:443",
  "login":"34HKWdzLxWBduUfJE9JxaFhoXnfC6gmePG.test2:x",
  "connected":true,
  "server_status":"Subscribed"
}
```

# <a name="unsubscribe"></a> unsubscribe

Drops connection to the NiceHash stratum server.

This method does not take in any parameter.

Example usage:
```
{"id":1,"method":"unsubscribe","params":[]}
```

Example response:
```
{
   "id":1,
   "error":null
}
```


# <a name="device-list"></a> device.list

Returns list of available CUDA devices. Use this method to get list of available devices and their static (non-changing) details.

This method does not take in any parameter.

Response field | Type | Description
------|---------|---------
`devices` | array | Array of device objects. If system has no available GPGPU devices, this array is empty.
`devices[i]/device_id` | int | Device ID. This is a handle for future API commands related to this device.
`devices[i]/uuid` | int | Device UUID.
`devices[i]/name` | string | Device name.
`devices[i]/gpgpu_type` | int | GPGPU type. 1 means CUDA, 2 means OpenCL.
`devices[i]/subvendor` | string | Subvendor id.
`devices[i]/display_mode` | int | Display mode. 1 if a display is currently connected to the device, 0 if not.
`devices[i]/gpu_memory_total` | long | Total GPU memory in bytes.
`devices[i]/details` | object | Device details.
`devices[i]/details/cuda_id` | int | Device CUDA ID.
`devices[i]/details/sm_major` | int | Device SM major version.
`devices[i]/details/sm_minor` | int | Device SM minor version.
`devices[i]/details/bus` | int | Device bus ID.
`devices[i]/details/sli` | boolean | `True` if SLI is enabled on device.

Example usage:
```
{"id":1,"method":"device.list","params":[]}
```

Example response:
```
{
   "devices":[
      {
         "device_id":0,
         "uuid":"GPU-8f6552ba-76e8-4e86-c2bb-53b69fb685ef",
         "name":"GeForce GTX 1060 6GB",
         "gpgpu_type":1,
         "subvendor":"1462",
         "display_mode":1,
         "gpu_memory_total":6442450944,
         "details":{
            "cuda_id":1,
            "sm_major":6,
            "sm_minor":1,
            "bus_id":3,
            "sli":false
         }
      },
      {
         "device_id":1,
         "uuid":"GPU-6de5ebad-b2b8-7ce9-995c-35eece4e66ab",
         "name":"GeForce GTX 1070",
         "gpgpu_type":1,
         "subvendor":"3842",
         "display_mode":0,
         "gpu_memory_total":8589934592,
         "details":{
            "cuda_id":3,
            "sm_major":6,
            "sm_minor":1,
            "bus_id":5,
            "sli": false
         }
      }
   ],
   "id":1,
   "error":null
}
```


# <a name="device-get"></a> device.get

Returns details about certain device. Use this method to get static (non-changing) and changing details of device.

Command parameter # | Type | Description
-------|---------|---------
1 | string | Device ID or Device UUID.

Response field | Type | Description
------|---------|---------
`device_id` | int | Device ID. This is a handle for future API commands related to this device.
`name` | string | Device name.
`gpgpu_type` | int | GPGPU type. 1 means CUDA, 2 means OpenCL.
`subvendor` | string | Subvendor id.
`devices[i]/details` | object | Device details.
`devices[i]/details/cuda_id` | int | Device CUDA ID.
`devices[i]/details/sm_major` | int |Device SM major version.
`devices[i]/details/sm_minor` | int | Device SM minor version.
`devices[i]/details/bus` | int | Device bus ID.
`devices[i]/details/sli` | boolean | `True` if SLI is enabled on device.
`uuid` | string | Unique identification of device. Use this to distinguish devices with same name in the system.
`gpu_temp` | int | GPU temperature in °C.
`gpu_load` | int | GPU core load in %.
`gpu_load_memctrl` | int | GPU memory controller load in %.
`gpu_power_mode` | int | Current GPU power mode.
`gpu_power_usage` | float | GPU power usage in Watts.
`gpu_power_limit_current` | float | Current GPU power limit in Watts.
`gpu_power_limit_min` | float | Minimal GPU power limit in Watts.
`gpu_power_limit_max` | float | Maximal GPU power limit in Watts.
`gpu_tdp_current` | float | Current GPU power limit in %.
`gpu_clock_core_max` | int | Maximal GPU core clock (non restricted by temperature or power throttling).
`gpu_clock_memory` | int | Maximal GPU core clock (non restricted by temperature or power throttling).
`gpu_fan_speed` | int | Current fan speed in %.
`gpu_fan_speed_rpm` | int | Current fan speed in RPMs.
`gpu_memory_free` | long | Free GPU memory in bytes.
`gpu_memory_used` | long | Used GPU memory in bytes.
`intensity` | int | Current GPU intensity mode.

Example usage:
```
{"id":1,"method":"device.get","params":["0"]}
```

Example response:
```
{
   "device_id":0,
   "name":"GeForce GTX 1080",
   "gpgpu_type":1,
   "subvendor":"10de",
   "details":{
      "cuda_id":0,
      "sm_major":6,
      "sm_minor":1,
      "bus_id":6,
      "sli": false
   },
   "uuid":"GPU-f23ae914-dcd8-f751-72da-e2852a2379c8",
   "gpu_temp":42,
   "gpu_load":80,
   "gpu_load_memctrl":66,
   "gpu_power_mode":-1,
   "gpu_power_usage":131.9720001220703,
   "gpu_power_limit_current":126.0,
   "gpu_power_limit_min":105.0,
   "gpu_power_limit_max":240.0,
   "gpu_tdp_current":60.0,
   "gpu_clock_core_max":2151,
   "gpu_clock_memory":5513,
   "gpu_fan_speed":40,
   "gpu_fan_speed_rpm":0,
   "gpu_memory_free": 3066073088,
   "gpu_memory_used": 155152384,
   "intensity": 1,
   "id":1,
   "error":null
}
```


# <a name="devices-get"></a> devices.get

Returns non-changing and changing details about available devices. See [device\.get](#device-get).

This method does not take in any parameter.

Response field | Type | Description
------|---------|---------
`devices` | array | Array of [device\.get](#device-get) responses. If system has no available GPGPU devices, this array is empty.

Example usage:
```
{"id":1,"method":"devices.get","params":[]}
```

Example response:
```
{
   "devices":[
      {
          "device_id":0,
          "name":"GeForce GTX 1080 Ti",
          "gpgpu_type":1,
          "subvendor":"10de",
          "details":{
             "cuda_id":0,
             "sm_major":6,
             "sm_minor":1,
             "bus_id":5,
             "sli": false
          },
          "uuid":"GPU-8f6552ba-76e8-4e86-c2bb-53b69fb685ef",
          "gpu_temp":28,
          "gpu_load":0,
          "gpu_load_memctrl":0,
          "gpu_power_mode":1,
          "gpu_power_usage":56.340999603271487,
          "gpu_power_limit_current":250.0,
          "gpu_power_limit_min":125.0,
          "gpu_power_limit_max":300.0,
          "gpu_tdp_current":100.0,
          "gpu_clock_core_max":1911,
          "gpu_clock_memory":5005,
          "gpu_fan_speed":23,
          "gpu_fan_speed_rpm":1036,
          "gpu_memory_free":10753101824,
          "gpu_memory_used":1058058240,
          "intensity": 1
      },
      {
          "device_id":1,
          "name":"GeForce GTX 1080",
          "gpgpu_type":1,
          "subvendor":"3842",
          "details":{
             "cuda_id":1,
             "sm_major":6,
             "sm_minor":1,
             "bus_id":7,
             "sli": false
          },
          "uuid":"GPU-c108e737-1a9a-2302-c878-402608fd4535",
          "gpu_temp":35,
          "gpu_load":0,
          "gpu_load_memctrl":0,
          "gpu_power_mode":-1,
          "gpu_power_usage":6.573999881744385,
          "gpu_power_limit_current":180.0,
          "gpu_power_limit_min":90.0,
          "gpu_power_limit_max":217.0,
          "gpu_tdp_current":100.0,
          "gpu_clock_core_max":2012,
          "gpu_clock_memory":4513,
          "gpu_fan_speed":0,
          "gpu_fan_speed_rpm":0,
          "gpu_memory_free":8471445504,
          "gpu_memory_used":118489088,
          "intensity": 1
      }
   ],
   "id":1,
   "error":null
}
```


# <a name="device-set-power-limit"></a> device.set.power_limit

Sets power limit for certain device. Provided power limit is in Watts and it has to be inside interval `gpu_power_limit_min` and `gpu_power_limit_max` provided by method [device\.get](#device-get).

Command parameter # | Type | Description
-------|---------|---------
1 | string | Device ID or Device UUID.
2 | string | New power limit in Watts.

Example usage:
```
{"id":1,"method":"device.set.power_limit","params":["0","150"]}
```

Example response:
```
{
  "id":1,
  "error":null
}
```



# <a name="device-set-tdp"></a> device.set.tdp

Similar as [device\.set\.power_limit](#device-set-power-limit), this method sets TDP in %. Provided TDP limit is in %. Setting TDP too high or too low may fail.

Command parameter # | Type | Description
-------|---------|---------
1 | string | Device ID or Device UUID.
2 | string | New TDP limit %.

Example usage:
```
{"id":1,"method":"device.set.tdp","params":["0","80"]}
```

Example response:
```
{
  "id":1,
  "error":null
}
```

# <a name="device-set-tdp-simple"></a> device.set.tdp.simple

Sets power mode for certain device.

Command parameter # | Type | Description
-------|---------|---------
1 | string | Device ID or Device UUID.
2 | string | Power mode (0, 1 or 2).

Power mode | Description | Remark
-------|---------|---------
0 | low | min TDP
1 | medium | (low + high) / 2
2 | high | 100% TDP

For example, if high is 100 and min is 60, then medium is (60 + 100) / 2 = 80

Example usage:
```
{"id":1,"method":"device.set.tdp.simple","params":["0","1"]}
```

Example response:
```
{
  "id":1,
  "error":null
}
```

# <a name="device-set-core-delta"></a> device.set.core_delta

Sets delta of max core clock of GPU. Provided clock delta is in MHz. Note that this clock is not achieved if GPU is TDP limited.

Command parameter # | Type | Description
-------|---------|---------
1 | string | Device ID or Device UUID.
2 | string | Clock delta in MHz.

Example usage:
```
{"id":1,"method":"device.set.core_delta","params":["0","250"]}
```

Example response:
```
{
  "id":1,
  "error":null
}
```


# <a name="device-set-memory-delta"></a> device.set.memory_delta

Sets delta of max memory clock of GPU. Provided clock delta is in MHz.

Command parameter # | Type | Description
-------|---------|---------
1 | string | Device ID or Device UUID.
2 | string | Clock delta in MHz.

Example usage:
```
{"id":1,"method":"device.set.memory_delta","params":["0","-300"]}
```

Example response:
```
{
  "id":1,
  "error":null
}
```


# <a name="device-set-fan-speed"></a> device.set.fan.speed

Sets fan speed of device. Provided fan speed is in %.

Command parameter # | Type | Description
-------|---------|---------
1 | string | Device ID or Device UUID.
2 | string | Fan speed in % (from 0 to 100).

Example usage:
```
{"id":1,"method":"device.set.fan.speed","params":["0","60"]}
```

Example response:
```
{
  "id":1,
  "error":null
}
```


# <a name="device-set-fan-reset"></a> device.set.fan.reset

Resets fan speed to factory's default.

Command parameter # | Type | Description
-------|---------|---------
1 | string | Device ID or Device UUID.


Example usage:
```
{"id":1,"method":"device.set.fan.reset","params":["0"]}
```

Example response:
```
{
  "id":1,
  "error":null
}
```


# <a name="algorithm-add"></a> algorithm.add

Adds new algorithm instance to the miner. Requests the remote pool to start sending work for the algorithm at hand.

Command parameter # | Type | Description
-------|---------|---------
1 | string | Algorithm name (see list of supported algorithms for [NVIDIA](https://github.com/nicehash/excavator/tree/master/nvidia).

_REMARKS_:
- If algorithm name is prefixed with `"benchmark-"` prefix, then no connection to the remote pool is established, but rather benchmark dummy job is used for serving mining work.
- For dual mining both algorithms have to be added.


Example usage:
```
{"id":1,"method":"algorithm.add","params":["daggerhashimoto"]}
```

Example usage 2 (benchmark):
```
{"id":1,"method":"algorithm.add","params":["benchmark-daggerhashimoto"]}
```

Example response:
```
{
   "id":1,
   "error":null
}
```



# <a name="algorithm-remove"></a> algorithm.remove

Removes algorithm. Note that this method stops all workers that are linked to that particular algorithm but it *does not* free them. You should explicitly call [worker\.free](#worker-free) or [worker\.clear](#worker-clear) to free also the workers.

Command parameter # | Type | Description
-------|---------|---------
1 | string | Algorithm name.

This method returns no response fields. If error occured, field `error` is not `null` and contains error message of type `string`.

Example usage:
```
{"id":1,"method":"algorithm.remove","params":["daggerhashimoto"]}
```

Example response:
```
{
   "id":1,
   "error":null
}
```

# <a name="algorithm-clear"></a> algorithm.clear

Removes all algorithms. See [algorithm\.remove](#algorithm-remove).

This method does not take in any parameter.

This method returns no response fields. If error occured, field `error` is not `null` and contains error message of type `string`.

Example usage:
```
{"id":1,"method":"algorithm.clear","params":[]}
```

Example response:
```
{
   "id":1,
   "error":null
}
```

# <a name="algorithm-list"></a> algorithm.list

List all currently running algorithms.

This method does not take in any parameter.

Response field | Type | Description
------|---------|---------
`algorithms` | array | Array of algorithms. If no algorithms, this array is empty.
`algorithms[i]/algorithm_id` | int | Algorithm ID.
`algorithms[i]/name` | string | Algorithm name.
`algorithms[i]/speed` | float | Speed in hashes per second.
`algorithms[i]/uptime` | float | Uptime in seconds.
`algorithms[i]/benchmark` | boolean | `True` if benchmark.
`algorithms[i]/accepted_shares` | int | Total shares accepted by the remote pool.
`algorithms[i]/rejected_shares` | int | Total shares rejected by the remote pool.
`algorithms[i]/got_job` | boolean | `True` if remote pool provided valid job.
`algorithms[i]/received_jobs` | int | Number of jobs provided by the remote pool.
`algorithms[i]/current_job_difficulty` | float | Difficulty for current job.


Example usage:
```
{"id":1,"method":"algorithm.list","params":[]}
```

Example response:
```
{
   "algorithms": [
      {
         "algorithm_id": 20,
         "name": "daggerhashimoto",
         "speed": 9198932.692307692,
         "uptime": 19.18597412109375,
         "benchmark": false,
         "accepted_shares": 0,
         "rejected_shares": 0,
         "got_job": true,
         "received_jobs": 4,
         "current_job_difficulty": 0.5
      }
   ],
   "id": 1,
   "error": null
}
```


# <a name="algorithm-print-speeds"></a> algorithm.print.speeds

Prints total speed of all algorithms to console output.


Example usage:
```
{"id":1,"method":"algorithm.print.speeds","params":[]}
```

Example response:
```
{
  "id":1,
  "error":null
}
```


# <a name="worker-add"></a> worker.add

Creates a new worker by linking certain device with an algorithm.

Command parameter # | Type | Description
-------|---------|---------
1 | string | Algorithm name.
2 | string | Device ID or Device UUID.
3+ | string | _OPTIONAL_ Additional parameters. See details of supported algorithms for [NVIDIA](https://github.com/nicehash/excavator/tree/master/nvidia).

Response field | Type | Description
------|---------|---------
`worker_id` | int | Worker ID.

_REMARKS_:
- If algorithm name is prefixed with `"benchmark-"` prefix, then a benchmark dummy job will be used for measuring algorithm's performance on the particular device and no share will be sent to the remote pool. Note that the same algorithm (or a pair of algorithms in case of dual mining) with `"benchmark-"` prefix should be added using [algorithm\.add](#walgorithm-add) command to make the benchmark job available.

Example usage:
```
{"id":1,"method":"worker.add","params":["daggerhashimoto","0"]}
```

Example usage 2 (benchmarking):
```
{"id":1,"method":"worker.add","params":["benchmark-daggerhashimoto","0"]}
```

Example response:
```
{
   "worker_id":0,
   "id":1,
   "error":null
}
```


# <a name="worker-free"></a> worker.free

Unlinks device from algorithm for provided worker. Worker thread with CUDA context stays alive and is ready to be
occupied with next [worker\.add](#worker-add) call for that device. This call causes mining to stop on certain device.

Command parameter # | Type | Description
-------|---------|---------
2 | string | Worker ID.

This method returns no response fields. If error occured, field `error` is not `null` and contains error message of type `string`.

Example usage:
```
{"id":1,"method":"worker.free","params":["0"]}
```

Example response:
```
{
   "id":1,
   "error":null
}
```

# <a name="worker-clear"></a> worker.clear

Unlinks device from algorithm for all workers. Effectively the same as calling [worker\.free](#worker-free) for each worker.

This method does not take in any parameter.

This method returns no response fields. If error occured, field `error` is not `null` and contains error message of type `string`.

Example usage:
```
{"id":1,"method":"worker.clear","params":[]}
```

Example response:
```
{
   "id":1,
   "error":null
}
```

# <a name="worker-reset"></a> worker.reset

Resets logged speed of worker to 0.

Command parameter # | Type | Description
-------|---------|---------
2 | string | Worker ID.


Example usage:
```
{"id":1,"method":"worker.reset","params":["0"]}
```

Example response:
```
{
  "id":1,
  "error":null
}
```

# <a name="worker-reset-device"></a> worker.reset.device

Resets logged speed of worker on device to 0.

Command parameter # | Type | Description
-------|---------|---------
2 | string | Array of Device IDs or Device UUIDs.


Example usage:
```
{"id":1,"method":"worker.reset","params":["0","1"]}
```

Example response:
```
{
  "id":1,
  "status":
  [
      { "error":null },
      { "error":null }
  ]
}
```


# <a name="worker-list"></a> worker.list

Report speed for all workers.

This method does not take in any parameter.

Response field | Type | Description
------|---------|---------
`workers` | array | Array of workers. If no workers, this array is empty.
`workers[i]/device_id` | int | Device ID.
`workers[i]/device_uuid` | int | Device UUID.
`workers[i]/worker_id` | int | Worker ID.
`workers[i]/params` | array | Parameters which were used to start this worker (array of strings).
`workers[i]/algorithms` | array | Array of algorithms. Array can have zero, one or two elements.
`workers[i]/algorithms[i]/id` | string | Algorithm ID.
`workers[i]/algorithms[i]/name` | string | Algorithm name.
`workers[i]/algorithms[i]/speed` | float | Algorithm speed.

Example usage:
```
{"id":1,"method":"worker.list","params":[]}
```

Example response:
```
{
   "workers": [
      {
         "worker_id": 0,
         "device_id": 2,
         "device_uuid":"GPU-819ca3e1-09c1-6982-6d28-29701e685270",
         "params": [],
         "algorithms": [
            {
               "id": 20,
               "name": "daggerhashimoto",
               "speed": 8513547.199441634
            }
         ]
      }
   ],
   "id": 1,
   "error": null
}
```

# <a name="worker-speed"></a> worker.print.speed

Prints speed of worker to console output. Useful for benchmarking.

Command parameter # | Type | Description
-------|---------|---------
2 | string | Worker ID.


Example usage:
```
{"id":1,"method":"worker.print.speed","params":["0"]}
```

Example response:
```
{
  "id":1,
  "error":null
}
```

# <a name="worker-speeds"></a> worker.print.speeds

Prints speeds of all workers to console output. Useful for benchmarking.

Example usage:
```
{"id":1,"method":"worker.print.speeds","params":[]}
```

Example response:
```
{
  "id":1,
  "error":null
}
```


# <a name="workers-add"></a> workers.add

Creates multiple new workers. See [worker\.add](#worker-add).

Command parameter # | Type | Description
-------|---------|---------
1 | string | "alg-" + Algorithm Name.
2 | string | Device ID or Device UUID.
3+ | string | _OPTIONAL_ Additional parameters. See details of supported algorithms for [NVIDIA](https://github.com/nicehash/excavator/tree/master/nvidia).

This method returns array of [worker\.add](#worker-add) responses.


Example usage:
```
{"id":1,"method":"workers.add","params":["alg-daggerhashimoto","0","alg-daggerhashimoto","1"]}
```

Example response:
```
{
  "id":1,
  "status":
  [
    {
       "worker_id":0,
       "error":null
    }
    ,
    {
       "worker_id":1,
       "error":null
    }
  ]
}
```


# <a name="workers-free"></a> workers.free

Free multiple workers. See [worker\.free](#worker-free).

Command parameter # | Type | Description
-------|---------|---------
1 | string | Array of [worker\.free](#worker-free) input parameters.

This method returns array of [worker\.free](#worker-free) responses.

Example usage:
```
{"id":1,"method":"workers.free","params":["0","1"]}
```

Example response:
```
{
  "id":1,
  "status":
  [
      { "error":null },
      { "error":null }
  ]
}
```

# <a name="workers-reset"></a> workers.reset

Resets logged speed for multiple workers. See [worker\.reset](#worker-reset).

Command parameter # | Type | Description
-------|---------|---------
1 | string | Array of [worker\.reset](#worker-reset) input parameters.

This method returns array of [worker\.reset](#worker-reset) responses.

Example usage:
```
{"id":1,"method":"workers.reset","params":["0","1"]}
```

Example response:
```
{
  "id":1,
  "status":
  [
      { "error":null },
      { "error":null }
  ]
}
```

# <a name="miner-stop"></a> miner.stop

Stops mining without exiting excavator. Effectively the same as calling [algorithm\.clear](#algorithm-clear), [worker\.clear](#worker-clear) and [unsubscribe](#unsubscribe).

This method does not take in any parameter.

Example usage:
```
{"id":1,"method":"miner.stop","params":[]}
```

Example response:
```
{
   "id": 1,
   "error": null
}
```

# <a name="miner-alive"></a> miner.alive

Check if excavator is responsive.

This method does not take in any parameter.

Example usage:
```
{"id":1,"method":"miner.alive","params":[]}
```

Example response:
```
{
   "id": 1,
   "error": null
}
```


# <a name="state-set"></a> state.set

Set state of all GPU devices. This is an alternative method to calling [subscribe](#subscribe), [algorithm\.add](#algorithm-add), [algorithm\.remove](#algorithm-remove) and [worker\.add](#worker-add). Its main purpose is to make switching between different algorithms easier.

This method takes one parameter of param object type as input.

Param object:

Field name  | Type                    | Description
------------|-------------------------|------------
btc_address | string                  | Username and password (split with :)
stratum_url | string                  | Stratum URL (hostname with port)
devices     | array of device objects |

Device object:

Field name  | Type                    | Description
------------|-------------------------|------------
device_uuid | string                  | Universally unique identifier (UUID) of device
algorithm   | string                  | Algorithm name (see list of supported algorithms for [NVIDIA](https://github.com/nicehash/excavator/tree/master/nvidia))
params      | array of strings        | Algorithm (optional) parameters


Example usage:
```
{
   "id": 1,
   "method": "state.set",
   "params": {
      "btc_address": "34HKWdzLxWBduUfJE9JxaFhoXnfC6gmePG.test2:x",
      "stratum_url": "nhmp-ssl.usa.nicehash.com:443",
      "devices": [
         {
            "device_uuid": "GPU-fc05ecf6-b928-749b-5089-bcb77fc8db11",
            "algorithm": "daggerhashimoto",
            "params": [
               "B=9184",
               "TPB=128",
               "HPW=4",
               "S=1"
            ]
         }
      ]
   }
}
```

Example response:
```
{
   "devices": [
      {
         "device_uuid": "GPU-fc05ecf6-b928-749b-5089-bcb77fc8db11",
         "error": null
      }
   ],
   "id": 1,
   "error": null
}
```


# <a name="info"></a> info

Returns basic information about Excavator.

This method does not take in any parameter.

Response field | Type | Description
------|---------|---------
`version` | string | Version.
`build_platform` | string | Build platform.
`build_time` | string | Build time.
`build_number` | int | Build number.
`excavator_cuda_ver` | int | Returns the version of CUDA used in excavator.
`driver_cuda_ver` | int | Returns the latest version of CUDA supported by the driver.
`uptime` | long | Uptime in seconds.
`cpu_load` | double | CPU load in percentage.
`cpu_usage` | double | CPU usage in percentage.
`ram_load` | double | Used memory in percentage.
`ram_usage` | double | Used memory in MB.

_REMARK_:
`driver_cuda_ver` has to be grater than or equal to `excavator_cuda_ver`.

Example usage:
```
{"id":1,"method":"info","params":[]}
```

Example response:
```
{
"version": "1.3.7a_nvidia",
"build_platform": "Windows",
"build_time": "2017-11-17 13:26:36",
"build_number": 3456,
"excavator_cuda_version": 9010,
"driver_cuda_version": 10000,
"uptime": 5,
"cpu_load": 3.0168410822665095,
"cpu_usage": 0,
"ram_load": 42,
"ram_usage": 167.91796875,
"id": 1,
"error": null
}
```


# <a name="quit"></a> quit

Exits Excavator.

This method does not take in any parameter.

This method returns no response fields.

Example usage:
```
{"id":1,"method":"quit","params":[]}
```

Example response:
```
{
   "id":1,
   "error":null
}
```


# <a name="message"></a> message

Displays provided message in console output.

Command parameter # | Type | Description
-------|---------|---------
1 | string | Message.


Example usage:
```
{"id":1,"method":"message","params":["Test!"]}
```

Example response:
```
{
  "id":1,
  "error":null
}
```

# Changelog

* v0.2.0 (excavator v1.6.1c)
- Revamped API with a lot of changes for returned version of Excavator

* v0.1.9 (excavator v1.5.14a)
- Added `driver_cuda_ver` and `excavator_cuda_ver` fields to [info](#info) method.

* v0.1.8 (excavator v1.5.12a)
  - Added `sli` field to device details.
  - Changed handling with benchmark mode in [algorithm\.add](#algorithm-add), [worker\.add](#worker-add), [workers\.add](#workers-add) methods.

* v0.1.7 (excavator v1.5.10a)
  - Changed high power mode to 100% TDP in [device\.set\.power_limit](#device-set-power-limit) method.


* v0.1.6 (excavator v1.5.9a)
    - Added Device UUID option as input parameter for next methods:
    [device\.get](#device-get),
    [device\.set\.power_limit](#device-set-power-limit),
    [device\.set\.tdp](#device-set-tdp),
    [device\.set\.core_delta](#device-set-core-delta),
    [device\.set\.memory_delta](#device-set-memory-delta),
    [device\.set\.fan\.speed](#device-set-fan-speed),
    [device\.set\.fan\.reset](#device-set-fan-reset),
    [device\.set\.fan\.speed](#device-set-fan-speed),
    [worker\.add](#worker-add),
    [workers\.add](#workers-add).
    - Added [device\.set\.intensity](#device-set-intensity) method.
    - Added `intensity` field to [device\.get](#device-get) and [devices\.get](#devices-get) methods.
    - Added `devices[i]/uuid` field to [device\.list](#device-list) method.
    - Added `worker[i]/device_uuid` field to [worker\.list](#worker-list) method.
    - Added [worker\.reset\.device](#worker-reset-device) method.

* v0.1.5 (excavator v1.5.5a)
    - Added `devices[i]/gpu_memory_total` to [device\.list](#device-list) method.

* v0.1.4 (excavator v1.5.4a)
    - Renamed device\.set\.power_mode method to [device\.set\.tdp\.simple](#device-set-tdp-simple).
    - Added [state\.set](#state-set) method.

* v0.1.3 (excavator v1.5.3a)
    - Added [miner\.alive](#miner-alive) method.
    - Added `devices[i]/display_mode` to [device\.list](#device-list) method.
    - Added `device\.set\.power_mode` method.
    - Added `devices[i]/gpu_power_mode` to [device\.get](#device-get) and [devices\.get](#devices-get) methods.

* v0.1.2 (excavator v1.5.2a)
    - Changed response fields of the [subscribe\.info](#subscribe-info) method.

* v0.1.1 (excavator v1.5.1a)
    - Added [devices\.get](#devices-get) method.

* v0.1.0 (excavator v1.5.0a)
    - Added [subscribe](#subscribe), [subscribe\.info](#subscribe-info) and [unsubscribe](#unsubscribe) methods.
    - Changed [algorithm\.add](#algorithm-add) and [algorithm\.remove](#algorithm-remove) input parameters.
    - Changed response of the [algorithm\.list](#algorithm-list) method.
    - Added [workers\.reset](#workers-reset), [worker\.list](#worker-list), [worker\.print\.speeds](#worker-speeds) and [worker\.clear](#worker-clear) methods.
    - Added [miner\.stop](#miner-stop) method.


* v0.0.3 (excavator v1.4.3a)
    - Added `devices[i]/subvendor` to [device\.list](#device-list) method.


* v0.0.2 (excavator v1.3.7a)
    - Added [algorithm\.clear](#algorithm-clear), [workers\.free](#workers-free) and [workers\.add](#workers-add) methods.


* v0.0.1 (excavator v1.3.6a)
    - Initial version.
