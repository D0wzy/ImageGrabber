const fs = require('fs')
const request = require("request")
const md5 = require("md5")
const fetch = require("node-fetch");

console.log("\u200B")


console.log("Image grabber by NZ")


console.log("\u200B")

let bod;
let type = "dog"
const url = `https://some-random-api.ml/animal/${type}`

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