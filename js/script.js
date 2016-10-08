// A large portion of the maps implementation was adapted from code found within the Google API resources
//Small sections of code were pulled from a previous assignment CaPool By Christopher Lane Lane, Mitchell Woods and Freya Rogers, however these pieces of code are purely functional and 
var USERLOCMARKER;
var GEOCODER;
var SUBURB;
var i = 0;
var LOGGEDIN = false;
var map;
var MARKERS = [];
var CURTOGGLE = "no favourites";
var THISSUBURB;
var GEOITERATOR = 0;
var EVENTSLOADED = false;
//Update user loaction every minute
window.setInterval(function () {
    updateUserLocation();
}, 60000);
//On load creat map
$(document).ready(initMap);
//Function to check user cookies
function pageLoaded() {
    $("#tuteoverlay").hide();
    $("#mapblocker").hide();
    $("#signupoverlay").hide();
    if (LOGGEDIN == true) {
        loginComplete();
    }
    else {
        $("#loginmapblocker").show();
        $('#logoutbuttonholder').hide();
    }
}
//Map creation
function initMap() {
    pageLoaded();
    //Create the map
    // The style used in the map is called "Old Timey" and was found at https://snazzymaps.com/style/22/old-timey
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13
        , streetViewControl: false
        , mapTypeControl: false
        , styles: [
            {
                "featureType": "administrative"
                , "stylers": [
                    {
                        "visibility": "off"
                    }
                            ]
            }
            , {
                "featureType": "poi"
                , "stylers": [
                    {
                        "visibility": "simplified"
                    }
                            ]
            }
            , {
                "featureType": "road"
                , "stylers": [
                    {
                        "visibility": "simplified"
                    }
                            ]
                }
            , {
                "featureType": "water"
                , "stylers": [
                    {
                        "visibility": "simplified"
                    }
                            ]
            }
            , {
                "featureType": "transit"
                , "stylers": [
                    {
                        "visibility": "simplified"
                    }
                            ]
            }
            , {
                "featureType": "landscape"
                , "stylers": [
                    {
                        "visibility": "simplified"
                }
                            ]
            }
            , {
                "featureType": "road.highway"
                , "stylers": [
                    {
                        "visibility": "off"
                    }
                            ]
            }
            , {
                "featureType": "road.local"
                , "stylers": [
                    {
                        "visibility": "on"
                    }
                            ]
            }
            , {
                "featureType": "road.highway"
                , "elementType": "geometry"
                , "stylers": [
                    {
                        "visibility": "on"
                    }
                            ]
            }
            , {
                "featureType": "water"
                , "stylers": [
                    {
                        "color": "#84afa3"
                    }
                    , {
                        "lightness": 52
                    }
                            ]
            }
            , {
                "stylers": [
                    {
                        "saturation": -77
                    }
                            ]
            }
            , {
                "featureType": "road"
            }
        ]
        , center: {
            lat: -27.495421
            , lng: 153.012470
        }
    });
    //Creates a geocoder
    GEOCODER = new google.maps.Geocoder;
    map.setOptions({
        minZoom: 3
        , maxZoom: 15
    });
    //The next 20 lines of code stop the map from panning to far and were accessed from http://stackoverflow.com/questions/23580831/how-to-block-google-maps-api-v3-panning-in-the-gray-zone-over-north-pole-or-unde
    google.maps.event.addListener(map, 'center_changed', function () {
        checkBounds(map);
    });
    // If the map position is out of range, move it back
    function checkBounds(map) {
        var latNorth = map.getBounds().getNorthEast().lat();
        var latSouth = map.getBounds().getSouthWest().lat();
        var newLat;
        if (latNorth < 85 && latSouth > -85) /* in both side -> it's ok */ return;
        else {
            if (latNorth > 85 && latSouth < -85) /* out both side -> it's ok */ return;
            else {
                if (latNorth > 85) newLat = map.getCenter().lat() - (latNorth - 85); /* too north, centering */
                if (latSouth < -85) newLat = map.getCenter().lat() - (latSouth + 85); /* too south, centering */
            }
        }
        if (newLat) {
            var newCenter = new google.maps.LatLng(newLat, map.getCenter().lng());
            map.setCenter(newCenter);
        }
    }
    //Check whether geolocation is possible
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(userPinInit, errorFunc);
        navigator.geolocation.getCurrentPosition(getPositionForCentre, errorFunc);
        //Not possible
    }
    else {
        alert("Your browser does not support Location Services!")
    }
    //Create User Pin
    function userPinInit(position) {
        //Get user location
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var coords = new google.maps.LatLng(latitude, longitude);
        //Message Box
        //        var contentString = "Click Me!";
        //        var infowindow = new google.maps.InfoWindow({
        //            content: contentString
        //        });
        //The icon for this pin was found at https://t3.ftcdn.net/jpg/00/81/47/44/160_F_81474483_o4dKoLrn5GHY75SZVBomhz6K5cGoQdi4.jpg
        var image = {
            url: 'images/hourglasspin.png'
            , size: new google.maps.Size(32, 57)
            , origin: new google.maps.Point(0, 0)
            , anchor: new google.maps.Point(16, 50)
        };
        //Create Global Marker
        USERLOCMARKER = new google.maps.Marker({
            position: coords
            , map: map
            , title: 'Click Me!'
            , icon: image
        });
        //Make marker open overlay and search Trove when clicked
        USERLOCMARKER.addListener('click', function () {
            geocodeLatLng(GEOCODER, map);
            $("#mapblocker").show();
            $("#photooverlay").show();
            $("#savelocbutton").show();
        });
        //        infowindow.open(map, USERLOCMARKER);
    }
    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);
    centerControlDiv.index = 1;
    //Place Centre control on map
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);
    //Find User location
    function getPositionForCentre(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var coords = new google.maps.LatLng(latitude, longitude);
        centreMapOnUser(latitude, longitude);
    }
    //Find User Location
    function centreMapOnUser(userLat, userLong) {
        var userLat = userLat;
        var userLong = userLong;
        var coords = new google.maps.LatLng(userLat, userLong);
        map.panTo(coords);
    }
    //Catch Map Errors
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
            }
            else {
                alert("Your browser does not support Location Services!")
            }
        });
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPositionForCentre, errorFunc);
    }
    else {
        alert("Your browser does not support Location Services!")
    };
}
// Move pin to user location
function updateUserLocation() {
    navigator.geolocation.getCurrentPosition(userPinUpdate, errorFunc1);
}
// move pin to user location
function userPinUpdate(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var coords = new google.maps.LatLng(latitude, longitude);
    USERLOCMARKER.setPosition(coords);
}
//Catch Map errors
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
//Hides the photo overlay and destroys downloaded Trove Content
function closePhotoOverlay() {
    $("#photooverlay").hide();
    $("#mapblocker").hide();
    //Purges data from output div
    $("#output").empty();
    $("#overlaytitle").remove();
}
//Closes the tutorial overlay
function closeTuteOverlay() {
    $("#tuteoverlay").hide();
    $("#mapblocker").hide();
}
//====================================================//
//The following code is from the trove code example given by the tutors//
//It can be found at http://deco1800.uqcloud.net/examples/troveImage.php //
//====================================================//
var loadedImages = [];
var loadedTitles = [];
var urlPatterns = ["flickr.com", "nla.gov.au", "artsearch.nga.gov.au", "recordsearch.naa.gov.au", "images.slsa.sa.gov.au", ".jpg", ".png"];
var found = 0;

