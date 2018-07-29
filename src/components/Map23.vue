<template>
    <div class="map">
         <button @click="fly1">fly1</button>
        <button @click="fly2">fly2</button>

        <div id="map-canvas" class="map-canvas"></div>
        <div id="mapid"></div>

    </div>
</template>


<style>

    .map-canvas {
        position: absolute;
        width: 100%;
        height: 100%;
    }
</style>

<script>
import config from '../config/index.js'

var map;
import L from 'leaflet'
export default {
    name: 'map-component',
    mounted() {
/*

      var map = new L.Map('map-canvas', {center: new L.LatLng(51.51, -0.11), zoom: 9});
      var googleLayer = new L.Google('ROADMAP');
      map.addLayer(googleLayer);
*/

       map = L.map('map-canvas', {
           renderer: L.svg()
       }).setView([51.505, -0.09], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + config.mapBox.accessToken, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    preferCanvas: true,
    accessToken: config.mapBox.accessToken
}).addTo(map);


    },
    methods: {
        fly1() {
              map.flyTo([19.780769, -70.687111], 10, {
            animate: true,
            duration: 2 // in seconds
          });
        },
             fly2() {
       
        },
    }
}
</script>