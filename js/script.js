// A large portion of the maps implementation was adapted from code found within the Google API resources
//Small sections of code were pulled from a previous assignment CaPool By Christopher Lane Lane, Mitchell Woods and Freya Rogers, however these peices of code are purely functional and 

var USERLOCMARKER;
var GEOCODER;
var SUBURB;
var i = 0;

//Update user loaction every minute
window.setInterval(function () {
    updateUserLocation();
}, 60000);

//On load creat map
$(document).ready(initMap);

//Function to check user cookies
function pageLoaded() {
    //Visitor has been there before
    if (document.cookie.indexOf("has_visited") >= 0) {
        $("#tuteoverlay").hide();
        $("#mapblocker").hide();
        //Hasn't visited before
    } else {
        document.cookie = "has_visited=anonymous; expires=Thu, 18 Dec 2100 12:00:00 UTC";
    }
}

//Map creation
function initMap() {
    pageLoaded();
    //Create the map
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13
        , streetViewControl: false
        , mapTypeControl: false
        , center: {
            lat: -27.495421
            , lng: 153.012470
        }
    });

    //Creates a geocoder
    GEOCODER = new google.maps.Geocoder;

    //Check whether geolocation is possible
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(userPinInit, errorFunc);
        navigator.geolocation.getCurrentPosition(getPositionForCentre, errorFunc);
        //Not possible
    } else {
        alert("Your browser does not support Location Services!")
    }


    //Create User Pin
    function userPinInit(position) {
        //Get user location
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var coords = new google.maps.LatLng(latitude, longitude);

        //Message Box
        var contentString = "Click Me!";

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        //Create Global Marker
        USERLOCMARKER = new google.maps.Marker({
            position: coords
            , map: map
            , title: 'Click Me!'
        });

        //Make marker open overlay and search Trove when clicked
        USERLOCMARKER.addListener('click', function () {
            geocodeLatLng(GEOCODER, map);
            $("#mapblocker").show();
            $("#photooverlay").show();

        });

        infowindow.open(map, USERLOCMARKER);
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
    } else {
        setTimeout(waitForFlickr, 250);
    }

}

function searchTrove(suburb) {
    //event.preventDefault();

    loadedImages = [];
    loadedTitles = [];
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
    var imgTitle = troveItem.title;
    //alert(imgTitle);
    if (imgUrl.indexOf(urlPatterns[0]) >= 0) { // flickr
        found++;
        addFlickrItem(imgUrl, troveItem);

    } else if (imgUrl.indexOf(urlPatterns[1]) >= 0) { // nla.gov
        found++;
        loadedImages.push(
            imgUrl + "/representativeImage?wid=900" // change ?wid=900 to scale the image
        );
        loadedTitles.push(
            imgTitle
        );

    } else if (imgUrl.indexOf(urlPatterns[2]) >= 0) { //artsearch
        found++;
        loadedImages.push(
            "http://artsearch.nga.gov.au/IMAGES/LRG/" + getQueryVariable("IRN", imgUrl) + ".jpg"
        );
        loadedTitles.push(
            imgTitle
        );

    } else if (imgUrl.indexOf(urlPatterns[3]) >= 0) { //recordsearch
        found++;
        loadedImages.push(
            "http://recordsearch.naa.gov.au/NAAMedia/ShowImage.asp?T=P&S=1&B=" + getQueryVariable("Number", imgUrl)
        );
        loadedTitles.push(
            imgTitle
        );

    } else if (imgUrl.indexOf(urlPatterns[4]) >= 0) { //slsa 
        found++;
        loadedImages.push(
            imgUrl.slice(0, imgUrl.length - 3) + "jpg"
        );
        loadedTitles.push(
            imgTitle
        );

    } else if (imgUrl.indexOf(urlPatterns[5]) >= 0) { //direct jpg link 
        found++;
        loadedImages.push(
            imgUrl
        );
        loadedTitles.push(
            imgTitle
        );

    } else if (imgUrl.indexOf(urlPatterns[6]) >= 0) { //direct png link
        found++;
        loadedImages.push(
            imgUrl
        );
        loadedTitles.push(
            imgTitle
        );

    } else { // Could not reliably load image for item
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

function geocodeLatLng(geocoder, map, infowindow) {
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
                } else {
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

//Make it so that when map blocker is clicked, any overlays are hidden
function mapBlockerClicked() {
    closePhotoOverlay();
    $("#tuteoverlay").hide();
}

//Error message fo when Trove finds no usable results
function nothingFound() {
    $("#output").append("<br><br>Sorry, we couldn't find anything for your current location.<br>Try moving around then giving it another go!");
};