function waitForFlickr() {
    if (found == 0) {
        nothingFound();
    }
    if (found == loadedImages.length) {
        printImages();
    }
    else {
        setTimeout(waitForFlickr, 250);
    }
}

function searchTrove(suburb) {
    SUBURB = toTitleCase(suburb);
    //event.preventDefault();
    $("#overlaytitle").remove();
    loadedImages = [];
    loadedTitles = [];
    found = 0;
    //get input values
    var searchTerm = suburb;
    searchTerm = searchTerm.replace(/ /g, "%20");
    searchStr = "searchTerm=" + searchTerm;
    $.ajax({
        type: "POST"
        , url: "contacttrove.php"
        , data: searchStr
        , success: function (results) {
            $('#output').empty();
            var str = results.substring(2, results.length - 1);
            var JSONresponse = JSON.parse(str);
            console.log(JSONresponse);
            $.each(JSONresponse.response.zone[0].records.work, processImages);
            waitForFlickr(); // Waits for the flickr images to load
        }
    });
};
/*
 *   Depending where the image comes from, there is a special way to get that image from the website.
 *   This function works out where the image is from, and gets the image URL
 */
function processImages(index, troveItem) {
    var imgUrl = troveItem.identifier[0].value;
    var imgTitle = troveItem.title;
    //alert(imgTitle);
    if (imgUrl.indexOf(urlPatterns[0]) >= 0) { // flickr
        found++;
        addFlickrItem(imgUrl, troveItem);
    }
    else if (imgUrl.indexOf(urlPatterns[1]) >= 0) { // nla.gov
        found++;
        loadedImages.push("https" + imgUrl.substring(4, imgUrl.length) + "/representativeImage?wid=900" // change ?wid=900 to scale the image
        );
        loadedTitles.push(imgTitle);
    }
    else if (imgUrl.indexOf(urlPatterns[4]) >= 0) { //slsa 
        found++;
        loadedImages.push(imgUrl.slice(0, imgUrl.length - 3) + "jpg");
        loadedTitles.push(imgTitle);
    }
    else if (imgUrl.indexOf(urlPatterns[5]) >= 0) { //direct jpg link 
        found++;
        loadedImages.push(imgUrl);
        loadedTitles.push(imgTitle);
    }
    else if (imgUrl.indexOf(urlPatterns[6]) >= 0) { //direct png link
        found++;
        loadedImages.push(imgUrl);
        loadedTitles.push(imgTitle);
    }
    else { // Could not reliably load image for item
        // UNCOMMENT FOR DEBUG: 
        console.log("Not available: " + imgUrl);
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
            loadedImages.push(flickr_image_url);
        }
    });
}

