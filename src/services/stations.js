const StationType = {
    GENRE: 'genre'
}

const stations = [
    {
        name: 'Hip-Hop/Rap',
        keywords: ['hip-hop', 'hip hop', 'hiphop', 'rap']
    },
    {
        name: 'Christian/Gospel',
        keywords: ['christian', 'gospel']
    },
    {
        name: 'Trap',
        keywords: ['trap']
    },
    {
        name: 'Country',
        keywords: ['country', 'country music']
    },
    {
        name: 'Dance/Electronic',
        keywords: ['dance', 'electronic', 'edm']
    },
    {
        name: 'Alternative/Indie',
        keywords: ['indie', 'indie rock', 'alternative']
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
        name: 'Latin Tropical',
        description: 'Salsa, Merengue, Bachata',
        keywords: ['salsa', 'merengue', 'bachata']
    },
    {
        name: 'Reggaeton',
        keywords: ['reggaeton']
    },
    {
        name: 'R&B/Soul',
        keywords: ['r&b', 'rhythm and blues', 'soul']
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