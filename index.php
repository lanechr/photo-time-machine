<!doctype html>

<html lang="en">

<head>
    <meta charset="utf-8" />
    <title>Photo Time Machine</title>
    <!-- Mobile Optimisation -->
    <meta name=viewport content="width=device-width, initial-scale=1">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <!-- StyleSheets -->
    <link href="css/style.css" rel="stylesheet" type="text/css">
    <!-- Google Materialize StyleSheet-->
    <link rel="stylesheet" href="css/materialize.css">
    <!-- Google Web Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css?family=Oswald" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <!-- jQuery -->
    <link rel="stylesheet" href="http://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
    <script type="text/javascript" src="js/jquery-1.11.3.min.js"></script>
    <script src="http://code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
    <!-- JavaScript -->
    <script type="text/javascript" src="js/script.js"></script>
    <!--LightBox-->
    <link href="lightbox2-master/dist/css/lightbox.css" rel="stylesheet">
    <script src="lightbox2-master/dist/js/lightbox-plus-jquery.js"></script>
    <!--Google Maps-->
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCqSfE33soawqnehyoiU2Egmld9q3d_PbM&&libraries=places">
    </script>

</head>

<body>

    <header id="banner">
        <a href="index.php"><h1>Photo Time Machine</h1></a>
    </header>


    <!-- Map -->
    <div id="map" class="map"></div>
    <div id="mapblocker" onclick="mapBlockerClicked()"></div>
    
    <!--Tutorial-->
    <div id="tuteoverlay">
        <h1>Welcome to Photo Time Machine!</h1>
        <button class="overlaycross" onclick="closeTuteOverlay()">&#735;</button>
    </div>
    
    <!--Photo Overlay-->
    <div id="photooverlay">
        <div id="overlaybanner">
            <button class="overlaycross" onclick="closePhotoOverlay()">&#735;</button>
            <a href="http://trove.nla.gov.au/?q=">
                <img id="trovecredit" src="images/API-light.png" alt="trovelogo">
            </a>
        </div>
        <div id="output"></div>
    </div>

    <script src="lightbox2-master/dist/js/lightbox.js"></script>
</body>

</html>