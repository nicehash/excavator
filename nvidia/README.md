# Available CUDA Algorithms in Excavator

Name | Supported devices | Wcount*1 | Pcount*2 | Intensity*3
-----------------|----------|---------|----|----
[equihash](#equihash) | NVIDIA SM 5.0+ | 1/2 | 1 | 0
[pascal](#pascal) | NVIDIA SM 5.0+ | 1 | 2 | 0
[decred](#decred)| NVIDIA SM 5.0+ | 1 | 3 | 0
[blake2s](#blake2s)| NVIDIA SM 5.0+ | 1 | 3 | 1
[daggerhashimoto](#daggerhashimoto)| NVIDIA SM 5.2+ | 1 | 4 | 1
[lyra2rev2](#lyra2rev2)| NVIDIA SM 5.0+ | 1 | 1 | 1
[daggerhashimoto_decred](#daggerhashimoto_decred)| NVIDIA SM 5.2+ | 1 | 3 | 0
[daggerhashimoto_pascal](#daggerhashimoto_pascal)| NVIDIA SM 5.2+ | 1 | 3 | 0
[keccak](#keccak)| NVIDIA SM 5.0+ | 1 |3 | 1
[neoscrypt](#neoscrypt)| NVIDIA SM 5.0+ | 1 | 1 | 1
[cryptonightV7](#cryptonightV7)| NVIDIA SM 5.0+ | 1 |2 | 0
[lyra2z](#lyra2z)| NVIDIA SM 5.0+ | 1 | 1 | 1
[x16r](#x16r)| NVIDIA SM 5.0+ | 1 | 1 | 1

*1 Recommended number of workers per device to reach optimal speeds.

*2 Number of supported parameters. Parameters are explained in details in section for each algorithm.

*3 1 if running in low intensity is supported

All CUDA algorithms support named parameters. Named parameters are of format NAME=VALUE; example:
> `... ["0","1","TPB=512","B=30"] ...`

When providing named parameters, order is not important. You can mix named and unnamed parameters. Named parameters are ignored in unnamed list.

We suggest you to overclock memory and reduce power limit to reach better speeds and optimal speed-to-power ratio. A typical usage scenario is following:
1. Add new algorithm with 'algorithm.add' method.
2. Link devices with algorithm using 'worker.add' method.
3. Apply device specific overclocking and power limits.
4. Mine...
5. Reset device specific overclocking and power limits.
6. Unlink devices.
7. Remove algorithm.

Step 3 after 2 and step 5 before 6 assures that the GPU never enters P0 state with overclocked memory which can cause crashes. This means that you can overclock memory higher.

# <a name="equihash"></a> equihash

Parameter # or name | Range | Explanation
-----------------|----------|---------
1 or `M` | 0, 1 , 2 | Mode of algorithm

If no parameters are provided, device specific defaults are used (M=1). We suggest using two workers per device when running equihash with mode 0*, otherwise use one worker per device.   

\* To manage intensity of this algorithm, we suggest you to run only one worker to reach low intensity and multiple (suggest 2) workers per device to reach optimal speed.

**WARNING: Mode 1 is currently unstable on some Windows systems.**

# <a name="pascal"></a> pascal

Parameter # or name | Range | Explanation
-----------------|----------|---------
1 or `B` | 0-inf | Number of blocks
2 or `TPB` | 0-512 | Number of threads per block

If no parameters are provided, device specific defaults are used. If provided parameter is '0' then device specific default value is used.

**WARNING: Pascal is tuned for next cards: 1080 Ti, 1080, 1070 Ti, 1070, 1060 6GB, 1060 3GB, 1050 Ti, 1050, 1030, TITAN X, 980 Ti, 980, 970, 960, 950, P104-100, P106-100 and TITAN V. You may reach higher speeds by experimenting with parameters when using a different card.**

# <a name="decred"></a> decred

Parameter # or name | Range | Explanation
-----------------|----------|---------
1 or `B` | 0-inf | Number of blocks
2 or `TPB` | 0-512 | Number of threads per block
3 or `NPT` | 0-inf | Number of iterations per thread

If no parameters are provided, device specific defaults are used. If provided parameter is '0' then device specific default value is used.

**WARNING: Decred is tuned for next cards: 1080 Ti, 1080, 1070 Ti, 1070, 1060 6GB, 1060 3GB, 1050 Ti, 1050, 1030, TITAN X, 980 Ti, 980, 970, 960, 950, P104-100, P106-100 and TITAN V. You may reach higher speeds by experimenting with parameters when using a different card.**


# <a name="blake2s"></a> blake2s

Parameter # or name | Range | Explanation
-----------------|----------|---------
1 or `B` | 0-inf | Number of blocks
2 or `TPB` | 0-1024 | Number of threads per block
3 or `NPT` | 0-inf | Number of iterations per thread

If no parameters are provided, device specific defaults are used. If provided parameter is '0' then device specific default value is used.

**WARNING: Blake2s is tuned for next cards: 1080 Ti, 1080, 1070 Ti, 1070, 1060 6GB, 1060 3GB, 1050 Ti, 1050, 1030, TITAN X, 980 Ti, 980, 970, 960, 950, P104-100, P106-100 and TITAN V. You may reach higher speeds by experimenting with parameters when using a different card.**

# <a name="daggerhashimoto"></a> daggerhashimoto

Parameter # or name | Range | Explanation
-----------------|----------|---------
1 or `B` | 0-inf | Number of blocks
2 or `TPB` | 0-512 | Number of threads per block
3 or `HPW` | 0-8 | Number of parallel hashes per warp
4 or `S` | 0-2 | Number of streams

If no parameters are provided, device specific defaults are used. If provided parameter is '0' then device specific default value is used.

**WARNING: Daggerhashimoto is tuned for next cards: 1080 Ti, 1080, 1070 Ti, 1070, 1060 6GB, 1060 3GB, 1050 Ti, TITAN X, 980 Ti, 980, 970, P104-100, P106-100 and TITAN V. You may reach higher speeds by experimenting with parameters when using a different card.**

NOTE1: If you use Windows 10 and your speed is very low, make sure you use Windows version 1607 or higher and latest NVIDIA drivers. When you use Maxwell cards for mining, also make sure you turn on `Optimize for compute performance` and set some value for `DSR-Factors` in NVIDIA control panel.

NOTE2: You can set epoch for benchmark as a third parameter when adding benchmark algorithm. Example to benchmark with epoch 150:

`{"id":1,"method":"algorithm.add","params":["daggerhashimoto","benchmark","150"]}`

NOTE3: Only EthereumStratum protocol is supported. This means daggerhashimoto may not work on all pools. Specifications of EthereumStratum can be found here: https://github.com/nicehash/Specifications

# <a name="lyra2rev2"></a> lyra2rev2

Parameter # or name | Range | Explanation
-----------------|----------|---------
1 or `T` | 0-inf | Number of threads

If no parameters are provided, device specific defaults are used. If provided parameter is '0' then device specific default value is used.

**WARNING: Lyra2REv2 is tuned for next cards: 1080 Ti, 1080, 1070 Ti, 1070, 1060 6GB, 1060 3GB, 1050 Ti, 1050, 1030, TITAN X, 980 Ti, 980, 970, 960, 950, P104-100, P106-100 and TITAN V. You may reach higher speeds by experimenting with parameters when using a different card.**


# <a name="daggerhashimoto_decred"></a> daggerhashimoto_decred

Parameter # or name | Range | Explanation
-----------------|----------|---------
1 or `R_0` | 0-16 | Ratio of blocks used for daggerhashimoto\*
2 or `R_1` | 0-16 | Ratio of blocks used for decred\*
3 or `P` | 0-1 | Profitability of decred\*\*

\* The R_0:R_1 ratio adjusts how many blocks are used for each algorithm.

\*\* Set P to 0 or 1 based on current profitability of decred. If profitability of decred is low compared to profitability of daggerhashimoto set P to 0, otherwise to 1.

If no parameters are provided, device specific defaults are used. If provided parameter is '0' then device specific default value is used.

**WARNING: Daggerhashimoto_decred is tuned for next cards: 1080 Ti, 1080, 1070 Ti, 1070, 1060 6GB, 1060 3GB, 1050 Ti, 970, P104-100 and P106-100. You may reach higher speeds by experimenting with parameters when using a different card.**

NOTE1: Parameter P is used to select the most profitable default ratio values. If P is 0 the goal is to reach highest daggerhashimoto speed while retaining decent speed on decred. When P is 1 default ratio is set to reach highest combined speeds on both algorithms.

# <a name="daggerhashimoto_pascal"></a> daggerhashimoto_pascal

Parameter # or name | Range | Explanation
-----------------|----------|---------
1 or `R_0` | 0-16 | Ratio of blocks used for daggerhashimoto\*
2 or `R_1` | 0-16 | Ratio of blocks used for pascal\*
3 or `P` | 0-inf | Number of iterations per thread for pascal\*\*

\* The R_0:R_1 ratio adjusts how many blocks are used for each algorithm.

\*\* Set P to 0 or 1 based on current profitability of pascal. If profitability of pascal is low compared to profitability of daggerhashimoto set P to 0, otherwise to 1.

If no parameters are provided, device specific defaults are used. If provided parameter is '0' then device specific default value is used.

**WARNING: Daggerhashimoto_pascal is tuned for next cards: 1080 Ti, 1080, 1070 Ti, 1070 and P104-100. You may reach higher speeds by experimenting with parameters when using a different card.**

NOTE1: Parameter P is used to select the most profitable default ratio values. If P is 0 the goal is to reach highest daggerhashimoto speed while retaining decent speed on pascal. When P is 1 default ratio is set to reach highest combined speeds on both algorithms.

# <a name="keccak"></a> keccak

Parameter # or name | Range | Explanation
-----------------|----------|---------
1 or `B` | 0-inf | Number of blocks
2 or `TPB` | 0-256 | Number of threads per block
3 or `NPT` | 0-inf | Number of iterations per thread

If no parameters are provided, device specific defaults are used. If provided parameter is '0' then device specific default value is used.

**WARNING: Keccak is tuned for next cards: 1080 Ti, 1080, 1070 Ti, 1070, 1060 6GB, 1060 3GB, 1050 Ti, 1050, 1030, TITAN X, 980 Ti, 980, 970, 960, 950, P104-100, P106-100 and TITAN V. You may reach higher speeds by experimenting with parameters when using a different card.**

# <a name="neoscrypt"></a> neoscrypt

Parameter # or name | Range | Explanation
-----------------|----------|---------
1 or `B` | 0-inf | Number of blocks
2 or `M` | 1-5 | Mode of algorithm

If no parameters are provided, device specific defaults are used. If provided parameter is '0' then device specific default value is used. Different modes use different kernels (kernels performance varies per card).

**WARNING: NeoScrypt is tuned for next cards: 1080 Ti, 1080, 1070 Ti, 1070, 1060 6GB, 1060 3GB, 1050 Ti, 1050, 1030, P104-100, P106-100 and TITAN V. You may reach higher speeds by experimenting with parameters when using a different card.**

# <a name="cryptonightV7"></a> cryptonightV7

Parameter # or name | Range | Explanation
-----------------|----------|---------
1 or `B` | 0-inf | Number of blocks
2 or `TPB` | 0-1024 | Number of threads per block

If no parameters are provided or '0' is specified, the device specific default values will be used.

**WARNING: This algorithm is optimized for the following cards: 1080 Ti, 1080, 1070 Ti, 1070, 1060 6GB, 1060 3GB, 1050 Ti, 1050, 1030, TITAN X, 980 Ti, 980, 970, 960, 950 and TITAN V. You may reach higher speeds by experimenting with parameters when using a different card.**

# <a name="lyra2z"></a> lyra2z

Parameter # or name | Range | Explanation
-----------------|----------|---------
1 or `B` | 0-inf | Number of blocks

If no parameters are provided, device specific defaults are used. If provided parameter is '0' then device specific default value is used.

**WARNING: This algorithm is optimized for the following cards: 1080 Ti, 1080, 1070 Ti, 1070, 1060 6GB, 1060 3GB, 1050 Ti, 1050 and TITAN V. You may reach higher speeds by experimenting with parameters when using a different card.**


# <a name="x16r"></a> x16r

Parameter # or name | Range | Explanation
-----------------|----------|---------
1 or `B` | 0-inf | Number of blocks

If no parameters are provided, device specific defaults are used. If provided parameter is '0' then device specific default value is used.

**WARNING: You may reach higher speeds by experimenting with input parameters.**
