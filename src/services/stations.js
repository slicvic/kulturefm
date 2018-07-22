const StationType = {
    GENRE: 'genre'
}

const stations = [
    {
        name: 'Hip-Hop/Rap/Trap',
        keywords: ['hip-hop', 'hip hop', 'hiphop', 'rap', 'trap']
    },
    {
        name: 'Country',
        keywords: ['country', 'country music']
    },
    {
        name: 'Dance',
        keywords: ['dance']
    },
    {
        name: 'Electronic',
        keywords: ['electronic', 'edm']
    },
    {
        name: 'Indie',
        keywords: ['indie', 'indie rock']
    },
    {
        name: 'Jazz',
        keywords: ['jazz']
    },
    {
        name: 'K-Pop',
        keywords: ['k-pop']
    },
    {
        name: 'Latino',
        keywords: ['latino', 'salsa', 'merengue', 'bachata', 'reggaeton'],
    },
    {
        name: 'R&B',
        keywords: ['r&b', 'rhythm and blues']
    },
    {
        name: 'Pop',
        keywords: ['pop']
    },
    {
        name: 'Rock',
        keywords: ['rock']
    },
    {
        name: 'Reggae',
        keywords: ['reggae']
    }
]

export default {
    getStations() {
        return stations.sort((a, b) => {
            const nameOfA = a.name.toUpperCase()
            const nameOfB = b.name.toUpperCase()

            if (nameOfA < nameOfB) {
                return -1
            }
            if (nameOfA > nameOfB) {
                return 1
            }

            return 0
        })
    }
}