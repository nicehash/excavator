#!/usr/bin/env python3

import socket
import json
import subprocess
import re
import argparse
import platform
import time
import datetime

if platform.system() == 'Windows':
    EXCAVATOR = 'excavator.exe'
    NVIDIASMI = r'C:\Program Files\NVIDIA Corporation\NVSMI\nvidia-smi.exe'
else:
    EXCAVATOR = 'excavator'
    NVIDIASMI = 'nvidia-smi'

# defaults
SERVER = 'eu.nicehash.com'
USER = '34HKWdzLxWBduUfJE9JxaFhoXnfC6gmePG.benchmark'

ports = {
    'blake2s':         3361,
    'cryptonight':     3355,
    'daggerhashimoto': 3353,
    'decred':          3354,
    'equihash':        3357,
    'lbry':            3356,
    'lyra2rev2':       3347,
    'neoscrypt':       3341,
    'nist5':           3340,
    'pascal':          3358,
    'sia':             3360,
    'keccak':          3338
}

algos = [
    'blake2s',
    'cryptonight',
    'daggerhashimoto',
    'decred',
    'equihash',
    'lbry',
    'lyra2rev2',
    'neoscrypt',
    'nist5',
    'pascal',
    'keccak',
    'sia',
    'daggerhashimoto_decred',
    'daggerhashimoto_pascal',
    'daggerhashimoto_sia',
]


class Communicator:
    def __init__(self, address):
        self.socket = socket.create_connection(address)
        self.buffer = bytearray()

    def send(self, data):
        self.socket.send(data)

    def receive(self):
        pos = self.buffer.find(b'\n')
        if pos != -1:
            response = self.buffer[:pos]
            self.buffer = self.buffer[pos+1:]
            return response
        else:
            b = self.socket.recv(4096)
            if len(b) == 0:
                return self.buffer
            else:
                self.buffer += b
                return self.receive()

    def close_and_shutdown(self):
        self.socket.shutdown(socket.SHUT_RDWR)
        self.socket.close()


class Excavator:
    def __init__(self, excavator_exe, verbose=False):
        self.excavator_exe = excavator_exe
        self.pid = None
        self.conn = None
        self.verbose = verbose

    def __rpc_call(self, request):
        try:
            self.conn.send((json.dumps(request) + '\n').encode('utf-8'))
            b = self.conn.receive()
            response = json.loads(b.decode('utf-8'))
        except json.decoder.JSONDecodeError:
            print(b.decode('utf-8'))
            raise

        if response['error'] is not None:
            print('Method {} failed: {}'.format(request['method'], response['error']))

        assert response['error'] is None
        return response

    def start(self, spawn=True):
        if spawn:
            #self.pid = subprocess.Popen([self.excavator_exe, '-d', '0'], bufsize=-1)
            self.pid = subprocess.Popen([self.excavator_exe], bufsize=-1,
                                         stdin=subprocess.DEVNULL,
                                         stdout=subprocess.DEVNULL,
                                         stderr=subprocess.DEVNULL)

            # Give some time to excavator to start listening on the socket
            time.sleep(1)

        # Establish connection to excavator process
        self.conn = Communicator(('127.0.0.1', 3456))


    def stop(self):
        doc = {'id': 1, 'method': 'quit', 'params': []}
        self.__rpc_call(doc)
        self.conn.close_and_shutdown()
        if self.pid is not None:
            self.pid.wait()


    def query_version(self):
        doc = self.__rpc_call({'id': 1, 'method': 'info', 'params': []})
        bn = doc["build_number"]
        if platform.system() == "Linux":
            bn = hex(bn if bn >= 0 else bn + (1<<32))[2:]

        return "{} | {} | {}".format(doc["version"], bn, doc["build_time"])


    def list_devices(self):
        doc = self.__rpc_call({'id': 1, 'method': 'device.list', 'params': []})
        ds = []
        for d in doc["devices"]:
            ds.append(d["name"])
        return ds


    def remove_algorithms(self):
        self.__rpc_call({"id":1,"method":"algorithm.clear","params":[]})


    def add_algorithm(self, algo, params):
        doc = self.__rpc_call({"id":1,"method":"algorithm.add","params":params})
        return doc["algorithm_id"]


    def add_worker(self, alg_id, dev, params):
        doc = self.__rpc_call({"id":1,"method":"worker.add","params":[str(alg_id), str(dev)] + params})
        return doc["worker_id"]


    def reset_worker(self, worker_id):
        self.__rpc_call({"id":1,"method":"worker.reset","params":[str(worker_id)]})


    def query_algorithm(self):
        doc = self.__rpc_call({"id":1,"method":"algorithm.list","params":[]})
        return doc


    def set_core_delta(self, dev, value):
        self.__rpc_call({"id":1,"method":"device.set.core_delta","params":[str(dev),str(value)]})


    def set_memory_delta(self, dev, value):
        self.__rpc_call({"id":1,"method":"device.set.memory_delta","params":[str(dev),str(value)]})


    def set_tdp(self, dev, value):
        self.__rpc_call({"id":1,"method":"device.set.tdp","params":[str(dev),str(value)]})


    def set_fan_speed(self, dev, value):
        self.__rpc_call({"id":1,"method":"device.set.fan.speed","params":[str(dev),str(value)]})


    def reset_fan_speed(self, dev):
        self.__rpc_call({"id":1,"method":"device.set.fan.reset","params":[str(dev)]})


    def query_device(self, dev):
        doc = self.__rpc_call({"id":1,"method":"device.get","params":[str(dev)]})
        return doc


    def run_benchmark(self, algo, devices, args):
        self.remove_algorithms()

        params = [algo[0]]
        if args.benchmark:
            for _ in algo[0].split('_'):
                params.extend(['benchmark', args.user])
        else:
            for a in algo[0].split('_'):
                params.extend(['{}.{}:{}'.format(a, args.server, ports[a]), args.user])

        alg_id = self.add_algorithm(algo, params)

        workers = []
        for dev in devices:
            workers.append(self.add_worker(alg_id, dev[0], algo[1:]))

        # TODO: overclocking parameters

        time.sleep(20)
        for i in workers:
            self.reset_worker(i)
        time.sleep(15)

        stats = [{
            "speed0": Statistics(),
            "speed1": Statistics(),
            "power_usage": Statistics(),
        } for _ in range(len(devices))]

        start = time.monotonic()
        while time.monotonic() < start + args.time:
            time.sleep(5)
            now = datetime.datetime.utcnow()

            doc_alg = self.query_algorithm()

            # [DateTime] DeviceId: Speed0 Speed1 PowerUsage CpuTemp DeviceId: ...
            if self.verbose:
                print("[{}]".format(now.strftime("%Y-%m-%d %H:%M:%S")), end="")

            for i, dev in enumerate(devices):
                doc_dev = self.query_device(dev[0])
                speed = get_speed_for_device(doc_alg, dev[0])

                stats[i]["speed0"].update(speed[0])
                stats[i]["speed1"].update(speed[1])
                stats[i]["power_usage"].update(doc_dev["gpu_power_usage"])

                if self.verbose:
                    print("{:2}: {:#.5g}{} {:#.5g}{} {:#.5g} {}".format(
                        dev[0],
                        *human_readable(speed[0]),
                        *human_readable(speed[1]),
                        doc_dev["gpu_power_usage"],
                        doc_dev["gpu_temp"],
                    ), end="")

            if self.verbose:
                print()

        # summary
        accepted, rejected = get_shares(doc_alg)
        print("Summary: {}".format(','.join(algo)))
        for i, dev in enumerate(devices):
            print("{}: speed = {:#.5g} {}H/s, {:#.5g} {}H/s, power usage = {:#.5g} W".format(
                dev[1],
                *human_readable(stats[i]["speed0"].mean()),
                *human_readable(stats[i]["speed1"].mean()),
                stats[i]["power_usage"].mean(),
            ))
        print("shares = {},{} accepted / {},{} rejected".format(
            accepted[0], accepted[1], rejected[0], rejected[1]))



