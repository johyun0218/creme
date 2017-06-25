var markersArray = [];
var isCalculate = false;
var geocoder = new google.maps.Geocoder();
var flightPlanCoordinates = [];
(function ($) {

    $.fn.directionmap = function (options) {
        var opts = $.extend({}, $.fn.directionmap.defaults, options);

        return this.each(function () {
            var map_ele_id = this;
            $.fn.directionmap.defaults = options;
            if (isCalculate) {
                createDirectionMap(map_ele_id, opts.locations, opts.distance_ele_id, opts.duration_ele_id, opts.direction_ele_id);
            } else {
                nomarlDirectionMap(map_ele_id, opts.locations, opts.distance_ele_id, opts.duration_ele_id, opts.direction_ele_id);
            }
        });
    };

    // Set up default values
    var defaultLocations = {
        "locations": []
    };

    $.fn.directionmap.defaults = {
        locations: defaultLocations,
        distance_ele_id: "distance",
        duration_ele_id: "duration",
        direction_ele_id: "directions",
        infowin: "N"
    }

    $.fn.directionmap.RemoveMap = function () {
        privateMarkerRemove();
    }

    // Main function code here (ref:google map api v3)
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer({
        suppressMarkers: true
    });
    var map;

    function createDirectionMap(map_ele_id, locations, distance_ele_id, duration_ele_id, direction_ele_id) {
        //console.log($.fn.directionmap.defaults['map_ele_id']);

        var mapOptions = {
            zoom: 6,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById("maps"), mapOptions);

        calcRoute(locations, distance_ele_id, duration_ele_id, direction_ele_id);
    }

    function nomarlDirectionMap(map_ele_id, locations, distance_ele_id, duration_ele_id, direction_ele_id) {
        //console.log($.fn.directionmap.defaults['map_ele_id']);

        var mapOptions = {
            zoom: 6,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById("maps"), mapOptions);
        normalMapBind(locations)
        //calcRoute(locations, distance_ele_id, duration_ele_id, direction_ele_id);
    }

    function normalMapBind(destinations) {
        //locations.destination[index].address = addr;
        var k = 0;
        for (i = 0; i < destinations.destination.length; i++) {
            var address = destinations.destination[i].address;
            var key = destinations.destination[i].key;
            var seq = destinations.destination[i].seq;
            findAddress(address, seq, key, destinations.destination.length);

        }
    }

    function findAddress(address, seq, key, totalLeng) {

        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                var img = "dest";
                if (seq == 1)
                    img = "origin";

                var Icon = "/resources/img/map/" + img + ".png";
                var marker = new google.maps.Marker({ map: map, icon: Icon, position: results[0].geometry.location });

                flightPlanCoordinates.push(results[0].geometry.location);

                var infoWindow = new google.maps.InfoWindow({
                    content: "<div class='infobox'>" + $("#infobox").html() + "</div>",
                    position: marker.getPosition()
                });

                google.maps.event.addListener(marker, 'click', function () {
                    return $.ajax({
                        type: "GET",
                        url: "InfoBox.aspx",
                        data: {
                            'id': key
                        },
                        success: function (data) {
                            var datai = "<div class='infobox'>" + data + "</div>"
                            infoWindow.setContent(datai);
                            infoWindow.open(map, marker);
                        }
                    });
                });

                if (totalLeng == seq) {

                    DrawingPolyLine(flightPlanCoordinates);
                }
            }
        });
    }

    function DrawingPolyLine(flightPlanCoordinates) {
        var lineSymbol = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
        };
        var flightPath = new google.maps.Polyline({
            path: flightPlanCoordinates,
            geodesic: true,
            strokeColor: '#000000',
            icons: [{
                icon: lineSymbol,
                offset: '100%'
            }],
            strokeOpacity: 1.0,
            strokeWeight: 1
        });
        flightPath.setMap(map);
    }

    function privateMarkerRemove() {
        Destination = [];
        for (var i = 0; i < markersArray.length; i++) {
            markersArray[i].setMap(null);
        }
        markersArray.length = 0;
        directionsDisplay.setMap(null);
    }

    function publicMarkerRemove() {
        for (var i = 0; i < markersArray.length; i++) {
            markersArray[i].setMap(null);
        }
        markersArray.length = 0;
        directionsDisplay.setMap(null);
    }

    function privateMarkerAdd(locations, latlng, addr, index) {

        locations.destination[index].address = addr;
        var Icon = "";

        //이미지 의 종류는 다음과 같다.
        /*
            1. start , 2 pickup 전 , 3 pickup 후, 4 , delivery 전 5. delivery 후.
        */

        /* if (locations.destination[index].isIconType == "1") {
             Icon = "/Delivery/1.png";
         } else if (locations.destination[index].isIconType == "2") {
             Icon = "/Delivery/2.png";
         } else if (locations.destination[index].isIconType == "3") {
             Icon = "/Delivery/3.png";
         } else if (locations.destination[index].isIconType == "4") {
             Icon = "/Delivery/4.png";
         } else if (locations.destination[index].isIconType == "5") {
             Icon = "/Delivery/5.png";
         }
         */
        var img = "dest";
        if (locations.destination[index].seq == 1)
            img = "origin";

        var Icon = "/resources/img/map/" + img + ".png";
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: Icon
        });

        if ($.fn.directionmap.defaults.infowin == "Y") {

            var infoWindow = new google.maps.InfoWindow({
                content: "<div class='infobox'>" + $("#infobox").html() + "</div>",
                position: marker.getPosition()
            });

            google.maps.event.addListener(marker, 'click', function () {
                return $.ajax({
                    type: "GET",
                    url: "InfoBox.aspx",
                    data: {
                        'id': locations.destination[index].key
                    },
                    success: function (data) {
                        var datai = "<div class='infobox'>" + data + "</div>"
                        infoWindow.setContent(datai);
                        infoWindow.open(map, marker);
                    }
                });
            });
        }
        markersArray.push(marker);
    }

    // Calculate route and directions
    function calcRoute(locations, distance_ele_id, duration_ele_id, direction_ele_id) {
        publicMarkerRemove();
        var total_records = locations.destination.length;
        var counter = 0;
        var start_address = "";
        var end_address = "";
        var waypts = [];

        $.each(locations.destination, function (i, field) {
            address = field.address;
            if (counter == 0) {
                start_address = address;
            }
            else
                if (counter == (total_records - 1)) {
                    end_address = address;
                }
                else {
                    waypts.push({
                        location: address,
                        stopover: true
                    });
                }
            counter++;
        });

        // Create a Request variable for Map
        var request = {
            origin: start_address,
            destination: end_address,
            waypoints: waypts,
            optimizeWaypoints: false,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };

        // Execute the Route Method to generate Direction Route on Map

        directionsService.route(request, function (response, status) {
            //var directionsDiv = document.getElementById(direction_ele_id);

            if (status == google.maps.DirectionsStatus.OK) {
                //directionsDiv.innerHTML = "";
                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(response);
                //  directionsDisplay.setPanel(directionsDiv);

                var route = response.routes[0];

                // calculate total distance and duration
                var distance = 0;
                var time = 0;
                for (var i = 0; i < route.legs.length; i++) {
                    var theLeg = route.legs[i];
                    if (i <= route.legs.length - 1) {
                        locations.destination[i + 1].mile = Math.round((theLeg.distance.value * 0.621371192) / 100) / 10;
                        locations.destination[i + 1].time = Math.round(theLeg.duration.value / 60);
                    }
                    distance += theLeg.distance.value;
                    time += theLeg.duration.value;
                    privateMarkerAdd(locations, route.legs[i].start_location, route.legs[i].start_address, i);
                }

                //Last Location --------------------------------------------------------------------------------------------------------
                privateMarkerAdd(locations, route.legs[i - 1].end_location, route.legs[i - 1].end_address, route.legs.length);
                //Last Location --------------------------------------------------------------------------------------------------------

                // $("#" + distance_ele_id).html("Total distance: " + showDistance(distance) + ", ");
                // $("#" + duration_ele_id).html("Total duration: " + Math.round(time / 60) + " minutes");


                $("#txtTotalMile").val(getMiles(distance));
                $("#txtTotalTime").val(getTimes(time));

                // FOR Debug
                // str = JSON.stringify(locations);
                // $("#sample").html(str);

                // FOR Debug
            }
            else {

                privateMarkerRemove();
                alert("Please check location address. or server is busy.. retry again.");
                var mapOptions = {
                    center: new google.maps.LatLng(32.561194, -116.97872),
                    zoom: 6,
                    disableDoubleClickZoom: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                map = new google.maps.Map(document.getElementById("maps"), mapOptions);
            }
        });
    }

    // Show distance in different measurements
    function getMiles(distance) {
        return Math.round((distance * 0.621371192) / 100) / 10;
    }
    function getTimes(time) {
        return Math.round(time / 60);
    }

    function showDistance(distance) {
        return Math.round(distance / 100) / 10 + " km (" + Math.round((distance * 0.621371192) / 100) / 10 + " miles)";
    }


    // Get the Map direction status message
    function getDirectionStatusText(status) {
        switch (status) {
            case google.maps.DirectionsStatus.INVALID_REQUEST:
                return "Invalid request";
            case google.maps.DirectionsStatus.MAX_WAYPOINTS_EXCEEDED:
                return "Maximum waypoints exceeded";
            case google.maps.DirectionsStatus.NOT_FOUND:
                return "Not found";
            case google.maps.DirectionsStatus.OVER_QUERY_LIMIT:
                return "Over query limit";
            case google.maps.DirectionsStatus.REQUEST_DENIED:
                return "Request denied";
            case google.maps.DirectionsStatus.UNKNOWN_ERROR:
                return "Unknown error";
            case google.maps.DirectionsStatus.ZERO_RESULTS:
                return "Zero results";
            default:
                return status;
        }
    }

})(jQuery);