function printImages() {
    $("#overlaybanner").append("<h3 id='overlaytitle' >" + SUBURB + ": A Step Back In Time</h3>");
    // Print out all images
    var count = 1;
    for (var i in loadedImages) {
        //Create anchor tag to implement lightbox
        var anchor = document.createElement('a');
        anchor.id = "image" + i;
        anchor.href = loadedImages[i].toString();
        anchor.setAttribute("data-lightbox", "example-set");
        anchor.setAttribute("data-title", loadedTitles[i]);
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
function geocodeLatLng(geocoder, map) {
    navigator.geolocation.getCurrentPosition(geocodeCompletion, errorFunc1);
}
//Once geocoding is complete format the result and search trove
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
                if (process.length == 3) {
                    var suburb = process[0];
                }
                else {
                    var suburb = "";
                    for (var i = 0; i < (process.length - 3); i++) {
                        suburb += process[i] + " ";
                    }
                }
                var newSuburb = suburb.split(",");
                var num = newSuburb.length - 1;
                newSuburb = newSuburb[num];
                newSuburb = newSuburb.trim();
                searchTrove(newSuburb);
            }
            else {
                window.alert('No results found');
            }
        }
        else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}
//Make it so that when map blocker is clicked, any overlays are hidden
function mapBlockerClicked() {
    closePhotoOverlay();
    $("#tuteoverlay").hide();
}

function showLoginOverlay() {
    $("#loginoverlay").show();
    $("#mapblocker").show();
}

function hideLoginOverlay() {
    $("#loginoverlay").hide();
    $("#mapblocker").hide();
}
//Error message fo when Trove finds no usable results
function nothingFound() {
    $("#output").append("<br><br>Sorry, we couldn't find anything for your current location.<br>Try moving around then giving it another go!");
};

function userLogin() {
    var uname = $("#usernameinput").val();
    var pword = $("#passwordinput").val();
    $.ajax({
        type: "POST"
        , url: "userlogin.php"
        , data: {
            username: uname
            , password: pword
        }
        , success: function (results) {
            //Response Codes: 1=Success, 2=No Input, 3=Database Connection failed, 4=Incorrect Username or Password
            switch (results) {
            case "1":
                loginComplete();
                break;
            case "2":
                $('#loginerrordiv').html("Please enter your Username and Password");
                break;
            case "3":
                $('#loginerrordiv').html("Internal Server Error, Try again later...");
                break;
            case "4":
                $('#loginerrordiv').html("Incorrect Username or Password");
                break;
            }
        }
    });
}

function userSignUp() {
    var uname = $("#usernamesignupinput").val();
    var pword = $("#passwordsignupinput").val();
    $.ajax({
        type: "POST"
        , url: "usersignup.php"
        , data: {
            username: uname
            , password: pword
        }
        , success: function (results) {
            //Response Codes: 1=Success, 2=No Input, 3=Database Connection failed, 4=Username Already Exists
            switch (results) {
            case "1":
                signupComplete();
                break;
            case "2":
                $('#signuperrordiv').html("Please enter a Username and Password");
                break;
            case "3":
                $('#signuperrordiv').html("Internal Server Error, Try again later...");
                break;
            case "4":
                $('#signuperrordiv').html("Username already Exists");
                break;
            case "5":
                $('#signuperrordiv').html("Unknown Error. Try again later.");
                break;
            }
        }
    });
}

function showSignUp() {
    $("#loginmapblocker").show();
    $("#loginoverlay").hide();
    $("#signupoverlay").show();
}

