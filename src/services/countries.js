import config from '../config/index.js'
import axios from 'axios'

firebase.initializeApp(config.firebase)

const firestore = firebase.firestore()

firestore.settings({
    timestampsInSnapshots: true,
})

const all = function() {
    return new Promise((resolve, reject) => {
        // Fetch countries from firebase
        firebase
            .database()
            .ref('/countries')
            .once('value')
            .then((snapshot) => {
                // Fetch country info from api
                axios
                    .get('https://restcountries.com/v3.1/all')
                    .then((countriesResponse) => {
                        const result = []
                        snapshot.val().forEach((country) => {
                            const countryResponse = countriesResponse.data.find(
                                (c) =>
                                    country.code.toUpperCase() ===
                                    c.cca2.toUpperCase()
                            )
                            countryResponse &&
                                result.push(
                                    Object.assign(country, countryResponse)
                                )
                        })
                        resolve(result)
                    })
                    .catch((e) => reject(e))
            })
            .catch((e) => reject(e))
    })
}

export default {
    all,
}
