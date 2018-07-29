import config from '../config/index.js'
import axios from 'axios';

firebase.initializeApp(config.firebase)
const firestore = firebase.firestore()
firestore.settings({
    timestampsInSnapshots: true
})

const all = function() {
    return new Promise((resolve, reject) => {
            let countries = []

            // Get base countries from firebase
            firestore.collection('countries').get() 
                .then(querySnapshot => {
                    // Get countries details from api
                    axios.get('https://restcountries.eu/rest/v2/all') 
                        .then(countriesDetails => {
                            querySnapshot.forEach(doc => {
                                let country = doc.data()
                                let countryDetails = countriesDetails.data.find(elem => {
                                    return country.code.toUpperCase() === elem.alpha2Code.toUpperCase()
                                })
                                if (countryDetails) {
                                    country = Object.assign(country, countryDetails)
                                    countries.push(country)
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