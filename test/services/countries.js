import chai from 'chai'
import countriesSvc from '../../src/services/countries.js'
const assert = chai.assert
const expect = chai.expect

describe('countriesSvc', function() {
    describe('#all()', function() {
        it('returns a list of countries', function() {
            const countries = countriesSvc.all().then(() => {
                expect(countries).to.be.an('array')
            })
        })

        it('cointaining a code, name, genres, and coordinates', function() {
            countriesSvc.all().then((countries) => {
                countries.forEach(country => {
                    expect(country).to.be.an('object').that.has.all.keys('name', 'genres')
                    expect(country).to.have.a.property('name').that.is.a('string').of.lengthOf.at.least(2)
                    expect(country).to.have.a.property('genres').that.is.a('array').of.lengthOf.at.least(1)
                })
            })
        })
    })
})