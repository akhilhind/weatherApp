const key = 'eadd5c5b59da851a0eafd6c82d9285cf';
const weatherkey = 'L9XJUN8T9E35';
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function gtz(data) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `http://api.timezonedb.com/v2.1/get-time-zone?key=${weatherkey}&format=json&by=position&lat=${data.coord.lat}&lng=${data.coord.lon}}`,
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                resolve(data);
            },
            error: function (data) {
                reject(data);
            }
        })
    })
}

function caps(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatAMPM(data) {
    var date = new Date();
    var hours = date.getHours();
    var minutes = "" + date.getMinutes();
    var seconds = "" + date.getSeconds();
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    console.log(formattedTime);
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

$(document).ready(function () {
    console.log("done");
    $('#search').on("keyup", function () {
        $('#result').show();
        $('#result').html('');
        var s = $('#search').val();
        if (s === "") {
            $('#result').html('');
            return;
        }
        var exp = new RegExp(s, "i");
        // console.log(exp);
        $.getJSON('/node_modules/cities.json/cities.json', function (data) {
            $.each(data, function (index, obj) {
                if (obj.city.search(exp) != -1) {
                    // console.log("value: " + obj.city);
                    $('#result').append('<li name=' + obj.city + '>' + obj.city + '</li>');
                    c++;
                }
            })
            if (c == 0) {
                $('#result').append('<p>City does not exists!</p>');
            }
        })
    })
})

$(document).on("click", "li", function () {
    // console.log($(this).attr('name'));
    let cityName = $(this).attr('name');
    let d = new Date();
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}`,
        type: "GET",
        dataType: "jsonp",
        success: function (data) {
            console.log(data);
            let wea = caps(data.weather[0].description);
            let min = (data.main.temp_min - 273.15).toFixed(0);
            let max = (data.main.temp_max - 273.15).toFixed(0);
            let curt = (data.main.temp - 273.15).toFixed(0);
            console.log(min);
            gtz(data).then((data) => {
                console.log(data);
                let cur = formatAMPM(data.formatted);
                let el = `<div class="card">
                            <p class="cname">${cityName}
                            <p class="dt">${days[d.getDay()]}, ${cur}</p> 
                            <p class="wea">${wea}</p>
                            <div class="two">
                                <p class="left">${curt}°C</p>
                                <p class="minmax">Min:${min}°C Max:${max}°C</p>
                            </div>
                          </div>
                    `
                $('#screens').append(el);
            }).catch((error) => {
                console.log(error);
            })
            console.log(data);
        }
    })
    setTimeout(function () {
        $('#result').html('');
        // alert("Hello"); 
    }, 3000);
})

$(document).on("click", "#cl", function () {
    if (confirm('This will erase all the data!!! Continue?')) {
        $('#screens').html('');
    }
})

$(document).on("click", "body", function () {
    $('#result').html('');;
})

$(document).on("click", function () {
    $('#result').hide();
})
