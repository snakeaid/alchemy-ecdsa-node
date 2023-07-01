const express = require("express");
const app = express();
const cors = require("cors");
const { getPublicKey, getAddressFromPublicKey } = require("./crypto");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "498dd030d8e9ffc4136b7e4fba9ac0b928c9cbae": 100, // private f7d5cc09aa59dad61e99e32c046604d289bd6df7d0187e7881d914e8e96c9a58
  "f8ae440e15f18f3b3fd5fe1b168cc83be3751508": 50, // private 72424ae4ee023e09e5bd213f231d34d76dae5517baf798dea9a7f617a5644aa2
  "694080449f6e1f9b1e053680d3863e3362c052cf": 75, // private bfb4cdc7093239a9ca351671c59bc8a4d719151c36321fab1438e020b23b08ff
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { message, signature } = req.body;
  const { recipient, amount } = message;

  const senderPublicKey = getPublicKey(message, signature);
  const sender = getAddressFromPublicKey(senderPublicKey);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