class Statistics:
    def __init__(self):
        self.n = 0
        self.x = 0
        self.xx = 0


    def update(self, x):
        self.n += 1
        self.x += x
        self.xx += x*x


    def mean(self):
        mean = self.x / self.n
        return mean


    def stddev(self):
        mean = self.mean()
        stddev = math.sqrt(self.xx / self.n - mean * mean)
        return stddev


def get_speed_for_device(doc, device_id):
    speed = [0, 0]
    for a in doc["algorithms"]:
        for w in a["workers"]:
            if w["device_id"] == device_id:
                speed[0] += w["speed"][0]
                speed[1] += w["speed"][1]
    return speed


def get_shares(doc):
    accepted = [0, 0]
    rejected = [0, 0]

    for i in range(2):
        pool = doc["algorithms"][0]["pools"][i]
        if pool["connected"]:
            accepted[i] = pool["details"]["total_accepted"]
            rejected[i] = pool["details"]["total_rejected"]

    return accepted, rejected

def human_readable(value):
    TERA = 1000000000000
    GIGA = 1000000000
    MEGA = 1000000
    KILO = 1000

    if value >= TERA:
        return value / TERA, "T"
    elif value >= GIGA:
        return value / GIGA, "G"
    elif value >= MEGA:
        return value / MEGA, "M"
    elif value >= KILO:
        return value / KILO, "k"
    else:
        return value, ""


def query_driver_version():
    output = subprocess.check_output(NVIDIASMI, shell=True).decode('utf-8')
    version = re.search(r'Driver Version: ([.\d]+)\s', output).group(1)
    return version


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('-d', '--devices', type=int, nargs='+')
    parser.add_argument('-a', '--algos', type=str, nargs='+', default=algos)
    parser.add_argument('-t', '--time', type=int, default=300)
    parser.add_argument('-u', '--user', type=str, default=USER)
    parser.add_argument('-s', '--server', type=str, default=SERVER)
    parser.add_argument('-v', '--verbose', action='store_true', default=False)
    parser.add_argument('-b', '--benchmark', action='store_true', default=False)
    parser.add_argument('--excavator', type=str, default=EXCAVATOR)
    #parser.add_argument('--core', type=int, default=0)
    #parser.add_argument('--mem', type=int, default=0)
    #parser.add_argument('--tdp', type=int, default=100)
    args = parser.parse_args()

    print('Platform: {}'.format(platform.system()))
    print('Driver version: {}'.format(query_driver_version()))

    excavator = Excavator(args.excavator, args.verbose)
    excavator.start(spawn=True)

    print('Excavator version: {}'.format(excavator.query_version()))

    devices = excavator.list_devices()
    devices = [(i,v) for i, v in enumerate(devices)]

    if args.devices is not None:
        devices = [devices[i] for i in args.devices]

    print('Devices: {}'.format(', '.join('{}: {}'.format(k[0], k[1]) for k in devices)))

    try:
        for algo in args.algos:
            if args.verbose:
                print("\nAlgorithm: {}".format(algo))
            excavator.run_benchmark(algo.split(','), devices, args)
    except AssertionError as e:
        print(e)
    except KeyboardInterrupt:
        pass
    finally:
        excavator.stop()


if __name__ == "__main__":
    main()
