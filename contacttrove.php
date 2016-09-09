<?php
ini_set("allow_url_fopen", 1);
$searchterm = $_POST['searchTerm'];
$url = "http://api.trove.nla.gov.au/result?key=agc0amct3i6c04ei&l-availability=y%2Ff&encoding=json&zone=picture&sortby=relevance&n=100&q=" . $searchterm . "&callback=?";
$json = file_get_contents($url);
echo $json;
?>
