import WebSocket from "ws";
import { GetBlockByNumber } from "./blocks.js";
import {
  InsertBlockTableData,
  InsertNodeTableData,
  InsertTransactionsTableData,
  InsertPeerTableData,
  UpdateNodeTableData,
  UpdatePeerTableData,
} from "./db.js";

const chainSlugs = [
  "prime",
  "region-1",
  "region-2",
  "region-3",
  "zone-1-1",
  "zone-1-2",
  "zone-1-3",
  "zone-2-1",
  "zone-2-2",
  "zone-2-3",
  "zone-3-1",
  "zone-3-2",
  "zone-3-3",
];
const positions = [0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2];

var Sockets = [];

// CreateSockets opens the WebSockets to the Quai Node
// and pushes data to the database upon new blocks being found.
export async function CreateSockets(client, host, info) {
  console.log("createSockets");

  const handleConnection = (connection, client, info) => {
    const subscribeData = {
      id: 1,
      method: "eth_subscribe",
      params: ["newHeads"],
    };

    connection.onopen = () => {
      console.log(
        "Successfully connected to the echo websocket server of",
        info.name
      );
      connection.send(JSON.stringify(subscribeData));
      Sockets.push(connection);
    };

    connection.onmessage = async (event) => {
      var data = JSON.parse(event.data);
      if (data.result != undefined) {
        console.log(
          "Subscribed to the newHeader subscription over the websockets for",
          info.name
        );
      }

      if (data.params != undefined) {
        var latestNumber = data.params.result.number[info.context];
        var formattedNum = latestNumber.toString(16);
        console.log("latest block for", info.name, latestNumber);

        // Block actions
        // console.log({ host, info: info.http, formattedNum });
        var block = await GetBlockByNumber(host, info.http, formattedNum);
        // console.log({ client, info, host });
        // console.log({ block });
        if (block?.transactions?.length > 0) {
          await InsertTransactionsTableData(client, [block]);
        }
        await InsertBlockTableData(client, info, [block]);
        // const node_query = `SELECT * FROM node_info WHERE location LIKE '${info.name}'`;
        // const node_infos = await client.query(node_query);
        // if (node_infos?.rows?.length > 0)
        //   await UpdateNodeTableData(client, info, block?.hash);
        // else await InsertNodeTableData(client, info, host, block?.hash);
        // const peer_query = `SELECT * FROM peer_info WHERE location LIKE '${info.name}'`;
        // const peer_infos = await client.query(peer_query);
        // if (peer_infos?.rows?.length > 0)
        //   await UpdatePeerTableData(client, info, block?.difficulty);
        // else await InsertPeerTableData(client, info, host, block?.difficulty);
      }
    };

    connection.onclose = () => {
      console.log("Websocket connection closed");
    };

    connection.onerror = (err) => {
      console.log("There was an error connecting to the websockets", err);
    };
  };

  let url = "ws://" + host + ":" + info.ws;
  console.log({ url });
  var connection = new WebSocket(url);
  handleConnection(connection, client, info);
}
