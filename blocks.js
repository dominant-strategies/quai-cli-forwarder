import axios from "axios";
import { GetMissingTransactions } from "./transactions.js";

export async function FetchBlockHeight(host, port) {
  try {
    let response = await axios.post(
      "http://" + host + ":" + port,
      {
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: [],
        id: 1,
      },
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );

    return parseInt(response.data.result, 16);
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function GetMissingBlocks(client, host, info, currHeight) {
  const dbHeight = info.height;
  const location = info.location;
  const port = info.http;

  var blocks = [];
  var transactions = [];

  for (var i = dbHeight + 1; i < currHeight; i++) {
    var num = i.toString(16);
    try {
      let response = await axios.post(
        "http://" + host + ":" + port,
        {
          jsonrpc: "2.0",
          method: "eth_getBlockByNumber",
          params: ["0x" + num, true],
          id: 1,
        },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      blocks.push(response.data.result);
      transactions.push(response.data.result.transactions)
    } catch (err) {
      console.log(err);
    }
  }
  await GetMissingTransactions(client, info, transactions);
  return blocks;
}
