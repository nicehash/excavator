# Excavator API

**WARNING! This document is not complete yet and is still being worked on. Also, during Excavator alpha versions, API may change so make sure you check this page always before updating to next alpha version!**

# Overview

API is based on TCP-JSON messaging system. Every input JSON message (command) has an output JSON message (response). All commands and response are terminated by newline character '\n'.

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

**Device related get and set methods**

Method | Description | Supported NVIDIA | Supported AMD | Developer notes
-------|-------------|-------------|----------------|------
[device\.list](#device-list) | Queries available devices - GPUs. | Yes | Yes |
[device\.get](#device-get) | Queries particular device - GPU. | Yes | Yes |
[device\.set\.power_limit](#device-set-power-limit) | Sets device power limit. | Yes | No | AMD pending
[device\.set\.tdp](#device-set-tdp) | Sets device TDP. | Yes | No | AMD pending
device.set.core_delta | Sets device core clock (delta +/-). | Yes | No | AMD pending
device.set.memory_delta | Sets device memory clock (delta +/-). | Yes | No | AMD pending
device.set.fan.speed | Sets device fan speed. | Yes | No | AMD pending
device.set.fan.reset | Resets device fan speed. | Yes | No | AMD pending

**Algorithm managing methods**

Method | Description 
-------|------------
[algorithm\.add](#algorithm-add) | Adds new algorithm.
algorithm.remove | Removes algorithm.
[algorithm\.list](#algorithm-list) | Lists all algorithms.
algorithm.print.speeds | Prints speed of all algorithms.

**Worker managing methods**

Method | Description 
-------|------------
worker.add | Adds new worker.
worker.free | Removes worker.
worker.reset | Resets worker's speed.
worker.print.speed | Prints speed of a worker.

**Miscellaneous methods**

Method | Description 
-------|------------
[info](#info) | Gets information about Excavator.
[quit](#quit) | Quits Excavator.


# <a name="device-list"></a> device.list

Returns list of available CUDA and OpenCL devices. Use this method to get list of available devices and their static (non-changing) details.

This method does not take in any parameter.

Response field | Type | Description
------|---------|---------
`devices` | array | Array of device objects. If system has no avaiable GPGPU devices, this array is empty.
`devices[i]/device_id` | int | Device ID. This is a handle for future API commands related to this device.
`devices[i]/name` | string | Device name.
`devices[i]/gpgpu_type` | int | GPGPU type. 1 means CUDA, 2 means OpenCL.
`devices[i]/details` | object | Device details. CUDA/OpenCL specific.
`devices[i]/details/cuda_id` | int | **CUDA ONLY** Device CUDA ID.
`devices[i]/details/sm_major` | int | **CUDA ONLY** Device SM major version.
`devices[i]/details/sm_minor` | int | **CUDA ONLY** Device SM minor version.
`devices[i]/details/bus` | int | **CUDA ONLY** Device bus ID.

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
         "name":"GeForce GTX 1060 6GB",
         "gpgpu_type":1,
         "details":{
            "cuda_id":1,
            "sm_major":6,
            "sm_minor":1,
            "bus_id":3
         }
      },
      {
         "device_id":1,
         "name":"GeForce GTX 1070",
         "gpgpu_type":1,
         "details":{
            "cuda_id":3,
            "sm_major":6,
            "sm_minor":1,
            "bus_id":5
         }
      },
      {
          "device_id":2,
          "name":"Ellesmere",
          "gpgpu_type":2,
          "details":{
          
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
1 | string | Device ID.

Response field | Type | Description
------|---------|---------
`device_id` | int | Device ID. This is a handle for future API commands related to this device.
`name` | string | Device name.
`gpgpu_type` | int | GPGPU type. 1 means CUDA, 2 means OpenCL.
`devices[i]/details` | object | Device details. CUDA/OpenCL specific.
`devices[i]/details/cuda_id` | int | **CUDA ONLY** Device CUDA ID.
`devices[i]/details/sm_major` | int | **CUDA ONLY** Device SM major version.
`devices[i]/details/sm_minor` | int | **CUDA ONLY** Device SM minor version.
`devices[i]/details/bus` | int | **CUDA ONLY** Device bus ID.
`uuid` | string | Unique identification of device. Use this to distinguish devices with same name in the system.
`gpu_temp` | int | GPU temperature in °C.
`gpu_load` | int | GPU core load in %.
`gpu_load_memctrl` | int | GPU memory controller load in %.
`gpu_power_usage` | float | GPU power usage in Watts.
`gpu_power_limit_current` | float | Current GPU power limit in Watts.
`gpu_power_limit_min` | float | Minimal GPU power limit in Watts.
`gpu_power_limit_max` | float | Maximal GPU power limit in Watts.
`gpu_tdp_current` | float | Current GPU power limit in %.
`gpu_clock_core_max` | int | Maximal GPU core clock (non restricted by temperature or power throttling).
`gpu_clock_memory` | int | Maximal GPU core clock (non restricted by temperature or power throttling).
`gpu_fan_speed` | int | Current fan speed in %.
`gpu_fan_speed_rpm` | int | Current fan speed in RPMs.

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
   "details":{
      "cuda_id":0,
      "sm_major":6,
      "sm_minor":1,
      "bus_id":6
   },
   "uuid":"GPU-f23ae914-dcd8-f751-72da-e2852a2379c8",
   "gpu_temp":42,
   "gpu_load":80,
   "gpu_load_memctrl":66,
   "gpu_power_usage":131.9720001220703,
   "gpu_power_limit_current":126.0,
   "gpu_power_limit_min":105.0,
   "gpu_power_limit_max":240.0,
   "gpu_tdp_current":60.0,
   "gpu_clock_core_max":2151,
   "gpu_clock_memory":5513,
   "gpu_fan_speed":40,
   "gpu_fan_speed_rpm":0,
   "id":1,
   "error":null
}
```


# <a name="device-set-power-limit"></a> device.set.power_limit

Sets power limit for certain device. Provided power limit is in Watts and it has to be be inside interval `gpu_power_limit_min` and `gpu_power_limit_min` provided by method [device\.get](#device-get).

Command parameter # | Type | Description
-------|---------|---------
1 | string | Device ID.
2 | string | New power limit in Watts.

Example usage:
```
{"id":1,"method":"device.set.power_limit","params":["0","150"]}
```

Example response:
```
{"id":1,"error":null}
```


# <a name="device-set-tdp"></a> device.set.tdp

Similar as [device\.set\.power_limit](#device-set-power-limit), this method sets TDP in %. Provided TDP limit is in %. Setting TDP too high or too low may fail.

Command parameter # | Type | Description
-------|---------|---------
1 | string | Device ID.
2 | string | New TDP limit %.

Example usage:
```
{"id":1,"method":"device.set.tdp","params":["0","80"]}
```

Example response:
```
{"id":1,"error":null}
```


# <a name="algorithm-add"></a> algorithm.add

Adds new algorithm instance to the miner. Establish connection with remote pool and starts receiving work. When creating device workers, use `algorithm_id` to attach worker to this algorithm.

Command parameter # | Type | Description
-------|---------|---------
1 | string | Algorithm name (see list of supported algorithms for [NVIDIA](/../nvidia) and [AMD](/../amd)).
2 | string | Stratum URL (hostname with port, without `stratum+tcp://` prefix).
3 | string | Username and password (split with `:`);

_REMARKS_ If provided parameter 2 is `"benchmark"` then no connection is established to the remote pool, but rather benchmark dummy job is used for serving mining work.

Response field | Type | Description
------|---------|---------
`algorithms` | array | Array of algorithms. If no algorithms, this array is empty.
`algorithms[i]/algorithm_id` | int | Algorithm ID.
`algorithms[i]/algorithm_id` | string | Algorithm name.
`algorithms[i]/connected` | boolean | `True` if connected to remote pool.
`algorithms[i]/got_job` | boolean | `True` if remote pool provided valid job.
`algorithms[i]/address` | string | Remote address of the pool.
`algorithms[i]/login` | string | Login to the pool.
`algorithms[i]/workers` | array | Array of workers.
`algorithms[i]/workers[k]/worker_id` | int | Worker ID.
`algorithms[i]/workers[k]/device_id` | int | Linked device ID.
`algorithms[i]/workers[k]/params` | array | Parameters which were used to start this worker (array of strings).
`algorithms[i]/workers[k]/speed` | float | Speed in hashes per second.

Example usage:
```
{"id":1,"method":"algorithm.add","params":["equihash","equihash.eu.nicehash.com:3357","34HKWdzLxWBduUfJE9JxaFhoXnfC6gmePG.test2:x"]}
```

Example response:
```
{
   "algorithm_id":0,
   "id":1,
   "error":null
}
```


# <a name="algorithm-list"></a> algorithm.list

List all currently running algorithms. Each algorithm has a list of workers. Each worker is assigned to certain device and has certain speed.

This method does not take in any parameter.

Response field | Type | Description
------|---------|---------
`algorithms` | array | Array of algorithms. If no algorithms, this array is empty.
`algorithms[i]/algorithm_id` | int | Algorithm ID.
`algorithms[i]/algorithm_id` | string | Algorithm name.
`algorithms[i]/connected` | boolean | `True` if connected to remote pool.
`algorithms[i]/got_job` | boolean | `True` if remote pool provided valid job.
`algorithms[i]/address` | string | Remote address of the pool.
`algorithms[i]/login` | string | Login to the pool.
`algorithms[i]/workers` | array | Array of workers.
`algorithms[i]/workers[k]/worker_id` | int | Worker ID.
`algorithms[i]/workers[k]/device_id` | int | Linked device ID.
`algorithms[i]/workers[k]/params` | array | Parameters which were used to start this worker (array of strings).
`algorithms[i]/workers[k]/speed` | float | Speed in hashes per second.

Example usage:
```
{"id":1,"method":"algorithm.list","params":[]}
```

Example response:
```
{
   "algorithms":[
      {
         "algorithm_id":0,
         "name":"equihash",
         "connected":true,
         "got_job":true,
         "address":"equihash.eu.nicehash.com:3357",
         "login":"34HKWdzLxWBduUfJE9JxaFhoXnfC6gmePG.test2:x",
         "workers":[
            {
               "worker_id":0,
               "device_id":0,
               "params":[

               ],
               "speed":433.22
            },
            {
               "worker_id":1,
               "device_id":1,
               "params":[

               ],
               "speed":155.28
            },
            {
               "worker_id":2,
               "device_id":1,
               "params":[

               ],
               "speed":152.72
            }
         ]
      }
   ],
   "id":1,
   "error":null
}
```


# <a name="info"></a> info

Returns basic information about Execavator.

This method does not take in any parameter.

Response field | Type | Description
------|---------|---------
`version` | string | Version.
`build_platform` | string | Build platform.
`build_time` | string | Build time.
`build_number` | int | Build number.
`uptime` | long | Uptime in milliseconds.

Example usage:
```
{"id":1,"method":"info","params":[]}
```

Example response:
```
{  
   "version":"1.2.1a",
   "build_platform":"Windows",
   "build_time":"2017-05-18 13:39:44",
   "build_number":6,
   "uptime":21594,
   "id":1,
   "error":null
}
```


# <a name="quit"></a> quit

Exits Excavator.

This method does not take in any parameter.

This method returns no response fields.

Example usage:
```
{"id":1,"method":"info","params":[]}
```

Example response:
```
{  
   "id":1,
   "error":null
}
```
