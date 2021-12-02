import axios from "axios";
import { InsertBlockTableData } from "./db.js";

// FetchBlockHeight retrieves the block height for a given node.
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

// GetMissingBlock pushes all blocks to the database between the known height and actual height.
export async function GetMissingBlocks(client, host, info, currHeight) {
  try {
    var height = info.height;
    if (info.height == undefined) {
      height = 0;
    }
    const dbHeight = parseInt(height);
    const port = info.http;

    var blocks = [];
    for (var i = dbHeight + 1; i < currHeight; i++) {
      var num = i.toString(16);
      var block = await GetBlockByNumber(host, port, num);
      blocks.push(block);
      if (blocks.length > 100) {
        console.log("Inserting batch of 100 blocks");
        await InsertBlockTableData(client, info, blocks);
        blocks = [];
      }
    }
    if (blocks.length > 0) {
      await InsertBlockTableData(client, info, blocks);
    }
  } catch (err) {
    console.log(err);
  }
}

// GetBlockByNumber retrieves the block by a number from a given host and port.
export async function GetBlockByNumber(host, port, num) {
  try {
    var response = await axios.post(
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
    return response.data.result;
  } catch (err) {
    return err;
  }
}
