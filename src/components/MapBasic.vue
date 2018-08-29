<template>
    <div class="map-basic map">
        <div class="map-canvas" id="map-canvas"></div>
        <div class="map-infowindow" id="map-infowindow">
            <div v-if="currentCountry">
                <div class="d-flex mb-3">
                    <img class="rounded flag-img" :src="currentCountry.flag">
                    <h4 class="align-self-center ml-3 country-name">{{ currentCountry.name }}</h4>
                </div>
                <table class="table table-striped table-sm">
                    <tbody>
                        <tr>
                            <th>Capital</th>
                            <td>{{ currentCountry.capital }}</td>
                        </tr>
                        <tr>
                            <th>Population</th>
                            <td>{{ currentCountry.population.toLocaleString('en') }}</td>
                        </tr>
                        <tr>
                            <th>Demonym</th>
                            <td>{{ currentCountry.demonym }}</td>
                        </tr>
                        <tr>
                            <th>Region</th>
                            <td>{{ currentCountry.region }}</td>
                        </tr>
                        <tr>
                            <th>Subregion</th>
                            <td>{{ currentCountry.subregion }}</td>
                        </tr>
                        <tr>
                            <th>Languages</th>
                            <td>
                                <span v-for="(l, i) in currentCountry.languages" :key="l.name">{{ l.name }}<span v-if="i < currentCountry.languages.length - 1">, </span></span>
                            </td>
                        </tr>
                        <tr>
                            <th>Currencies</th>
                            <td>
                                <span v-for="(c, i) in currentCountry.currencies" :key="c.name"> {{ c.name }}<span v-if="i < currentCountry.currencies.length - 1">, </span></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style>
.map-canvas {
    position: fixed;
    width: 100%;
    height: 100%;
}
.map .ol-attribution {
    bottom: 4.5em;
}
.map-infowindow {
    position: absolute;
    background-color: #00000080;
    -webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
    filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
    padding: 15px;
    border-radius: 10px;
    border: 0;
    bottom: 12px;
    left: -50px;
    min-width: 400px;
}
.map-infowindow:after {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-top-color: rgba(0,0,0,.2);
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
}
.map-infowindow .country-name {
    color: #fff;
}
.map-infowindow table {
    color: #f2f2f2;
}
.map-infowindow table th, 
.map-infowindow table td {
    border: 0;
}
.map-infowindow .table-striped tbody tr:nth-of-type(odd) {
    background-color: #00000030;
}
.map .flag-img {
    width: 50px;
    height: 35px;
}
</style>

<script>
import {Map, View} from 'ol'
import TileLayer from 'ol/layer/Tile.js'
import {fromLonLat} from 'ol/proj.js'
import OSM from 'ol/source/OSM.js'
import Overlay from 'ol/Overlay.js'

import VectorSource from 'ol/source/Vector.js'
import VectorLayer from 'ol/layer/Vector.js'
import Feature from 'ol/Feature.js'
import Point from 'ol/geom/Point.js'
import {Circle, Fill, Style} from 'ol/style.js'

export default {
    name: 'map-basic-component',
    data() {
        return {
            center: fromLonLat([-70.66666666, 19]),
            olMap: null,
            olView: null,
            olInfowindow: null,
            olVectorSource: null
        }
    },
    computed: {
        currentCountry() {
            return this.$store.getters.currentCountry
        }
    },
    watch: {
        currentCountry(newCountry) {
            const coordinates = fromLonLat([newCountry.latlng[1], newCountry.latlng[0]])

            // Fly to country
            this.flyTo(coordinates, () => {
                // Set infowindow position
                this.olInfowindow.setPosition(coordinates)

                // Place marker
                const marker = new Feature({
                    geometry: new Point(coordinates)
                })

                marker.setStyle(new Style({
                    image: new Circle({
                        radius: 10,
                        fill: new Fill({
                            color: 'rgba(0, 0, 0, 0.5)'
                        })
                    })
                }))
        
                this.olVectorSource.addFeature(marker);
            })
        }
    },
    mounted() {
        this.olView = new View({
            center: this.center,
            zoom: 6
        })

        this.olInfowindow = new Overlay({
            element: document.getElementById('map-infowindow'),
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        })

        this.olMap = new Map({
            target: 'map-canvas',
            view: this.olView,
            overlays: [this.olInfowindow],
            loadTilesWhileAnimating: true,
            loadTilesWhileInteracting: true,
            layers: [
                new TileLayer({
                    preload: 4,
                    source: new OSM()
                })
            ]
        })

        this.olVectorSource = new VectorSource({});

        this.olMap.addLayer(new VectorLayer({
            source: this.olVectorSource
        }));
    },
    methods: {
        flyTo(coordinates, done) {
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

            this.olView.animate({
                center: coordinates,
                duration: duration
            }, callback)

            this.olView.animate({
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
