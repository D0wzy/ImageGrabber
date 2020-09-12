const fs = require('fs')
const request = require("request")
const md5 = require("md5")
const fetch = require("node-fetch");

  console.log("");                                   
  console.log("");                                  
  console.log((chalk.yellow(`                                                               Created by D0wzy !`)));  
  console.log("");                                   
  console.log((chalk.red(`                                                       VoltBot: https://voltbot.xyz/discord`)));   
  console.log((chalk.red(`                                                     Twitter: https://twitter.com/D0wzy`)));   
  console.log((chalk.red(`                                                       Github: https://github.com/D0wzy`)));   
  console.log("");                                  

let bod;
const api = "https://some-random-api.ml/animal/dog"
let data = require('./data.json')

console.log("Starting !")
async function timeout() {
    setTimeout(async function () {
        let startAt = Date.now()
        let id = md5(Date.now()).substring(22)
        await request(url, async (error, response, body) => {
            if (!error && response.statusCode === 200) {
                bod = JSON.parse(body)

                try {


                    if (data.includes(bod.image)) return console.log(`[${new Date().toLocaleDateString()}] [${new Date().toLocaleTimeString()}] Passing ${bod.image} (already maked)`)

                    const res = await fetch(bod.image);
                    await new Promise((resolve, reject) => {

                        const fileStream = fs.createWriteStream(`./images/${id}.png`);

                        console.log(`[${new Date().toLocaleDateString()}] [${new Date().toLocaleTimeString()}] Writing ${bod.image} in ${id}.png`)
                        console.log(`[${new Date().toLocaleDateString()}] [${new Date().toLocaleTimeString()}] ${id}.png writed in ${Date.now() - startAt}ms`)
                        res.body.pipe(fileStream);
                        data.push(bod.image)
                        save()
                        res.body.on("error", (err) => {
                            reject(err);
                        });
                        fileStream.on("finish", function () {
                            resolve();
                        });
                    });
                } catch (e) {
                    console.log(e);
                }
            }
        })

        timeout();
    }, 800);
}

timeout()

async function save() {
    fs.writeFileSync(`${__dirname}/./data.json`, JSON.stringify(data, null, 3), function (err) {
        if (err) {
            console.log(err)
        }
    })
    data = JSON.parse(fs.readFileSync(`${__dirname}/./data.json`))
    return true;
}