function showLogin() {
    $("#loginmapblocker").show();
    $("#loginoverlay").show();
    $("#signupoverlay").hide();
}

function loginComplete() {
    $("#loginoverlay").hide();
    $("#signupoverlay").hide();
    $("#loginmapblocker").hide();
    $('#logoutbuttonholder').show();
    loadFavourites();
}

function signupComplete() {
    $("#loginoverlay").hide();
    $("#signupoverlay").hide();
    $("#loginmapblocker").hide();
    $('#logoutbuttonholder').show();
    $("#tuteoverlay").show();
}

function userLogout() {
    showLogin();
    deleteMarkers();
    EVENTSLOADED = false;
    if (CURTOGGLE == "favourites") {
        toggleMarkers();
    }
    $('#logoutbuttonholder').hide();
    $.ajax({
        type: "POST"
        , url: "logout.php"
    });
}

function saveCurrentLocation() {
    EVENTSLOADED = false;
    $.ajax({
        type: "POST"
        , url: "addfavouritelocation.php"
        , data: {
            location: SUBURB
        }
        , success: function (results) {
            //Response Codes: 1=Success, 2=No Input, 3=Database Connection failed
            switch (results) {
            case "1":
                alert("Location Added!");
                deleteMarkers();
                loadFavourites();
                break;
            case "2":
                alert("You already added this location! Try another place!");
                break;
            case "3":
                $('#loginerrordiv').html("Internal Server Error, Try again later...");
                break;
            }
        }
    });
}
//The following function was found at http://stackoverflow.com/questions/4878756/javascript-how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function loadFavourites() {
    $.ajax({
        type: "POST"
        , url: "getlocations.php"
        , success: function (locations) {
            var JSONresponse = JSON.parse(locations);
            console.log(JSONresponse);
            //The following code was found at http://stackoverflow.com/questions/25167596/how-to-define-multiple-locations-using-google-maps-api-to-drop-pin-for-every-pos
            for (var i = 0; i < JSONresponse.length; i++) {
                SUBURBS = JSONresponse;
                GEOCODER.geocode({
                    'address': JSONresponse[i] + " Australia"
                }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var image = {
                            url: 'images/favouritepin.png'
                            , size: new google.maps.Size(37, 55)
                            , origin: new google.maps.Point(0, 0)
                            , anchor: new google.maps.Point(18.5, 50)
                        };
                        var marker = new google.maps.Marker({
                            map: map
                            , position: results[0].geometry.location
                            , visible: false
                            , icon: image
                        });
                        MARKERS.push(marker);
                    }
                    else {
                        console.log('Geocode was not successful for the following reason: ' + status);
                    }
                });
            }
        }
    });
}
//The following code is directly from Google API support
//Found at https://developers.google.com/maps/documentation/javascript/examples/marker-remove
// Sets the map on all markers in the array.
function showFavs(map) {
    for (var i = 0; i < MARKERS.length; i++) {
        MARKERS[i].setVisible(true);
    }
}

function hideFavs(map) {
    for (var i = 0; i < MARKERS.length; i++) {
        MARKERS[i].setVisible(false);
    }
}

function toggleMarkers() {
    if (CURTOGGLE == "no favourites") {
        //USERLOCMARKER.setVisible(false);
        if (!(EVENTSLOADED)) {
            makeMarkersClickable();
            EVENTSLOADED = true;
        }
        showFavs();
        CURTOGGLE = "favourites"
        $('#togglebutton').html("Hide Favourites");
    }
    else {
        //USERLOCMARKER.setVisible(true);
        hideFavs();
        CURTOGGLE = "no favourites";
        $('#togglebutton').html("Show Favourites");
    }
}

function makeMarkersClickable() {
    for (var i = 0; i < MARKERS.length; i++) {
        MARKERS[i].addListener('click', function () {
            for (var j = 0; j < MARKERS.length; j++) {
                if (this == MARKERS[j]) {
                    searchTrove(SUBURBS[j]);
                    $("#mapblocker").show();
                    $("#photooverlay").show();
                    $("#savelocbutton").hide();
                }
            }
        });
    }
}

function deleteMarkers() {
    for (i = 0; i < MARKERS.length; i++) {
        MARKERS[i].setMap(null);
    }
    MARKERS = [];
    SUBURBS = [];
}

function loginCheckEnter(e) {
   if(e && e.keyCode == 13) {
      userLogin();
   }
}

function signUpCheckEnter(e) {
   if(e && e.keyCode == 13) {
      userSignUp();
   }
}