const {Builder, By, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
let o = new chrome.Options();
// o.addArguments('start-fullscreen');
o.addArguments('disable-infobars');
// o.addArguments('headless'); // running test on visual chrome browser
o.setUserPreferences({ credential_enable_service: false });

const postTests = (req,res,next) => {
    console.log("Body:");
    console.log(req.body);

    //to get data from url
    var scripts = req.body.scripts;
    var browser = req.body.browser;
    var url = req.body.url;
    
    //to store results
    var results =[];
    var passed = 0;
    var failed = 0;

    //running each test case
	const runTests = async(callback) => {
        for(var i = 0; i < scripts.length; i++) {
        if(scripts[i].id == 1){
            var expected = scripts[i].expected;
            await testTitle(expected);
        }
        if(scripts[i].id == 2){
            var username = "akhilasanka@gmail.com";
            var password = "Akhila@123";
            await testLogin(username,password);
        }
    }
    callback();
}

const testTitle = async (expected) => {
    let driver = await new Builder().setChromeOptions(o).forBrowser(browser).build();
    try {
      await driver.get(url);
      await driver.getTitle().then(function(title){
          console.log(title);
        if(title == expected){
            results.push({name:"Verify Title",status: "Passed", expected: title, actual: title});
            passed = passed + 1;
        }
        else{
            results.push({name:"Verify Title",status: "Failed", expected: expected, actual: title});
            failed = failed + 1;
        }
      });
    }catch(err){
        console.log(err);
        res.status(500).json({errorMsg:"Server not responding"});
    }
     finally {
      console.log(results);
      await driver.quit();
    }
  }

  const testLogin = async(username,password) => {
    let driver = await new Builder().setChromeOptions(o).forBrowser(browser).build();
    try {
        await driver.get("http://localhost:3000/");
        var email =  await driver.findElement(By.id("email")); 
        await email.sendKeys("akhila.sanka@email.com");
        var password = await  driver.findElement(By.id("password"));
        await password.sendKeys("welcome123");
        await driver.findElement(By.id("login") ).click()
        setTimeout(async () => { },1000);
        //var elem = await driver.findElement(By.id("nav-sidebar"));
        var elem = await driver.getCurrentUrl();
        console.log("url:"+elem);
        /* driver.findElement(By.id("email")).then(function(email){
            email.sendKeys("akhila.sanka@email.com");
            driver.findElement(By.id("password")).then(function(password){
                password.sendKeys("welcome123");
                driver.findElement(By.id("login") ).click().then(setTimeout (function(){
                    driver.findElement(By.id("nav-sidebar")).then(function(div){
                        console.log("passed");
                    }).catch((err) => {
                        console.log("failed");
                        console.log(err);
                    })
                }),10000);
            });
        });*/
      }catch(err){
          console.log(err);
          res.status(500).json({errorMsg:"Server not responding"});
      }
       finally {
        console.log(results);
      }
  }

runTests(() => {
    console.log("Sending status....");
    res.status(200).json({results:results,"total":scripts.length,"passed":passed,"failed":failed});
});
}



module.exports = {
    postTests
};