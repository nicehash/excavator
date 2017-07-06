# Available CUDA Algorithms in Excavator

Name | Supported devices | Wcount*1 | Pcount*2
-----------------|----------|---------|----
[equihash](#equihash) | NVIDIA SM 5.0+ | 2 | 0
[pascal](#pascal) | NVIDIA SM 5.0+ | 1 | 2
[decred](#decred)| NVIDIA SM 5.0+ | 1 | 3
[sia](#sia)| NVIDIA SM 5.0+ | 1 | 2
[lbry](#lbry)| NVIDIA SM 5.0+ | 1 | 3
[blake2s](#blake2s)| NVIDIA SM 5.0+ | 1 | 3
[daggerhashimoto](#daggerhashimoto)| NVIDIA SM 5.2+ | 1 | 4

*1 Recommended number of workers per device to reach optimal speeds.

*2 Number of supported parameters. Parameters are explained in details in section for each algorithm.

All CUDA algorithms support named parameters. Named parameters are of format NAME=VALUE; example:
> `... ["0","1","TPB=512","B=30"] ...`

When providing named parameters, order is not important. You can mix named and unnamed parameters. Named parameters are ignored in unnamed list.


# <a name="equihash"></a> equihash

Parameter # | Range | Explanation
-----------------|----------|---------

There are no parameters available for equihash. To manage intensity of this algorithm, we suggest you to run only one worker to reach low intensity and multiple (suggest 2) workers per device to reach optimal speed.

We suggest you to overclock memory and reduce power limit to reach better speeds and optimal speed-to-power ratio. A typical usage scenario is following:
1. Add new equihash algorithm with 'algorithm.add' method.
2. Link devices with equihash algorithm using 'worker.add' method.
3. Apply device specific overclocking and power limits.
4. Mine...
5. Reset device specific overclocking and power limits.
6. Unlink devices.
7. Remove equihash algorithm.

Step 3 after 2 and step 5 before 6 assures that the GPU never enters P0 state with overclocked memory which can cause crashes. This means that you can overclock memory higher.


# <a name="pascal"></a> pascal

Parameter # or name | Range | Explanation
-----------------|----------|---------
1 or `B` | 0-inf | Number of blocks
2 or `TPB` | 0-512 | Number of threads per block

If no parameters are provided, device specific defaults are used. If provided parameter is '0' then device specific default value is used.


# <a name="decred"></a> decred

Parameter # or name | Range | Explanation
-----------------|----------|---------
1 or `B` | 0-inf | Number of blocks
2 or `TPB` | 0-512 | Number of threads per block
3 or `NPT` | 0-inf | Number of iterations per thread

If no parameters are provided, device specific defaults are used. If provided parameter is '0' then device specific default value is used.


# <a name="sia"></a> sia

Parameter # or name | Range | Explanation
-----------------|----------|---------
1 or `B` | 0-inf | Number of blocks
2 or `TPB` | 0-512 | Number of threads per block

If no parameters are provided, device specific defaults are used. If provided parameter is '0' then device specific default value is used.

**WARNING: Sia is not tuned per card yet. You may reach higher speeds by experimenting with parameters.**


# <a name="lbry"></a> lbry

Parameter # or name | Range | Explanation
-----------------|----------|---------
1 or `B` | 0-inf | Number of blocks
2 or `TPB` | 0-768 | Number of threads per block
3 or `NPT` | 0-inf | Number of iterations per thread

If no parameters are provided, device specific defaults are used. If provided parameter is '0' then device specific default value is used.

**WARNING: Lbry is tuned for next cards: 1080 Ti, 1080, 1070 and 1060 6GB. You may reach higher speeds by experimenting with parameters when using a different card.**


# <a name="blake2s"></a> blake2s

Parameter # or name | Range | Explanation
-----------------|----------|---------
1 or `B` | 0-inf | Number of blocks
2 or `TPB` | 0-1024 | Number of threads per block
3 or `NPT` | 0-inf | Number of iterations per thread

If no parameters are provided, device specific defaults are used. If provided parameter is '0' then device specific default value is used.

**WARNING: Blake2s is tuned for next cards: 1080 Ti, 1080, 1070 and 1060 6GB. You may reach higher speeds by experimenting with parameters when using a different card.**

# <a name="daggerhashimoto"></a> daggerhashimoto

Parameter # or name | Range | Explanation
-----------------|----------|---------
1 or `B` | 0-inf | Number of blocks
2 or `TPB` | 0-512 | Number of threads per block
3 or `HPW` | 0-8 | Number of parallel hashes per warp
4 or `S` | 0-2 | Number of streams

If no parameters are provided, device specific defaults are used. If provided parameter is '0' then device specific default value is used.

**WARNING: Daggerhashimoto is tuned for next cards: 1080 Ti, 1080, 1070, 1060 6GB, 1060 3GB and 1050 Ti. You may reach higher speeds by experimenting with parameters when using a different card.**

NOTE1: If you use Windows 10 and your speed is very low, make sure you use Windows version 1607 or higher and latest NVIDIA drivers. When you use Maxwell cards for mining, also make sure you turn on `Optimize for compute performance` and set some value for `DSR-Factors` in NVIDIA control panel.

NOTE2: You can set epoch for benchmark as a third parameter when adding benchmark algorithm. Example to benchmark with epoch 150:

`{"id":1,"method":"algorithm.add","params":["daggerhashimoto","benchmark","150"]}`

NOTE3: Only EthereumStratum protocol is supported. This means daggerhashimoto may not work on all pools. Specifications of EthereumStratum can be found here: https://github.com/nicehash/Specifications
