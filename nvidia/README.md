# Available CUDA Algorithms in Excavator

Name | Supported devices | Wcount*1 | Pcount*2
-----------------|----------|---------|----
[daggerhashimoto](#daggerhashimoto)| NVIDIA SM 6.0+ | 1 | 4

*1 Recommended number of workers per device to reach optimal speeds.

*2 Number of supported parameters. Parameters are explained in details in section for each algorithm.

All CUDA algorithms support named parameters. Named parameters are of format NAME=VALUE; example:
> `... ["0","1","TPB=64","B=30"] ...`

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

# <a name="daggerhashimoto"></a> daggerhashimoto

Parameter # or name | Range | Explanation
-----------------|----------|---------
1 or `B` | 0-inf | Number of blocks
2 or `TPB` | 32-128 | Number of threads per block
3 or `S` | 1,2 | Number of streams
4 or `PH` | 2,4,8 | Number of parallel hashes

If no parameters are provided, device specific defaults are used. If provided parameter is '0' then device specific default value is used.

NOTE2: You can set epoch for benchmark as a second parameter when adding benchmark algorithm. Example to benchmark with epoch 400:

`{"id":1,"method":"algorithm.add","params":["benchmark-daggerhashimoto","400"]}`
