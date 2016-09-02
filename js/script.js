// A majority of the implementation of Google Maps, relied upon
// Google's API information, as pressented on their website:
// https://developers.google.com/maps/documentation/javascript/tutorialS
var USERLOCMARKER;
var GEOCODER;
var SUBURB;
var i = 0;
// Used help from the below site for the cycling through of divs
// Other ways to do this were known, but this method was more
// efficient and succinct:
// http://stackoverflow.com/questions/6003060/cycle-through-divs


window.setInterval(function () {
    updateUserLocation();
}, 5000);

$(document).ready(initMap);

function pageLoaded() {
    if (document.cookie.indexOf("has_visited") >= 0) {
        $("#tuteoverlay").hide();
        $("#mapblocker").hide();
    } else {
        document.cookie = "has_visited=anonymous; expires=Thu, 18 Dec 2100 12:00:00 UTC";
    }
}

function initMap() {
    pageLoaded();
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13
        , streetViewControl: false
        , mapTypeControl: false
        , center: {
            lat: -27.495421
            , lng: 153.012470
        }
    });

    GEOCODER = new google.maps.Geocoder;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(userPinInit, errorFunc);
        navigator.geolocation.getCurrentPosition(getPositionForCentre, errorFunc);
    } else {
        alert("Your browser does not support Location Services!")
    }



    function userPinInit(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var coords = new google.maps.LatLng(latitude, longitude);
        USERLOCMARKER = new google.maps.Marker({
            position: coords
            , map: map
            , title: 'Pickup Location'
        });
        USERLOCMARKER.addListener('click', function () {
            geocodeLatLng(GEOCODER, map);
            $("#mapblocker").show();
            $("#photooverlay").show();

        });
    }

    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);

    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);


    function getPositionForCentre(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var coords = new google.maps.LatLng(latitude, longitude);
        centreMapOnUser(latitude, longitude);
    }

    function centreMapOnUser(userLat, userLong) {
        var userLat = userLat;
        var userLong = userLong;
        var coords = new google.maps.LatLng(userLat, userLong);
        //    map = new google.maps.Map(document.getElementById('map'), {
        //        zoom: 13, 
        //        center: {lat: userLat, lng: userLong
        //                }});
        map.panTo(coords);

        //    var marker = new google.maps.Marker({
        //                        position: coords,
        //                        map: map,
        //                        title: 'Pickup Location'
        //                    });
    }

    function errorFunc(error) {
        switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.")
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.")
            break;
        case error.POSITION_ERROR:
            alert("The request to get user location timed out.")
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.")
            break;
        }
    }



    //Support with custom controls found at https://developers.google.com/maps/documentation/javascript/examples/control-custom

    //Google Maps Centre Control
    function CenterControl(controlDiv, map) {

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to recenter the map';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Material Icons';
        controlText.style.fontSize = '30px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'my_location';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to User.
        controlUI.addEventListener('click', function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(getPositionForCentre, errorFunc);
            } else {
                alert("Your browser does not support Location Services!")
            }
        });

    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPositionForCentre, errorFunc);
    } else {
        alert("Your browser does not support Location Services!")
    };
}



function updateUserLocation() {
    navigator.geolocation.getCurrentPosition(userPinUpdate, errorFunc1);
}


function userPinUpdate(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var coords = new google.maps.LatLng(latitude, longitude);
    USERLOCMARKER.setPosition(coords);
}


function errorFunc1(error) {
    switch (error.code) {
    case error.PERMISSION_DENIED:
        //alert("User denied the request for Geolocation.");
        break;
    case error.POSITION_UNAVAILABLE:
        //alert("Location information is unavailable.")
        break;
    case error.TIMEOUT:
        //alert("The request to get user location timed out.")
        break;
    case error.POSITION_ERROR:
        //alert("The request to get user location timed out.")
        break;
    case error.UNKNOWN_ERROR:
        //alert("An unknown error occurred.")
        break;
    }
}

function closePhotoOverlay() {
    $("#photooverlay").hide();
    $("#mapblocker").hide();
    //Purges data from output div
    $("#output").empty();
    $("#overlaytitle").remove();
}

function closeTuteOverlay() {
    $("#tuteoverlay").hide();
    $("#mapblocker").hide();
}

//====================================================//
//The following code is from the trove code example given by the tutors//
//It can be found at http://deco1800.uqcloud.net/examples/troveImage.php //
//====================================================//

var loadedImages = [];
var urlPatterns = ["flickr.com", "nla.gov.au", "artsearch.nga.gov.au", "recordsearch.naa.gov.au", "images.slsa.sa.gov.au"];
var found = 0;


function waitForFlickr() {
    if (found == 0){
        nothingFound();
    }
    if (found == loadedImages.length) {
        printImages();
    } else {
        setTimeout(waitForFlickr, 250);
    }

}

