var url = "http://localhost:18000/";
var devices;
var devices_count = 0;
var refresh_time = 2000;
var updating_fans = false;
var first_time = true;
var devices_indices = new Array();
var log_lines = new Array();
var log_index = 0;
var MAX_LOG_SIZE = 200;


var find_best_oc_running = false;
var find_best_oc_device_id;


_tick();


function log_write(t, s)
{
    if (first_time) return;

    var d = new Date();
    var str = '<span class="log-class-' + t + '">[' + d.toLocaleString() + '] ';
    str += s + '</span><br />';
    log_lines[log_index] = str;
    var start = log_index;
    log_index = (log_index + 1) % MAX_LOG_SIZE;
    var end = log_index;

    // print whole log now
    var all = '';
    var i = 0;
    while (start !== end)
    {
        all += log_lines[start];
        if (start === 0) start = MAX_LOG_SIZE - 1;
        else --start;
    }

    $('#log-view-div').html(all);
}

function _tick()
{
    setTimeout(_tick, refresh_time + 137);
    updateAll();
}

function updateAll()
{
    $.ajax({
        url: url + "devices_cuda", 
        success: function( data ) {
        //console.log( data );

        if (data.error !== null)
        {
            log_write('error', 'Failed to get cuda devices');
            return;
        }

        devices = data.devices;

        devices_count = data.devices.length;
        if (first_time)
        {
            first_time = false;

            for (var i = 0; i < MAX_LOG_SIZE; ++i)
                log_lines[i] = '<br />';
            log_write('normal', 'Starting up...');

            // build table first time
            var disp_health = '';
            var disp = '';
            for (var i = 0; i < devices_count; ++i)
            {
                var k = devices[i].device_id;
                devices_indices[k] = i;
                disp += '<tr><td>' + k + '</td>';
                disp += '<td>' + devices[i].name + '</td>';
                disp += '<td id="device-' + k + '-kt-min"></td>';
                disp += '<td id="device-' + k + '-kt-avg"></td>';
                disp += '<td id="device-' + k + '-hwerr"></td>';
                disp += '<td id="device-' + k + '-hwok"></td>';

                disp += '<td id="device-' + k + '-oc-core"></td>';
                disp += '<td id="device-' + k + '-oc-mem"></td>';
                disp += '<td id="device-' + k + '-oc-pwr"></td>';
                disp += '<td id="device-' + k + '-oc-tdp"></td>';

                disp += '<td id="device-' + k + '-power"></td>';

                disp += '<td id="device-' + k + '-speed"></td>';
                disp += '<th id="device-' + k + '-eff"></th>';
                disp += '</tr>';

                $('#selected-device').append($('<option>', {
                    value: k,
                    text: k + '. ' + devices[i].name
                }));

                disp_health += '<tr><td>' + k + '</td>';
                disp_health += '<td>' + devices[i].name + '</td>';
                disp_health += '<td id="device-' + k + '-temp"></td>';
                disp_health += '<td id="device-' + k + '-fan-rpm"></td>';
                disp_health += '<td id="device-' + k + '-fan-perc"></td>';
            
                var min = 0;
                if (devices[i].fans.length > 0) min = devices[i].fans[0].min_level;
                disp_health += '<td><input type="range" min="' + min + '" max="100" value="50" class="slider" id="fan-level-' + k 
                    + '" onchange="set_fan(' + k + ')" /></td>';
                disp_health += '<td><button onclick="reset_fan(' + k + ')">Reset</button></td>';
                disp_health += '</tr>';

                        
            }
            $('#table-main-oc').html(disp);
            $('#table-main-health').html(disp_health);

            pre_oc_fill();
        }

        for (var i = 0; i < devices.length; ++i)
        {
            var dd = devices[i];
            var k = dd.device_id;
            $('#device-' + k + '-id').html(dd.device_id);
            $('#device-' + k + '-name').html(dd.name);
            $('#device-' + k + '-temp').html(dd.gpu_temp);
            if (dd.fans.length > 0)
            {
                var rpm_text = '';
                var level_text = '';
                for (var d = 0; d < dd.fans.length; ++d) 
                {
                    var fan = dd.fans[d];
                    if (d > 0)
                    {
                        rpm_text += '<br />';
                        level_text += '<br />';
                    }
                    rpm_text += fan.current_rpm;
                    level_text += fan.current_level;
                }
                $('#device-' + k + '-fan-rpm').html(rpm_text);
                $('#device-' + k + '-fan-perc').html(level_text);
                dd.gpu_fan_speed = dd.fans[0].current_level;
            }
            else
            {
                $('#device-' + k + '-fan-rpm').html(dd.gpu_fan_speed_rpm);
                $('#device-' + k + '-fan-perc').html(dd.gpu_fan_speed);
            }

            updating_fans = true;
            $('#fan-level-' + k).val(dd.gpu_fan_speed);
            updating_fans = false;

            if (dd.kernel_times.min > 0)
                $('#device-' + k + '-kt-min').html(dd.kernel_times.min);
            if (dd.kernel_times.avg > 0)
                $('#device-' + k + '-kt-avg').html(dd.kernel_times.avg);
            $('#device-' + k + '-hwerr').html(dd.hw_errors);
            $('#device-' + k + '-hwok').html(dd.hw_errors_success);
                    
            $('#device-' + k + '-oc-core').html(dd.oc_data.core_clock_delta);
            $('#device-' + k + '-oc-mem').html(dd.oc_data.memory_clock_delta);
            $('#device-' + k + '-oc-pwr').html(dd.oc_data.power_limit_watts);
            $('#device-' + k + '-oc-tdp').html(dd.oc_data.power_limit_tdp);

            $('#device-' + k + '-power').html(dd.gpu_power_usage.toFixed(2));
        }

        $.ajax({
            url: url + "workers", 
            success: function( data ) {
                if (data.error !== null) return;
                    
                for (var i = 0; i < data.workers.length; ++i)
                {
                    var dev_id = data.workers[i].device_id;
                    var speed = data.workers[i].algorithms[0].speed / 1000000;
                    devices[dev_id].speed = speed;
                    $('#device-' + dev_id + '-speed').html(speed.toFixed(2));
                    if (devices[dev_id].gpu_power_usage > 0)
                    {
                        devices[dev_id].eff = devices[dev_id].speed * 1000 / devices[dev_id].gpu_power_usage;
                        $('#device-' + dev_id + '-eff').html((devices[dev_id].eff).toFixed(2));
                    }
                }

                // update totals
                var t_speed = 0;
                var t_power = 0;
                for (var i = 0; i < devices_count; ++i)
                {
                    t_speed += devices[i].speed;
                    t_power += devices[i].gpu_power_usage;
                }

                $('#total-speed').html(t_speed.toFixed(2));
                $('#total-power').html(t_power.toFixed(2));
                if (t_power > 0)
                    $('#total-eff').html((t_speed * 1000 / t_power).toFixed(2));
            },
            error: function (data) {
                log_write('error', 'Cannot connect: /workers');
            }
        });
    },error: function () {
        log_write('error', 'Cannot connect: /cuda_devices');
    }});
}

