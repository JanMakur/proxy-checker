let config = require('./config.json');
let fs = require('fs');
let cp = require('child_process');
let proxies = fs.readFileSync(config.proxyFile).toString().split('\n');

proxies.forEach(proxy => {
    let timeBeforeChecking = new Date().getTime();
    proxyRequest(config.testurl , `${config.proxyType}://${proxy}`)
    .then(body => {
        let currentTime = new Date().getTime();
        console.log(`[+] ${proxy}\n    =>${(currentTime-timeBeforeChecking).toString()}ms`)
        cp.exec(`echo ${proxy} >> ${config.outputFile}`)
    })
    .catch(e => {
        console.log(`[-] ${proxy}`)
        cp.exec(`echo ${proxy} >> ${config.errorFile}`)
    })
})

function proxyRequest(url , proxy) {
    return new Promise((resolve , reject) => {
        cp.exec(`curl "${url}" --proxy "${proxy}"` , (error , stdout , stderr) => {
            if (error) return reject(stderr);
            resolve(stdout)
        })
    })
}