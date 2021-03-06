const {until} = require('selenium-webdriver')
const {Builder, By} = require('selenium-webdriver')
const chai = require('chai')
let should = chai.should();

describe('Search', function () {
    let driver = null;
    before(function () {
        driver = new Builder()
            .withCapabilities({
                'goog:chromeOptions': {
                    binary: 'out/recito-darwin-x64/recito.app/Contents/MacOS/recito',
                    debuggerAddress: '127.0.0.1:9000'

                }
            })
            .forBrowser('chrome')
            .build()
    });


    it('should return results from book search', async function () {
        await driver.findElement(By.id('searchBox')).clear()
        await driver.findElement(By.id('searchBox')).sendKeys('1984')
        await driver.findElement(By.id('searchButton')).click()
        driver.wait(until.elementTextContains(By.id('results'), "Orwell"), 4000);
        driver.wait(() => {
            driver.findElement(By.id('results')).getText().then((resultsText) => {
                chai.assert.equal(resultsText.split(' ').length, 3, "Expected results to be populated")
                driver.quit()
            })
            driver.findElements(By.tagName('li')).then((listElements) => {
                listElements.length.should.not.equal(0)
            })
        }, 2000)

    })
});



