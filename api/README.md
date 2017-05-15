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

Device related get and set methods

Method | Description | Supported NVIDIA | Supported AMD
-------|-------------|-------------|----------------
[device\.list](#device-list) | Queries available devices - GPUs | Yes | Yes
[device\.get](#device-get) | Queries particular device - GPU | Yes | Yes


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
