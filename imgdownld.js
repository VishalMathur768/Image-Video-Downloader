let puppeteer = require("puppeteer");
let fs= require("fs");
let input = process.argv[2];
(async function(){
   try{
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"]
        
    })
    let tabs = await browser.pages();
    let tab = tabs[0];
    let response=await tab.goto("http://www.bing.com/images/search",
     { waitUntil: "networkidle2" });
     await tab.waitForSelector(".b_searchbox");
     await tab.type(".b_searchbox",input);
     
    await Promise.all(
      [tab.waitForNavigation({ waitUntil: "networkidle0" }),
      tab.keyboard.press('Enter')]);
      
      await tab.waitForSelector(".img_cont.hoff");
      
        tab.waitForNavigation({ waitUntil: "networkidle0" });
        
        let img = await tab.$(".img_cont.hoff img");
        
        let imgURL = await img.evaluate(function(el) {
          return el.getAttribute("src");
        })

       console.log(imgURL);
       let ImagePage= await browser.newPage();
      let viewSource=await ImagePage.goto(imgURL);
      let buffer=await viewSource.buffer();
      await fs.promises.writeFile('project1.jpeg',buffer);
       browser.close();

      }catch (err) {
        console.log(err)
      }
     })();




  
