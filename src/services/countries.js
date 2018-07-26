import _ from 'lodash'

const data = [
    {
        name: 'Dominican Republic',
        genres: ['merengue', 'bachata', 'perico ripiao']
    },
    {
        name: 'Puerto Rico',
        genres: ['salsa', 'regueton']
    },
    {
        name: 'Mexico',
        genres: ['ranchera']
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