import config from '../config/index.js'
import axios from 'axios'

firebase.initializeApp(config.firebase)
const firestore = firebase.firestore()
firestore.settings({
    timestampsInSnapshots: true
})

const all = function() {
    return new Promise((resolve, reject) => {
            // Get countries from firebase
            firebase.database().ref('/countries').once('value')
                .then(snapshot => {
                    // Get details from api
                    axios.get('https://restcountries.eu/rest/v2/all') 
                        .then(countriesDetails => {
                            let countries = []
                            console.log(snapshot)
                            snapshot.val().forEach(country => {
                                let countryDetails = countriesDetails.data.find(c => {
                                    return country.code.toUpperCase() === c.alpha2Code.toUpperCase()
                                })
                                if (countryDetails) {
                                    countries.push(Object.assign(country, countryDetails))
                                }
                            })
                            resolve(countries)
                        }).catch(e => reject(e))
                }).catch(e => reject(e))
        })
}

export default {
    all
}