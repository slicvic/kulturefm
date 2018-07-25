import chai from 'chai'
import countriesSvc from '../../src/services/countries.js'
const assert = chai.assert
const expect = chai.expect

describe('countriesSvc', function() {
    describe('#random()', function() {
        it('returns a country with name and genres', function() {
            const country = countriesSvc.random()

            expect(country).to.be.an('object').that.has.all.keys('name', 'genres')
            expect(country).to.have.a.property('name').that.is.a('string').of.lengthOf.at.least(2)
            expect(country).to.have.a.property('genres').that.is.a('array').of.lengthOf.at.least(1)
        })

        it('returns a random country', function() {
            const country1 = countriesSvc.random()
            let country2 = null

            do {
                country2 = countriesSvc.random()
            } while (country1.name === country2.name)

            expect(country1).to.not.eql(country2)
        })
    })

    describe('#randomNotEqualTo()', function() {
        it('returns a random country different from given', function() {
            const country1 = countriesSvc.random()
            const country2 = countriesSvc.randomNotEqualTo(country1)
            const country3 = countriesSvc.randomNotEqualTo(country2)
            const country4 = countriesSvc.randomNotEqualTo(country3)

            expect(country1).to.not.eql(country2)
            expect(country2).to.not.eql(country3)
            expect(country3).to.not.eql(country4)
        })
    })

    describe('#randomGenreFrom()', function() {
        it('returns a random genre from given country', function() {
            // Find a country with at least 2 genres to prevent
            // infinite loop below
            let country = null
            do {
                country = countriesSvc.random()
            } while (country.genres.length < 2)

            const genre1 = countriesSvc.randomGenreFrom(country)

            expect(genre1).to.be.a('string').of.lengthOf.at.least(1)
            expect(country.genres).to.include(genre1)

            let genre2 = null
            do {
                genre2 = countriesSvc.randomGenreFrom(country)
            } while(genre2 === genre1)

            expect(genre2).to.not.equal(genre1)
        })
    })
})