function searchTrove(suburb) {
    //event.preventDefault();

    loadedImages = [];
    found = 0;
    //get input values
    var searchTerm = suburb;
    searchTerm = searchTerm.replace(/ /g, "%20");
    var sortBy = $("#sortBy").val();
    var apiKey = "agc0amct3i6c04ei";

    //create searh query
    var url = "http://api.trove.nla.gov.au/result?key=" + apiKey + "&l-availability=y%2Ff&encoding=json&zone=picture" + "&sortby=relevance&n=100&q=" + searchTerm + "&callback=?";

    //get the JSON information we need to display the images
    $.getJSON(url, function (data) {
        $('#output').empty();
        console.log(data);
        $.each(data.response.zone[0].records.work, processImages);
        //printImages();

        waitForFlickr(); // Waits for the flickr images to load
    });
};




/*
 *   Depending where the image comes from, there is a special way to get that image from the website.
 *   This function works out where the image is from, and gets the image URL
 */
function processImages(index, troveItem) {
    var imgUrl = troveItem.identifier[0].value;
    if (imgUrl.indexOf(urlPatterns[0]) >= 0) { // flickr
        found++;
        addFlickrItem(imgUrl, troveItem);

    } else if (imgUrl.indexOf(urlPatterns[1]) >= 0) { // nla.gov
        found++;
        loadedImages.push(
            imgUrl + "/representativeImage?wid=900" // change ?wid=900 to scale the image
        );

    } else if (imgUrl.indexOf(urlPatterns[2]) >= 0) { //artsearch
        found++;
        loadedImages.push(
            "http://artsearch.nga.gov.au/IMAGES/LRG/" + getQueryVariable("IRN", imgUrl) + ".jpg"
        );

    } else if (imgUrl.indexOf(urlPatterns[3]) >= 0) { //recordsearch
        found++;
        loadedImages.push(
            "http://recordsearch.naa.gov.au/NAAMedia/ShowImage.asp?T=P&S=1&B=" + getQueryVariable("Number", imgUrl)
        );

    } else if (imgUrl.indexOf(urlPatterns[4]) >= 0) { //slsa 
        found++;
        loadedImages.push(
            imgUrl.slice(0, imgUrl.length - 3) + "jpg"
        );

    } else { // Could not reliably load image for item
        // UNCOMMENT FOR DEBUG: 
        // console.log("Not available: " + imgUrl);
    }
}

function addFlickrItem(imgUrl, troveItem) {
    var flickr_key = "a4d0bf2f4bde0595521b7bd8317ec428";
    var flickr_secret = "efc7221b694ff55e";
    var flickr_url = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + flickr_key + "&photo_id=";
    var url_comps = imgUrl.split("/");
    var photo_id = url_comps[url_comps.length - 1];

    $.getJSON(flickr_url + photo_id + "&format=json&nojsoncallback=1", function (data) {
        if (data.stat == "ok") {
            var flickr_image_url = data.sizes.size[data.sizes.size.length - 1].source;
            loadedImages.push(
                flickr_image_url
            );
        }
    });

}

function printImages() {

    $("#overlaybanner").append("<h3 id='overlaytitle' >" + SUBURB + ": A Step Back In Time</h3>");

    // Print out all images
    var count = 1;
    for (var i in loadedImages) {
        var anchor = document.createElement('a');
        anchor.id = "image" + i;
        anchor.href = loadedImages[i].toString();
        anchor.setAttribute("data-lightbox", "example-set");
        anchor.setAttribute("data-title", SUBURB + " " + count);
        anchor.setAttribute("alt", "");
        $("#output").append(anchor);
        var image = new Image();
        image.src = loadedImages[i];
        //image.className = "galleryimg";
        image.style.display = "inline-block";
        image.style.width = "48%";
        image.style.margin = "1%";
        image.style.verticalAlign = "top";

        $("#image" + i).append(image);
        count++;
    }

}

// from http://css-tricks.com/snippets/javascript/get-url-variables/
function getQueryVariable(variable, url) {
    var query = url.split("?");
    var vars = query[1].split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}

//=====================================//
//This code was adapted from code found on the Google API portal//
// https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse //
//====================================//

function geocodeLatLng(geocoder, map, infowindow) {
    navigator.geolocation.getCurrentPosition(geocodeCompletion, errorFunc1);
}

function geocodeCompletion(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var coords = new google.maps.LatLng(latitude, longitude);

    GEOCODER.geocode({
        'location': coords
    }, function (results, status) {
        if (status === 'OK') {
            if (results[1]) {
                var locale = results[1].formatted_address;
                var process = locale.split(" ");
                if (process.length == 3){
                    var suburb = process[0];
                }else{
                    var suburb = "";
                    for (var i = 0; i < (process.length - 3); i++) {
                        suburb += process[i] + " ";
                    }
                }
                SUBURB = suburb;
                // Seems to only show results sometimes
                searchTrove(suburb);
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}

function mapBlockerClicked(){
    closePhotoOverlay();
    $("#tuteoverlay").hide();
}

function nothingFound(){
    $("#output").append("Sorry, we couldn't find anything for your current location. Try moving around then giving it another go!");
};