# Excavator API

# Overview

API is based on TCP-JSON messaging system. Every input JSON message (command) has an output JSON message (response). All commands and response are terminated by newline character '\n'.

Each command has three mandatory fields:
Name | Type | Description
-----|------|-------------
id | int | Identification number for command.
method | string | Method name.
params | array of strings | Array of parameters. All parameters are always strings and transformed into other types by Excavator if needed.

Each response has two mandatory fields:
Name | Type | Description
-----|------|-----------
id | int | Identification number matching command number.
error | string | If error happened, this field contains string. If this field is null, no error happened and action was successful.

The response usually has more fields which depends on API method being executed.


# Methods

Device related get and set methods

Method | Supported NVIDIA | Supported AMD
-----------------------------------------
[device.list])(#device-list) | Yes | Yes
[device.get])(#device-get) | Yes | Yes


# <a name="device-list"></a> device.list

# <a name="device-get"></a> device.get