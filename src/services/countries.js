import config from '../config/index.js'
import axios from 'axios';

firebase.initializeApp(config.firebase)
const firestore = firebase.firestore()
firestore.settings({
    timestampsInSnapshots: true
})

const all = function() {
    return new Promise((resolve, reject) => {
            firestore.collection('countries').get()
                .then(querySnapshot => {
                    const countries = []
                    querySnapshot.forEach(doc => {
                        countries.push(doc.data())
                    })
                    resolve(countries)
                }).catch(e => reject(e))
        })
}

const detailsByCountryCode = function(code) {
    return new Promise((resolve, reject) => {
            axios.get('https://restcountries.eu/rest/v2/alpha/' + code)
                .then(response => {
                    resolve(response.data)
                }).catch(e => reject(e))
        })
}

export default {
    all,
    detailsByCountryCode
}