function apply_oc()
{
    var dev_id = $('#selected-device').val();
    var core_delta = $('#selected-core').val();
    var memory_delta = $('#selected-memory').val();
    var power = $('#selected-power').val();

    log_write('normal', 'Applying OC, dev=' + dev_id + ' core=' + core_delta + ' mem=' + memory_delta + ' pwr=' + power);

    $.ajax({
        url: url + "setocprofile?id=" + dev_id + "&core=" + core_delta + "&memory=" + memory_delta + "&watts=" + power, 
        //indexValue: [dev_id, core_delta, memory_delta, power],
        success: function( data ) {
            if (data.error !== null)
            {
                // handle err case
            }
            else
            {
                log_write('normal', 'Applied OC successfully');
            }
        }
    });
}

function apply_oc_all()
{
    var core_delta = $('#selected-core').val();
    var memory_delta = $('#selected-memory').val();
    var power = $('#selected-power').val();

    log_write('normal', 'Applying OC for all devices; core=' + core_delta + ' mem=' + memory_delta + ' pwr=' + power);

    for (var i = 0; i < devices.length; ++i)
    {
        $.ajax({
            url: url + "setocprofile?id=" + devices[i].device_id + "&core=" + core_delta + "&memory=" + memory_delta + "&watts=" + power, 
            indexValue: devices[i].device_id,
            success: function( data, indexValue ) {
                if (data.error !== null)
                {
                    // handle err case
                }
                else
                {
                    log_write('normal', 'Applied OC successfully for device #' + this.indexValue);
                }
            }
        });
    }
}

