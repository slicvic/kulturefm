<template>
    <div class="ol-map-component">
        <div class="canvas" id="map-canvas"></div>
        <div class="infowindow" id="map-infowindow">
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
.ol-map-component .canvas {
    position: fixed;
    width: 100%;
    height: 100%;
}
.ol-map-component .ol-attribution {
    top: .5em;
    bottom: auto;
}
.ol-map-component .infowindow .flag-img {
    width: 50px;
    height: 35px;
}
.ol-map-component .infowindow {
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
.ol-map-component .infowindow:after {
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
.ol-map-component .infowindow .country-name {
    color: #fff;
}
.ol-map-component .infowindow table {
    color: #f2f2f2;
}
.ol-map-component .infowindow table th, 
.ol-map-component .infowindow table td {
    border: 0;
}
.ol-map-component .infowindow .table-striped tbody tr:nth-of-type(odd) {
    background-color: #00000030;
}
</style>

 <script>
import {Map, View} from 'ol'
import {fromLonLat} from 'ol/proj.js'
import Overlay from 'ol/Overlay.js'
import GeoJSON from 'ol/format/GeoJSON.js';
import {Stroke, Text, Fill, Style} from 'ol/style.js';
import VectorSource from 'ol/source/Vector.js'
import VectorLayer from 'ol/layer/Vector.js'
import TileLayer from 'ol/layer/Tile.js'
import OSM from 'ol/source/OSM.js'

export default {
    name: 'open-layers-map-component',
    data() {
        return {
            initialZoom: 6,
            initialCenter: fromLonLat([-70.66666666, 19]),
            olMap: null,
            olView: null,
            olInfowindow: null,
            olVectorSource: null,
            olFeatureOverlay: null
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

            this.flyTo(coordinates, 5, () => {
                this.olInfowindow.setPosition(coordinates)

                const feature = this.olVectorSource.getFeatureById(newCountry.alpha3Code)
                const cnv = document.createElement('canvas')
                const ctx = cnv.getContext('2d')
                const img = new Image()
                img.src = newCountry.flag
                img.onload = function() {
                    const pattern = ctx.createPattern(img, 'repeat')
                    feature.setStyle(new Style({
                        fill: new Fill({
                            color: pattern
                        })
                    }))
                }

                this.olFeatureOverlay.getSource().addFeature(feature)
            })
        }
    },
    mounted() {
        const olStyle = new Style({
            /*fill: new Fill({
                color: 'rgba(0, 0, 0, 0.6)'
            }),
            stroke: new Stroke({
                color: '#319FD3',
                width: 1
            }),*/
            text: new Text({
                font: '12px Roboto,sans-serif',
                fill: new Fill({
                    color: '#000'
                }),
                stroke: new Stroke({
                    color: '#fff',
                    width: 3
                })
            })
        })

        const olHighlightStyle = new Style({
            /*stroke: new Stroke({
                color: '#f00',
                width: 1
            }),
            fill: new Fill({
                color: 'rgba(255, 0, 0, 0.1)'
            }),*/
            text: new Text({
                font: '12px Roboto,sans-serif',
                fill: new Fill({
                    color: '#000'
                }),
                stroke: new Stroke({
                    color: '#f00',
                    width: 3
                })
            })
        })

        this.olView = new View({
            center: this.initialCenter,
            zoom: this.initialZoom
        })

        this.olVectorSource = new VectorSource({
            url: 'https://openlayers.org/en/latest/examples/data/geojson/countries.geojson',
            format: new GeoJSON()
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
            loadTilesWhileAnimating: true,
            loadTilesWhileInteracting: true,
            view: this.olView,
            overlays: [this.olInfowindow],
            layers: [
                new TileLayer({
                    preload: 4,
                    source: new OSM()
                }),
                new VectorLayer({
                    source: this.olVectorSource,
                    style: function(feature) {
                        olStyle.getText().setText(feature.get('name'))
                        return olStyle
                    }
                })
            ]
        })

        this.olFeatureOverlay = new VectorLayer({
            source: new VectorSource(),
            map: this.olMap,
            style: function(feature) {
                olHighlightStyle.getText().setText(feature.get('name'))
                return olHighlightStyle
            }
        })
    },
    methods: {
        flyTo(coordinates, zoom, done) {
            const duration = 2000
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
