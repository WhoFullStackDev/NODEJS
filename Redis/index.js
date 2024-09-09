const express = require("express");
const axios = require("axios");
const redis = require("redis");

const app = express();
const port = process.env.PORT || 3000;

let redisClient;

(async () => {
  redisClient = redis.createClient({ url: "redis://127.0.0.1:6379" });

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

async function fetchApiData(species) {
  const apiResponse = await axios.get(
    `https://jsonplaceholder.typicode.com/todos`
  );
  console.log("Request sent to the API");
  return apiResponse.data;
}

async function cacheData(req, res, next) {
  let results;
  try {
    const cacheResults = await redisClient.get("Todos");
    if (cacheResults) {
      results = JSON.parse(cacheResults);
      res.send({
        fromCache: true,
        data: results,
      });
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(404);
  }
}
async function getSpeciesData(req, res) {
  let results;

  try {
    results = await fetchApiData();
    if (results.length === 0) {
      throw "API returned an empty array";
    }
    await redisClient.set("Todos", JSON.stringify(results), {
      EX: 180,
      NX: true,
    });

    res.send({
      fromCache: false,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable");
  }
}

app.get("/todos", cacheData, getSpeciesData);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