function reset_oc()
{
    var dev_id = $('#selected-device').val();

    log_write('normal', 'Resetting OC, dev=' + dev_id);

    $.ajax({
        url: url + "resetoc?id=" + dev_id,
        success: function( data ) {
            if (data.error !== null)
            {
                // handle err case
            }
            else
            {
                log_write('normal', 'Reset OC successfully');
            }
        }
    });
}


function reset_oc_all()
{
    log_write('normal', 'Resetting OC for all devices');

    for (var i = 0; i < devices.length; ++i)
    {
        $.ajax({
            url: url + "resetoc?id=" + devices[i].device_id,
            indexValue: devices[i].device_id,
            success: function( data, indexValue ) {
                if (data.error !== null)
                {
                    // handle err case
                }
                else
                {
                    log_write('normal', 'Reset OC successfully for device #' + this.indexValue);
                }
            }
        });
    }
}


function change_core_clock(clk)
{
    $('#selected-core').val(parseInt($('#selected-core').val()) + clk);
}
        
function change_mem_clock(clk)
{
    $('#selected-memory').val(parseInt($('#selected-memory').val()) + clk);
}

function change_power(pwr)
{
    $('#selected-power').val(parseInt($('#selected-power').val()) + pwr);
}

function refresh_change()
{
    var secs = $('#refresh-time').val();
    //console.log(secs);
    $('#refresh-time-text').html(secs);
    refresh_time = parseInt(secs * 1000);
}

function pre_oc_fill()
{
    var dev_id = $('#selected-device').val();
    var device_ocs = devices[dev_id].oc_data;
    $('#selected-core').val(device_ocs.core_clock_delta);
    $('#selected-memory').val(device_ocs.memory_clock_delta);
    $('#selected-power').val(device_ocs.power_limit_watts);
}


// =========================================
// DEVICE HEALTH
// =========================================

function reset_fan(dev_id)
{
    $.ajax({
        url: url + "fanreset?id=" + dev_id,
        success: function( data ) {
            if (data.error !== null)
            {
                // handle err case
            }       
            else
            {
                updateAll();
            }
        }
    });
}


function set_fan(dev_id)
{
    if (updating_fans) return;

    var fan_level = $('#fan-level-' + dev_id).val();

    $.ajax({
        url: url + "fanset?id=" + dev_id + "&level=" + fan_level,
        success: function( data ) {
            if (data.error !== null)
            {
                // handle err case
            }
            else
            {
                updateAll();
            }
        }
    });
}


function set_fan_all(level)
{
    if (updating_fans) return;

    var fan_level = $('#fan-speed-all').val();

    for (var i = 0; i < devices.length; ++i)
    {
        $.ajax({
            url: url + "fanset?id=" + devices[i].device_id + "&level=" + fan_level,
            indexValue: devices[i].device_id,
            fanLevel: fan_level,
            success: function( data, indexValue, fanLevel ) {
                if (data.error !== null)
                {
                    // handle err case
                }
                else
                {
                    log_write('normal', 'Fan for device #' + this.indexValue + ' set to ' + this.fanLevel + '%');
                }
            }
        });
    }
}


