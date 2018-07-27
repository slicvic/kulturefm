<template>
    <div class="map">
        <div class="map__canvas" id="map-canvas"></div>
        <div class="map__popup" id="map-popup">
            <div>{{ currentLocation.name }}</div>
        </div>
    </div>
</template>

<style>
    .map__canvas {
        position: fixed;
        top: 0;
        width: 100%;
        height: calc(100% - 60px);
    }
    .map__popup {
        position: absolute;
        background-color: white;
        -webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
        filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
        padding: 15px;
        border-radius: 10px;
        border: 1px solid #cccccc;
        bottom: 12px;
        left: -50px;
        min-width: 280px;
    }
    .map__popup:after,
    .map__popup:before {
        top: 100%;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }
    .map__popup:after {
        border-top-color: white;
        border-width: 10px;
        left: 48px;
        margin-left: -10px;
    }
    .map__popup:before {
        border-top-color: #cccccc;
        border-width: 11px;
        left: 48px;
        margin-left: -11px;
    }
</style>

<script>
import Map from 'ol/Map.js'
import View from 'ol/View.js'
import TileLayer from 'ol/layer/Tile.js'
import {fromLonLat} from 'ol/proj.js'
import OSM from 'ol/source/OSM.js'
import Overlay from 'ol/Overlay.js'

export default {
    name: 'map-component',
    data() {
        return {
            mapObj: null,
            viewObj: null,
            overlayObj: null,
            center: fromLonLat([28.9744, 41.0128])
        }
    },
    computed: {
        currentLocation() {
            return this.$store.getters.currentLocation
        }
    },
    watch: {
        currentLocation(newLocation) {
            this.overlayObj.setPosition(fromLonLat([newLocation.coord.lon, newLocation.coord.lat]))
            this.flyTo(fromLonLat([newLocation.coord.lon, newLocation.coord.lat]), function() {})
        }
    },
    mounted() {
        this.viewObj = new View({
            center: this.center,
            zoom: 6
        })

        this.overlayObj = new Overlay({
            element: document.getElementById('map-popup'),
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        })

        this.mapObj = new Map({
            target: 'map-canvas',
            view: this.viewObj,
            overlays: [this.overlayObj],
            loadTilesWhileAnimating: true,
            loadTilesWhileInteracting: true,
            layers: [
                new TileLayer({
                    preload: 4,
                    source: new OSM()
                })
            ]
        })
    },
    methods: {
        flyTo(location, done) {
            var duration = 2000
            var zoom = 6
            var parts = 2
            var called = false
            function callback(complete) {
                --parts
                if (called) {
                    return
                }
                if (parts === 0 || !complete) {
                    called = true
                    done(complete)
                }
            }

            this.viewObj.animate({
                center: location,
                duration: duration
            }, callback)

            this.viewObj.animate({
                zoom: zoom - 1,
                duration: duration / 2
            }, {
                zoom: zoom,
                duration: duration / 2
            }, callback)
        }
    }
}
</script>
