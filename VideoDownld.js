let puppeteer = require("puppeteer");
let fs= require("fs");

let input = process.argv[2];

(async function(){
    
    try{
    
     let browser = await puppeteer.launch({
         headless: false,
         defaultViewport: null,
         args: ["--start-maximized",
         "--disable-notifications"]
         
     })
     let tabs = await browser.pages();
     let tab = tabs[0];
     let response=await tab.goto("https://www.youtube.com/",
      { waitUntil: "networkidle2" });
      await tab.waitForSelector("input[id=search]");
     await tab.type("input[id=search]",input);
     await Promise.all(
        [tab.waitForNavigation({ waitUntil: "networkidle2" }),
        tab.keyboard.press('Enter')]);
        await tab.waitForSelector(".style-scope ytd-video-renderer");
        await Promise.all([
            tab.click(".style-scope ytd-video-renderer"), tab.waitForNavigation({
              waitUntil: "networkidle2"}) ])
     let yimageUrl=tab.url();
     console.log(yimageUrl);
     await tab.goto("https://www.savethevideo.com/");
     await tab.waitForSelector("input[id=url]");
     await tab.type("input[id=url]",yimageUrl);
     await tab.waitForSelector("button[type=submit]");
     await Promise.all([
        tab.click("button[type=submit]"), tab.waitForNavigation({
          waitUntil: "networkidle2"}) ])
     tabs = await browser.pages();
     let tab2 = tabs[1];
     tab2.close();
     tabs = await browser.pages();
    tab=tabs[0];
    await tab.waitForSelector("a.button.is-fullwidth.is-danger");
    tab.waitForNavigation({ waitUntil: "networkidle2" });
    let video = await tab.$("a.button.is-fullwidth.is-danger");
    
    await video.click();
    sleep(10000);
   
    video = await tab.$("a.button.is-fullwidth.is-danger");
    let curl = await video.evaluate(function(ele){
        return ele.getAttribute("href")
    })

       let viewSource=await tab.goto(curl);
    
     }catch (err) {
     console.log(err)
   }
 })();
 function sleep(duration) {
     let cur = Date.now();
     let limit = cur + duration;
     while(cur<limit){
         cur = Date.now();
     }
     
 }