// =========================================
// OC SCANNER
// =========================================
var core_inc = 25;
var best_kt_avg;
var STARTING_CORE_CLOCK_DELTA = -1000;
var current_core_clock;
var current_tdp;
var current_kt_avg;
var device_index;
var KT_THRESHOLD = 0.0005;
var stable_tdp;
var stable_core;
var stable_kt_avg;
var MIN_ACCEPTED_SHARES = 2;
var MAX_CORE_CLOCK_DELTA = -100;
var request_to_end;
var three_kt_avg = new Array();

function fboc_call(_url, _action)
{
    if (request_to_end)
    {
        find_best_oc_error('Cancelled by user');
        return;
    }

    $.ajax({
        url: url + _url, 
        success: function( data ) {
            if (data.error !== null)
            {
                find_best_oc_error(data.error);
            }
            else
            {
                _action(data);
            }
        },
        error: function( data ) {
            find_best_oc_error(data);
        }
    });
}


function fboc_core(_core, _action)
{
    // {"id":1,"method":"device.set.tdp","params":["0","150"]}
    var _url = 'api?command={"id":1,"method":"device.set.core_delta","params":["' + 
        find_best_oc_device_id + '","' + _core + '"]}';
    fboc_call(_url, function(data) { _action(data); });
}


function fboc_tdp(_tdp, _action)
{
    // {"id":1,"method":"device.set.tdp","params":["0","150"]}
    var _url = 'api?command={"id":1,"method":"device.set.tdp","params":["' + 
        find_best_oc_device_id + '","' + _tdp + '"]}';
    fboc_call(_url, function(data) { _action(data); });
}


function fboc_get_ktavg(_action)
{
    fboc_call('getkerneltimes?id=' + find_best_oc_device_id, 
    function(data) {
        _action(data.kernel_times.avg);
    });
}


function fboc_hw_reset(_action)
{
    fboc_call('hwerrreset?id=' + find_best_oc_device_id, 
        function(data) { _action(data); });
}


function fboc_hw_get(_action)
{
    fboc_call('hwerrget?id=' + find_best_oc_device_id, 
        function(data) { _action(data); });
}


function fboc_resetoc(_action)
{
    fboc_call("resetoc?id=" + find_best_oc_device_id, 
        function(data){ _action(data); });
}



function find_best_oc_cancel()
{
    request_to_end = true;
}


function find_best_oc()
{
    if (find_best_oc_running)
    {
        log_write('ocscanner', 'Find best OC already running');
        return; // already running
    }

    request_to_end = false;
    find_best_oc_running = true;
    find_best_oc_device_id = $('#selected-device').val();
    log_write('ocscanner', 'Starting up for device id=' + find_best_oc_device_id);

    device_index = devices_indices[find_best_oc_device_id];

    // 1. reset OC first
    log_write('ocscanner', '1. Reset OC');
    fboc_resetoc(function(data){ find_best_oc_step_2(); });
}


function find_best_oc_error(err)
{
    // reset OC to return everything back to normal
    //fboc_resetoc(function(data){ });
    $.ajax({url: url + "resetoc?id=" + find_best_oc_device_id});

    // report last stable OC found
    log_write('ocscanner', 'Best stable OC for selected mem. clock! Core delta=' + 
        stable_core + ' TDP=' + stable_tdp);

    // report error
    log_write('ocscanner', err);

    // release scanner
    find_best_oc_running = false;
}


function find_best_oc_step_2()
{
    // 2. set fan 100%
    log_write('ocscanner', '2. Set fan 100%');
    fboc_call("fanset?id=" + find_best_oc_device_id + "&level=100", function(data){ find_best_oc_step_3_4(); });
}


