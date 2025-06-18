const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");

const express = require("express");
const serverless = require("serverless-http");
const { hashPassword } = require("./hash.js");

const app = express();

const USERS_TABLE = "users";
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

// Fallback: parse Buffer or string body as JSON if needed
app.use((req, res, next) => {
  if (req.body && Buffer.isBuffer(req.body)) {
    try {
      req.body = JSON.parse(req.body.toString("utf8"));
    } catch {}
  } else if (typeof req.body === "string") {
    try {
      req.body = JSON.parse(req.body);
    } catch {}
  }
  next();
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "The email and password fields required!",
      reqBody: req.body,
    });
  }

  try {
    const params = {
      TableName: USERS_TABLE,
      IndexName: "email-index",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
      ProjectionExpression: "id, #name, passwordHash, email",
      ExpressionAttributeNames: {
        "#name": "name",
      },
    };

    const command = new QueryCommand(params);
    const { Items } = await docClient.send(command);
    const user = Items && Items[0];
    if (!user || user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: "Incorrect email or password!" });
    }
    res.json({ id: user.id, name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occured! Please checked logs." });
  }
});

app.get("/users/:userId", async (req, res) => {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  };

  try {
    const command = new GetCommand(params);
    const { Item } = await docClient.send(command);
    if (Item) {
      const { userId, name } = Item;
      res.json({ userId, name });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "userId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retrieve user" });
  }
});

app.post("/users", async (req, res) => {
  const { userId, name, password } = req.body;
  if (typeof userId !== "string") {
    res.status(400).json({ error: '"userId" must be a string' });
    return;
  } else if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
    return;
  } else if (typeof password !== "string") {
    res.status(400).json({ error: '"password" must be a string' });
    return;
  }
  const passwordHash = hashPassword(password);
  const params = {
    TableName: USERS_TABLE,
    Item: { userId, name, passwordHash },
  };
  try {
    const command = new PutCommand(params);
    await docClient.send(command);
    res.json({ userId, name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create user" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
