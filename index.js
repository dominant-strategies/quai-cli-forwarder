// Connect to WebSockets
// Download all blocks
// Upload to database
// Continue to monitor blocks

import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Client } = pkg;
import { FetchBlockHeight, GetMissingBlocks } from "./blocks.js";
import { InsertBlockTableData } from "./db.js";

var names = ["prime", "region-1", "region-2", "region-3"];
var nodes = {
  prime: {
    name: "prime",
    context: 0,
    http: "8546",
    ws: "8547",
    height: 0,
  },
  "region-1": {
    name: "region-1",
    context: 1,
    http: "8578",
    ws: "8579",
    height: 0,
  },
  "region-2": {
    name: "region-2",
    context: 1,
    http: "8580",
    ws: "8581",
    height: 0,
  },
  "region-3": {
    name: "region-3",
    context: 1,
    http: "8674",
    ws: "8675",
    height: 0,
  },
  // "zone-1-1": {
  //   name: "zone-1-1",
  //   context: 2,
  //   http: "8546",
  //   ws: "8547",
  // },
  // "zone-1-2": {
  //   name: "zone-1-2",
  //   context: 2,
  //   http: "8546",
  //   ws: "8547",
  // },
  // "zone-1-3": {
  //   name: "zone-1-3",
  //   context: 2,
  //   http: "8546",
  //   ws: "8547",
  // },
  // "zone-2-1": {
  //   name: "zone-2-1",
  //   context: 2,
  //   http: "8546",
  //   ws: "8547",
  // },
  // "zone-2-2": {
  //   name: "zone-2-2",
  //   context: 2,
  //   http: "8546",
  //   ws: "8547",
  // },
  // "zone-2-3": {
  //   name: "zone-2-3",
  //   context: 2,
  //   http: "8546",
  //   ws: "8547",
  // },
  // "zone-3-1": {
  //   name: "zone-3-1",
  //   context: 2,
  //   http: "8546",
  //   ws: "8547",
  // },
  // "zone-3-2": {
  //   name: "zone-3-2",
  //   context: 2,
  //   http: "8546",
  //   ws: "8547",
  // },
  // "zone-3-3": {
  //   name: "zone-3-3",
  //   context: 2,
  //   http: "8546",
  //   ws: "8547",
  // },
};

async function initApp() {
  const client = new Client();
  await client.connect();

  const nodeHost = process.env.NODE_HOST;

  const query = "SELECT * FROM node_info ";
  var rows = [];
  try {
    const res = await client.query(query);
    rows = res.rows;
  } catch (err) {
    console.log(err.stack);
  }

  for (var i = 0; i < rows.length; i++) {
    var location = rows[i].location;
    var height = rows[i].height;
    nodes[location].height = height;
  }

  for (var i = 0; i < names.length; i++) {
    var nodeInfo = nodes[names[i]];
    var currHeight = await FetchBlockHeight(nodeHost, nodeInfo.http);
    if (nodeInfo.height < currHeight) {
      var blocks = await GetMissingBlocks(client, nodeHost, nodeInfo, currHeight);
      InsertBlockTableData(client, nodeInfo, blocks);
    }
  }
  process.exit();
}

initApp();