function find_best_oc_step_3_4()
{
    // 3. set core clock to -1000
    // 4. set mem clock to wished one

    var mem_delta = $('#selected-memory').val();
    var power = devices[device_index].gpu_power_limit_default;

    log_write('ocscanner', '3./4. Set core clock -1000, mem clock: ' + mem_delta + ', power: ' + power);

    fboc_call("setocprofile?id=" + find_best_oc_device_id + 
        "&core=" + STARTING_CORE_CLOCK_DELTA + "&memory=" + mem_delta + "&watts=" + power,
        function(data){ 
        // need to wait a bit for kt to fill
        setTimeout(find_best_oc_step_5, 2000); 
     });
}


function find_best_oc_step_5()
{
    // 5. increase core clock to find best kt.avg
    current_core_clock = STARTING_CORE_CLOCK_DELTA;
    log_write('ocscanner', '5. Reducing core clock to find best kt.avg');
    fboc_get_ktavg(function(data) {
        best_kt_avg = data;
        log_write('ocscanner', 'First best kt.avg: ' + best_kt_avg + ' @ ' + current_core_clock);
        find_best_oc_step_5_inc_core();
    });
}


function find_best_oc_step_5_inc_core()
{
    if (current_core_clock >= MAX_CORE_CLOCK_DELTA)
    {
        // we have reached the end, cannot increase more
        // just use last best kt avg
        find_best_oc_step_6();
        return
    }
    current_core_clock += core_inc;
    log_write('ocscanner', 'Setting core to: ' + current_core_clock);
    fboc_core(current_core_clock, function(data) {
        // wait 2 sec then measure kt.avg
        setTimeout(find_best_oc_step_5_mess_ktavg_1, 2000);
    });
}


function find_best_oc_step_5_mess_ktavg_1()
{
    fboc_get_ktavg(function(data) {
        three_kt_avg[0] = data;
        setTimeout(find_best_oc_step_5_mess_ktavg_2, 2000);
    });
}


function find_best_oc_step_5_mess_ktavg_2()
{
    fboc_get_ktavg(function(data) {
        three_kt_avg[1] = data;
        setTimeout(find_best_oc_step_5_mess_ktavg, 2000);
    });
}


function find_best_oc_step_5_mess_ktavg()
{
    fboc_get_ktavg(function(data) {
        three_kt_avg[2] = data;

        // select lowest kt.avg out of all 3
        var ktavg_lowest = three_kt_avg[0];
        if (three_kt_avg[1] < ktavg_lowest)
            ktavg_lowest = three_kt_avg[1];
        if (three_kt_avg[2] < ktavg_lowest)
            ktavg_lowest = three_kt_avg[2];

        // if kt.avg is lower, remember that and try lower clock
        if (ktavg_lowest < best_kt_avg)
        {
            best_kt_avg = ktavg_lowest;
            log_write('ocscanner', 'Current best kt.avg: ' + best_kt_avg + ' @ ' + current_core_clock);
            find_best_oc_step_5_inc_core();
        }
        else
        {
            // best kt avg found - it is previous clock, but this one will do too (it is probably very close)
            find_best_oc_step_6();
        }
    });
}


function find_best_oc_step_6()
{
    log_write('ocscanner', '6. Found best kt.avg: ' + best_kt_avg + ' @ ' + current_core_clock);

    // 6. set tdp to current consumption

    fboc_call('devices_cuda', function(data) {
        // calculate starting tdp according to current gpu power usage
        // and default 100% tdp power usage
        var current_power = data.devices[device_index].gpu_power_usage;
        var default_power = data.devices[device_index].gpu_power_limit_default;
        // 100 * cp / dp = tdp
        current_tdp = Math.ceil((100 * current_power) / default_power);

        // set this tdp
        fboc_tdp(current_tdp, function(data) {
            current_core_clock = STARTING_CORE_CLOCK_DELTA;
            fboc_core(current_core_clock, function(data) {
                setTimeout(find_best_oc_step_6b, 2000);
            });
        });
    });
}


