<template>
    <div class="google-map-component">
        <div class="google-map-component-canvas" id="google-map-component-canvas"></div>
        <div id="google-map-component-iw-content" class="d-none">
            <div class="google-map-component-iw" v-if="currentCountry">
                <div class="d-flex mb-3">
                    <img class="rounded flag-img" :src="currentCountry.flag">
                    <h4 class="align-self-center ml-3 country">{{ currentCountry.name }}</h4>
                </div>
                <table class="table table-striped table-sm">
                    <tbody>
                        <tr>
                            <th>Capital</th>
                            <td>{{ currentCountry.capital }}</td>
                        </tr>
                        <tr>
                            <th>Population</th>
                            <td>{{ currentCountry && currentCountry.population && currentCountry.population.toLocaleString('en') }}</td>
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
.google-map-component-canvas {
    position: absolute !important;
    width: 100%;
    height: 100%;
}
.google-map-component-iw .flag-img {
    width: 50px;
    height: 35px;
}
.google-map-component-iw {
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
.google-map-component-iw:after {
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
.google-map-component-iw .country {
    color: #fff;
}
.google-map-component-iw table {
    color: #f2f2f2;
}
.google-map-component-iw table th, 
.google-map-component-iw table td {
    border: 0;
}
.google-map-component-iw .table-striped tbody tr:nth-of-type(odd) {
    background-color: #00000030;
}
</style>

<script>
export default {
    name: 'google-map-component',
    data() {
        return {
            initialZoom: 7,
            initialCenter: {lat: 19, lng: -70.66666666},
            gMap: null,
            gMapInfoWindow: new google.maps.InfoWindow()
        }
    },
    computed: {
        currentCountry() {
            return this.$store.getters.currentCountry
        }
    },
    watch: {
        currentCountry(newCountry) {
            const position = new google.maps.LatLng(newCountry.latlng[0], newCountry.latlng[1])
           
            this.gMap.setCenter(position)

            new google.maps.Marker({
                position: position,
                map: this.gMap
            })

            this.gMapInfoWindow.setPosition(position)
            this.gMapInfoWindow.setContent(document.getElementById('google-map-component-iw-content').innerHTML)
            this.gMapInfoWindow.open(this.gMap)
        }
    },
    mounted() {
        this.gMap = new google.maps.Map(document.getElementById('google-map-component-canvas'), {
            center: this.initialCenter,
            zoom: this.initialZoom
        });
    }
}
</script>