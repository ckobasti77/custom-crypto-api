const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const Coin = require("./models/coin.model.js");

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use('/api/custom-crypto-api/coins', coinRoute)

app.get("/api/custom-crypto-api/coins", async (req, res) => {
  try {
    const queryKey = Object.keys(req.query)[0];
    const queryValue = req.query[queryKey];


    const sortValue = parseInt(queryValue, 10);
    if (![1, -1].includes(sortValue) && queryKey) {
      return res.status(400).json({ message: "Invalid sort value: must be 1 or -1" });
    }
    const sortObj = { [queryKey]: sortValue };

    // Use the sort object to sort the results
    const coins = queryKey 
                    ? await Coin.find({}).sort(sortObj)
                    : await Coin.find({})

    res.status(200).json(coins);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
});

app.delete("/api/custom-crypto-api/coins", async (req, res) => {
  try {
    const clear = await Coin.deleteMany({});
    res.send("Success");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const postData = async () => {
  let data;


  await axios
    .get(
      "https://coincodex.com/api/coincheckup/get_coin_list?order_direction=desc&limit=1000&offset=1&order_by=price_change_1H_percent"
    )
    .then((res) => (data = res.data.data));

  data.forEach(async (coin) => {
    await Coin.create(coin);
  });
};

const updateData = async () => {
  try {
    await axios
      .delete("http://localhost:3001/api/delete-coins")
      .then(() => postData());
    console.log("POST request successful:", response.data);
  } catch (error) {
    console.error("Error making POST request:", error.message);
  }
};

const interval = setInterval(updateData, 60000);


mongoose
  .connect(
    "mongodb+srv://sturgessdouglas:rk8CB7h7WubyH4qu@backend.i6mz5rk.mongodb.net/?retryWrites=true&w=majority&appName=backend"
  )
  .then(() => {
    console.log("Connected to database!");
    app.listen(3001, () => {
      console.log("Server is running on port 3001");
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });
