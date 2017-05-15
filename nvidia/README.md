# Available CUDA Algorithms in Excavator

Name | Supported devices | Wcount*1 | Pcount*2
-----------------|----------|---------|----
[equihash](#equihash) | NVIDIA SM 5.0+ | 2 | 0
[pascal](#pascal) | NVIDIA SM 5.0+ | 1 | 2
[decred](#decred)| NVIDIA SM 5.0+ | 1 | 3

*1 Recommended number of workers per device to reach optimal speeds.

*2 Number of supported parameters. Parameters are explained in details in section for each algorithm.


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

Parameter # | Range | Explanation
-----------------|----------|---------
1 | 0-inf | Number of blocks
2 | 0-1024 | Number of threads per block

If no parameters are provided, device specific defaults are used. If provided parameter is '0' then device specific default value is used.


# <a name="decred"></a> decred

Parameter # | Range | Explanation
-----------------|----------|---------
1 | 0-inf | Number of blocks
2 | 0-1024 | Number of threads per block
3 | 0-inf | Number of iterations per thread

If no parameters are provided, device specific defaults are used. If provided parameter is '0' then device specific default value is used.
