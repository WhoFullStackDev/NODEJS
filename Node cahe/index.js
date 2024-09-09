const express = require("express");
const NodeCache = require("node-cache");

const app = express();
const cache = new NodeCache();

app.get("/users/:id", (req, res) => {
  const userId = req.params.id;

  // Check if the data exists in the cache
  const cachedData = cache.get(userId);

  if (cachedData) {
    // Serve the data from cache
    res.json({ data: cachedData });
  } else {
    // Fetch the data from the API
    fetchDataFromAPI(userId)
      .then((userData) => {
        // Cache the data for future use
        cache.set(userId, userData);

        // Send the response
        res.json({ data: userData });
      })
      .catch((error) => {
        res.status(500).json({ error: "Internal Server Error" });
      });
  }
});

function fetchDataFromAPI(userId) {
  // Simulate API call to retrieve user data
  return new Promise((resolve, reject) => {
    // Assume the API call takes some time
    setTimeout(() => {
      // Mock user data
      const userData = {
        id: userId,
        name: "John Doe",
        email: "johndoe@example.com",
      };
      resolve(userData);
    }, 200);
  });
}

app.listen(3000);
