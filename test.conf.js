exports.config = {
    specs: [
        './src/test/test_script/*.js'
    ],
    exclude: [
        // 'path/to/excluded/files'
    ],
    maxInstances: 10,
   
    capabilities: [
        {
            maxInstances: 5,
            browserName: 'chrome',
            acceptInsecureCerts: true
        }
    ],
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 600000
    },
    logLevel: 'info',
    // Default timeout for all waitFor* commands.
    waitforTimeout: 15000,
    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 120000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    //if has install chromedriver by npm install chromdriver
    services: ['chromedriver'],
    //else enable 3 line below and run chromedriver manually
    // host: 'localhost',
    // port: 9515,
    // path: '/',
    //Reporter by @wdio/spec-reporter@latest
    reporters: ['spec'],
}