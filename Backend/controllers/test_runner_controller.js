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
        res.status(500).json({errorMsg:"Can't "});
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