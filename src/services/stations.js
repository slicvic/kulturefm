import * as genreSvc from './genres.js'

const StationType = {
    GENRE: 'genre'
}

const stations = []

genreSvc.getGenres().forEach(genre => {
    stations.push({
        type: StationType.GENRE, 
        name: genre.name, 
        title: genre.title
    })
})

export function getStations() {
    return stations
}