function find_best_oc_set_stable()
{
    stable_tdp = current_tdp;
    stable_core = current_core_clock;
    stable_kt_avg = current_kt_avg;
    // cp = tdp * dp / 100;
    tdp_in_pwr = stable_tdp * devices[device_index].gpu_power_limit_default / 100;
    log_write('ocscanner', '=== Stable OC; TDP=' + stable_tdp + 
        '% (' + tdp_in_pwr.toFixed(0) + ' W), core=' + stable_core + ', kt.avg=' + stable_kt_avg);
}


function find_best_oc_step_6b()
{
    // measure starting kt.avg as best kt.avg
    fboc_get_ktavg(function(data) {
        //best_kt_avg = data;
        //current_kt_avg = best_kt_avg;
        current_kt_avg = data;
        find_best_oc_set_stable();
        find_best_oc_step_7();
    });
}


function find_best_oc_step_7()
{
    // 7. step down tdp
    current_tdp = current_tdp - 1;
    log_write('ocscanner', '7. Stepping down max power to: ' + current_tdp + '%');
    fboc_tdp(current_tdp, function(data) {
        log_write('ocscanner', '8. Finding best core clock');
        // now wait and measure kt.avg
        setTimeout(find_best_oc_step_8a, 2000);
    });
}


function find_best_oc_step_8a()
{
    fboc_get_ktavg(function(data) {
        three_kt_avg[0] = data;
        setTimeout(find_best_oc_step_8b, 2000);
    });
}


function find_best_oc_step_8b()
{
    fboc_get_ktavg(function(data) {
        three_kt_avg[1] = data;
        setTimeout(find_best_oc_step_8, 2000);
    });
}



function find_best_oc_step_8()
{
    fboc_get_ktavg(function(data){

        var lowest = data;
        if (three_kt_avg[0] < lowest)
            lowest = three_kt_avg[0];
        if (three_kt_avg[1] < lowest)
            lowest = three_kt_avg[1];

        if (lowest < 1)
        {
            // some error
            find_best_oc_error('error, kt.avg was < 1');
            return;
        }

        // if kt.avg is good enough, then go to testing stability of this tdp
        current_kt_avg = data;

        // if we find new best kt avg, save it
        if (current_kt_avg < best_kt_avg) best_kt_avg = current_kt_avg;

        var diff = current_kt_avg - best_kt_avg;
        if (Math.abs(diff) <= (best_kt_avg * KT_THRESHOLD))
        {
            // this is good enough, test stability now
            find_best_oc_stability_test();
        }
        else
        {
            // we need to increase core clock to get better performance
            log_write('ocscanner', 'kt.avg=' + current_kt_avg + ' @ ' + current_core_clock);
            if (current_core_clock >= MAX_CORE_CLOCK_DELTA)
            {
                find_best_oc_step_fin();
                return;
            }
            current_core_clock += core_inc;
            fboc_core(current_core_clock, function(data) {
                // wait 2 sec then measure kt.avg
                setTimeout(find_best_oc_step_8, 2000);
            });
        }
    });
}


function find_best_oc_stability_test()
{
    log_write('ocscanner', '8. Found good kt.avg=' + current_kt_avg + ' @ ' + current_core_clock);
    log_write('ocscanner', '9. Testing stability');

    // we need to get accepted shares for this device
    // reset hw err counter and start measuring
    fboc_hw_reset(function(data) {
        // measure every 2 seconds
        setTimeout(find_best_oc_stability_test_a, 2000);
    });
}


function find_best_oc_stability_test_a()
{
    fboc_hw_get(function(data) {
        
        if (data.hw_errors !== 0)
        {
            // woops, hw error, reset OC and report our findings
            find_best_oc_step_fin();
            return;
        }
        
        if (data.hw_errors_success >= MIN_ACCEPTED_SHARES)
        {
            // stability for this OC passed, save current configuration
            find_best_oc_set_stable();

            // now repeat by lowering tdp first
            find_best_oc_step_7();
            return;
        }

        // need further testing...
        // measure again after 2 seconds
        setTimeout(find_best_oc_stability_test_a, 2000);
    });
}


function find_best_oc_step_fin()
{
    find_best_oc_error('All done!');
}