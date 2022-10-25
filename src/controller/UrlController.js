const urlModel = require("../model/UrlModel")
const shortid = require("shortid")
const redis = require("redis");
const validator = require("validator")


const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
    17874,
    "redis-17874.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("38kcquqXj7eViHhkpxyHNCakh974KfcC", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});


const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


//___________________________________________________ Create Short Url __________________________________________________________//

const urlcreation = async function (req, res) {
      
    try {

        data = req.body
        let longUrl = data.longUrl

        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "data is required" })

        if (!longUrl) return res.status(400).send({ status: false, message: "please enter longUrl" })

        if (typeof longUrl !== "string") return res.status(400).send({ status: false, message: "url should be in string format" })

        if(!validator.isURL(longUrl))return res.status(400).send ({status:false, message:"url is not valid"})

        const urlexist = await urlModel.findOne({ longUrl: longUrl }).select({ _id: 0, longUrl: 1, urlCode: 1, shortUrl: 1 })
        if (urlexist) return res.status(201).send({ status: false, message: "longUrl already exist", data: urlexist })

        const urlCode = shortid.generate().toLowerCase()

        const baseUrl = "http://localhost:3000"

        const obj = {
            longUrl: longUrl,
            shortUrl: baseUrl + "/" + urlCode,
            urlCode: urlCode
        }
        const createUrl = await urlModel.create(obj)
        await SET_ASYNC(`${urlCode}`, JSON.stringify(longUrl))
        return res.status(201).send({ status: true, message: "url created successfully", data: obj })

    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, message: "server error", error: error.message })
    }

}

//_________________________________________________ Get Url __________________________________________________________//


const geturl = async function (req, res) {
    try {
        let urlCode = req.params.urlCode

        if (/.*[A-Z].*/.test(urlCode)) {
            return res.status(400).send({ status: false, message: "please Enter urlCode only in lowercase" })
        }
        const urlCodeexist = await urlModel.findOne({ urlCode: urlCode })
        if (!urlCodeexist) return res.status(404).send({ status: false, message: "urlcode not found" })

        let cachedata = await GET_ASYNC(`${req.params.urlCode}`)
        cachedata = JSON.parse(cachedata)
        if (cachedata) {
            res.status(302).redirect(cachedata)
        } else {
            let orignalUrl = await urlModel.findOne({ urlCode: urlCode }).select({ _id: 0, longUrl: 1 });
            return res.status(302).redirect(orignalUrl.longUrl)
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: "server error", error: err.message })
    }
}

//_______________________________________________ Module Exports __________________________________________________//

module.exports = { urlcreation, geturl }

