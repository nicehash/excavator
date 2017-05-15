This version of excavator has initial support for OpenCL devices,
including the AMD Radeon series graphics cards. This is still work in
progress and mostly optimized for RX 470/480/570/580 for now. 
The following algorithms are currently supported:

    Equihash
    Pascal

For optimal performance, please use AMD graphics cards with 
the GCN2 architecture or above. Excavator has been tested against 
AMD Crimson Software 16.9.2 on Windows 10 64-bit.


For Equihash-based coins, such as Zcash, you also need to run 
the miner as administrator as excavator needs to access the graphics 
card directly. Furthermore, driver signature enforcement needs to be 
disabled on Windows 10 for the time being. You can deactivate
it either at startup or by running the following .bat file:

    turn-driver-signature-enforcement-off.bat

Please note that you need administrator privileges to do so and 
a restart is required after executing the .bat file. This 
requirement will be removed for the next stable version.


If you have any questions/concerns/feedback, please feel free
to post them to:

    excavator by NiceHash
    https://bitcointalk.org/index.php?topic=1777827

Alternatively, you can directly email the author at:

    zawawawawawawawawa@gmail.com

It is my hope that excavator would be useful for everybody with
top-notch performance, solid reliability, and exceptional flexibility.
Enjoy!


zawawa