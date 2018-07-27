import _ from 'lodash'

const data = [
    {
        code: 'do',
        name: 'Dominican Republic',
        genres: ['merengue', 'bachata', 'perico ripiao'],
        coord: {
            lat: 18.735693,
            lon: -70.162651
        }
    },
    {
        code: 'pr',
        name: 'Puerto Rico',
        genres: ['salsa', 'regueton'],
        coord: {
            lat: 18.220833,
            lon: -66.590149
        }
    },
    {
        code: 'mx',
        name: 'Mexico',
        genres: ['ranchera'],
        coord: {
            lat: 23.634501,
            lon: -102.552784
        }
    }
]

const random = function() {
    return _.sample(_.shuffle(data))
}

const randomNotEqualTo = function(country) {
    do {
        let randomCountry = random()
        if (randomCountry.name !== country.name) {
            return randomCountry
        }
    } while(1)
}

const randomGenreFrom = function(country) {
    return _.sample(country.genres)
}

export default {
    random,
    randomNotEqualTo,
    randomGenreFrom
}