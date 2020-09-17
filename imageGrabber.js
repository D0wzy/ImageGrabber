const fs = require('fs')
const request = require("request")
const md5 = require("md5")
const fetch = require("node-fetch");
const chalk = require('chalk')

console.log("");
console.log("");
console.log((chalk.blue(`                                                               Created by ${chalk.bold(chalk.underline("D0wzy"))} !`)));
console.log("");
console.log((chalk.blue(`                                                       VoltBot: https://voltbot.xyz/discord`)));
console.log((chalk.blue(`                                                     Twitter: https://twitter.com/D0wzy`)));
console.log((chalk.blue(`                                                       Github: https://github.com/D0wzy`)));
console.log("");

let bod;
const api = "https://some-random-api.ml/animal/dog"

console.log("Starting !")
async function timeout() {
    setTimeout(async function () {
        let startAt = Date.now()
        let id = md5(Date.now()).substring(22)
        console.log("Resquest....")
        await request(api, async (error, response, body) => {
            if (!error && response.statusCode === 200) {
                bod = JSON.parse(body)
                let pathIMG = bod.image  //changed this variable according to the api response
                try {
                    fs.exists('data.json', async function(exists) {
                      if(exists){
                          let data = require('./data.json')
                          if(!Array.isArray(data)) throw new Error("data.json must be a array")
                          if (data.includes(pathIMG)) return console.log(`[${new Date().toLocaleDateString()}] [${new Date().toLocaleTimeString()}] Passing ${pathIMG} (already maked)`)

                          const res = await fetch(pathIMG);
                          await new Promise((resolve, reject) => {

                              if (!fs.existsSync('./images')) {
                                  fs.mkdirSync('./images');
                              }
                              let fileStream = fs.createWriteStream(`./images/${id}.${pathIMG.split(".").pop()}`);

                              console.log(`[${new Date().toLocaleDateString()}] [${new Date().toLocaleTimeString()}] Writing ${pathIMG} in ${id}.${pathIMG.split(".").pop()}`)

                              res.body.pipe(fileStream);

                              console.log(`[${new Date().toLocaleDateString()}] [${new Date().toLocaleTimeString()}] ${id}.${pathIMG.split(".").pop()} writed in ${Date.now() - startAt}ms`)

                              data.push(pathIMG)
                              save(data)
                              res.body.on("error", (err) => {
                                  reject(err);
                              });
                              fileStream.on("finish", function () {
                                  resolve();
                              });
                          });
                          timeout();
                      }else{
                          throw new Error('data.json not find')
                      }
                    })
                } catch (e) {
                    console.log(e);
                }
            }
        })
    }, 800);
}

timeout()

async function save(JsonData) {
    fs.writeFileSync(`${__dirname}/./data.json`, JSON.stringify(JsonData, null, 3), function (err) {
        if (err) {
            console.log(err)
        }
    })
    JSON.parse(fs.readFileSync(`${__dirname}/./data.json`))
    return true;
}
