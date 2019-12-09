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
            var elemID = scripts[i].elemID;
            await testElementByID(elemID);
        }
        if(scripts[i].id == 3){
            console.log(scripts[i]);
            var elemName = scripts[i].elemName;
            await testElementByName(elemName);
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
            results.push({name:"Verify Title",status: "Passed", expected: title, actual: title, testCaseType:1});
            passed = passed + 1;
        }
        else{
            results.push({name:"Verify Title",status: "Failed", expected: expected, actual: title, testCaseType:1});
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

  const testElementByID = async(elemId) => {
    let driver = await new Builder().setChromeOptions(o).forBrowser(browser).build();
    try {
        await driver.get(url);
        var elem =  await driver.findElement(By.id(elemId));
        results.push({name:"Verify if Element By ID exists",status: "Passed",  testCaseType:2});
        console.log("elem:"+elem);
        passed = passed + 1;
      }catch(err){
        results.push({name:"Verify if Element By ID exists",status: "Failed",error: err.name, testCaseType:2});
          console.log("Can't find elem");
          console.log(err);
          failed = failed + 1;
      }
       finally {
        console.log(results);
        await driver.quit();
      }
  }

  const testElementByName = async(elemName) => {
    let driver = await new Builder().setChromeOptions(o).forBrowser(browser).build();
    try {
        await driver.get(url);
        var elem =  await driver.findElement(By.name(elemName));
        results.push({name:"Verify if Element By Name exists",status: "Passed",  testCaseType:3});
        console.log("elem:"+elem);
        passed = passed + 1;
      }catch(err){
        results.push({name:"Verify if Element By Name exists",status: "Failed",error: err.name, testCaseType:3});
          console.log("Can't find elem");
          console.log(err);
          failed = failed + 1;
      }
       finally {
        console.log(results);
        await driver.quit();
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