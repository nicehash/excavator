# OpenCL Support in excavator

**Please read this document carefully, especially the [Hardware Acceleration](#hardwareacceleration) section, if you are mining Ethash- or Equihash-based coins.** 

This version of excavator has initial support for OpenCL devices,
including the AMD Radeon series graphics cards. This is still work in
progress and mostly optimized for RX 470/480/570/580 for now. 
If you have any questions/concerns/feedback, please feel free
to post them to:

* [excavator by NiceHash](https://bitcointalk.org/index.php?topic=1777827) (bitcointalk.org)

Alternatively, you can directly email the author at:

* [zawawawawawawawawa@gmail.com](mailto:zawawawawawawawawa@gmail.com)

It is my hope that excavator would be useful for everybody with
top-notch performance, solid reliability, and exceptional flexibility,
and I am grateful to NiceHash for giving me an opportunity to work on this miner.
Enjoy!

zawawa


## Prerequisites

Excavator *should* work with any OpenCL-compatible devices. For optimal performance,
however, please use AMD graphics cards with 
the GCN2 architecture or above.


## <a name="hardwareacceleration"></a> Hardware Acceleration

Excavator supports hardware acceleration for daggerhashimoto/Ethash- and Equihash-based 
coins, such as Ethereum and Zcash. In order to enable it, you need to **run 
the miner as administrator** as excavator needs to access the graphics 
card directly. Furthermore, **driver signature enforcement needs to be 
disabled** on Windows 10 for the time being. You can deactivate
it either at startup or by running the following .bat file:

    turn-driver-signature-enforcement-off.bat

Please note that you need administrator privileges to do so and 
a restart is required after executing the .bat file. The second 
requirement will be removed for the next stable version. Lastly, for the initial run,
it is very important to **reset the graphics card to stock settings.**

If everything goes well, you should see the following message:

    Loaded phymem for direct PCIe access.
    
Otherwise:

    Failed to load phymem.
    Please disable driver signature enforcement and run miner as administrator.


## Supported Algorithms

The following algorithms are currently supported:

Name | Supported devices | Wcount*1 | Pcount*2
-----------------|----------|---------|----
[daggerhashimoto](#daggerhashimoto) | GCN2+ | 1 | 2
[equihash](#equihash) | GCN2+ | 2 | 2
[pascal](#pascal) | GCN1+ | 4 | 3
[sia](#sia) | GCN1+ | 4 | 2
[decred](#decred) | GCN1+ | 4 | 4

If no parameters are provided, device specific defaults are used. If provided parameter is '0' then device specific default value is used.

*1 Recommended number of workers per device to reach optimal speeds.

*2 Number of supported parameters. Parameters are explained in details in section for each algorithm.


### <a name="daggerhashimoto"></a> daggerhashimoto

With daggerhashimoto/Ethash, excavator only supports NiceHash as a pool for now.

Parameter # | Range | Explanation
-----------------|----------|---------
1 | 0 or 1 | Disable/enable binary kernels
2 | 0-∞ | Global work size


### <a name="equihash"></a> equihash

Parameter # | Range | Explanation
-----------------|----------|---------
1 | 0 or 1 | Disable/enable binary kernels
2 | 0 or 1 | Disable/enable the Global Data Share (requires admin privileges)


## <a name="pascal"></a> pascal

Parameter # | Range | Explanation
-----------------|----------|---------
1 | 0-∞ | Global work size
2 | 0-256 | Local work size
3 | 0-∞ | Number of iterations


## <a name="sia"></a> sia

Parameter # | Range | Explanation
-----------------|----------|---------
1 | 0-∞ | Global work size
2 | 0-256 | Local work size


## <a name="decred"></a> decred

Parameter # | Range | Explanation
-----------------|----------|---------
1 | 0 or 1 | Disable/enable binary kernels
2 | 0-∞ | Global work size
3 | 0-256 | Local work size
4 | 0-∞ | Number of iterations
