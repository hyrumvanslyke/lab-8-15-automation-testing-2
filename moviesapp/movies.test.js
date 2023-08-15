const { Builder, Browser, By, Key, until } = require("selenium-webdriver");

let driver;

beforeAll(async () => {
  driver = new Builder().forBrowser(Browser.CHROME).build();
});

afterAll(async () => {
  await driver.quit();
});

// BOILER PLATE STUFF ABOVE
const addMovie = async (movieTitle) => {// ADD MOVIE VARIABLE THAT I USE IN THE TESTING
    await driver.findElement(By.css('input[name="movieTitle"]')).sendKeys(movieTitle)

    await driver.findElement(By.css('button[type="submit"]')).click()
  };


describe('Test the Movies App', () =>{// DESCRIBE STATEMENT TO HOLD ALL MY TESTS
    test('can delete movie', async () =>{// TEST ONE TO SEE IF ONE CAN REMOVE A MOVIE
        await driver.get('http://localhost:3000/')// TRAVEL TO WEBSITE

        await addMovie("Return Of The King")// ADD A MOVIE

        const addedMovie = await driver.wait(until.elementLocated(By.css("#movies-list li")),1000)// FIND THE ADDED MOVIE

         await addedMovie.findElement(By.css("button.delete-btn")).click()// CLICK ON THE DELETE BUTTON

         await driver.wait(until.stalenessOf(addedMovie), 1000)// WAIT UNTIL SOMETHING IS REMOVED FROM THE DOM OR PAGE IS REFRESHED

         const moviesList = await driver.findElements(By.css("#movies-list li"))// SET VARIABLE TO BE USED IN EXPECT STATEMENT 

         expect(moviesList.length).toBe(0)// IF THERE IS NO MOVIE IN THE LIST IT PASSES

    })

    test("can mark a movie as watched", async () => {// TEST TWO TO SEE IF YOU CAN MARK A MOVIE AS WATCHED
        await driver.get("http://localhost:3000/")// TRAVEL TO THE SITE
      
        await addMovie("Return Of The King")// ADD A MOVIE

        const addedMovie = await driver.wait(until.elementLocated(By.css("#movies-list li")),1000)// LOCATE THE ADDED MOVIE 

        const checkboxElement = await addedMovie.findElement(By.css('input[type="checkbox"]'))// FIND THE CHECKBOX AREA IN THE MOVIE

        await checkboxElement.click()// CLICK ON THE CHECK BOX AREA

        const isChecked = await checkboxElement.isSelected()// VARIABLE THAT CHECKS IF THE BOX IS CHECKED

        expect(isChecked).toBe(true)// IF CHECKED IS TRUE THEN IT PASSES

      })

      test("notification when a movie is removed", async () => {// TEST THREE TO SEE IF THERE IS A NOTIFICATION WHEN THE MOVIE IS REMOVED
        await driver.get("http://localhost:3000/")// TRAVEL TO THE SITE

        await addMovie("Return Of The King")// ADD MOVIE

        const addedMovie = await driver.wait(until.elementLocated(By.css("#movies-list li")),1000)// FIND ADDED MOVIE

        await addedMovie.findElement(By.css("button.delete-btn")).click()// CLICK THE DELETE BUTTON

        const messageElement = await driver.wait(until.elementTextContains(driver.findElement(By.id("message")), "deleted!"),1000)// WAIT UNTIL THE TEXT AREA GIVES A MESSAGE CONTAINING 'deleted!'
        const messageText = await messageElement.getText()// VARIABLE THAT CONTAINS THE TEXT THAT IS PUSHED 
        expect(messageText).toContain('deleted!')// IF THAT TEXT CONTAINS 'deleted!' IT PASSES
})

})