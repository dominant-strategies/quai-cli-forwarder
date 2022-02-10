import format from "pg-format";
import { GetChainfromAddress } from "./transactions.js";

export const SHARDED_ADDRESS = {
  prime: "Prime",
  "region-1": "Cyprus",
  "region-2": "Paxos",
  "region-3": "Hydra",
  "zone-1-1": "Cyprus One",
  "zone-1-2": "Cyprus Two",
  "zone-1-3": "Cyprus Three",
  "zone-2-1": "Paxos One",
  "zone-2-2": "Paxos Two",
  "zone-2-3": "Paxos Three",
  "zone-3-1": "Hydra One",
  "zone-3-2": "Hydra Two",
  "zone-3-3": "Hydra Three",
};

export async function InsertBlockTableData(client, nodeInfo, blocks) {
  var values = [];
  for (var i = 0; i < blocks.length; i++) {
    var block = blocks[i];
    if (block.number == undefined) {
      print("here");
    }
    delete block["transactions"];
    var value = [
      nodeInfo.context,
      nodeInfo.name,
      block.number.toString(),
      block.timestamp,
      block.gasLimit.toString(),
      block.gasUsed.toString(),
      block.difficulty.toString(),
      block.totalDifficulty.toString(),
      block.hash,
      JSON.stringify(block),
    ];
    values.push(value);
  }

  const insertQuery = format(
    "INSERT INTO blocks (context , location , number , timestamp , gas_limit , gas_used , difficulty , network_difficulty , hash , header) VALUES %L ",
    values
  );

  try {
    await client.query(insertQuery);
  } catch (err) {
    console.log(err);
  }
}

export async function InsertNodeTableData(client, info, host, hashrate) {
  const value = [
    info.name,
    parseInt(info.http),
    parseInt(info.ws),
    host,
    "Geth/v1.5.0-unstable/linux/go 1.6",
    "enode://44826a5d6a55f88a18298bca4773fca5749cdc3a5c9f308aa7d810e9b31123f3e7c5fba0b1d70aac5308426f47df2a128a6747040a3815cc7dd7167d03be320d@[::]:30303",
    info.name.split("-")[0].toUpperCase(),
    info.height,
    hashrate,
  ];
  const insertQuery = format(
    "INSERT INTO node_info (location , http_port , ws_port , ip , name , enode , context , height, hashrate) VALUES %L ",
    value
  );
  try {
    await client.query(insertQuery);
  } catch (err) {
    console.log(err);
  }
}

export async function UpdateNodeTableData(client, info, hashrate) {
  const updateQuery = format(
    "UPDATE node_info SET height=%L, hashrate=%L WHERE location LIKE %L",
    info.height,
    hashrate,
    info.name
  );

  try {
    await client.query(updateQuery);
  } catch (err) {
    console.log(err);
  }
}

export async function InsertPeerTableData(client, info, host, difficulty) {
  const insertQuery = `INSERT INTO peer_info VALUES ('${info.name}', ${parseInt(
    info.http
  )}, ${parseInt(
    info.ws
  )}, '${host}', 'Geth/v1.5.0-unstable/linux/go 1.6', 'enode://44826a5d6a55f88a18298bca4773fca5749cdc3a5c9f308aa7d810e9b31123f3e7c5fba0b1d70aac5308426f47df2a128a6747040a3815cc7dd7167d03be320d@[::]:30303', '', ${info.name
    .split("-")[0]
    .toUpperCase()}, ARRAY[${difficulty}])`;

  try {
    await client.query(insertQuery);
  } catch (err) {
    console.log(err);
  }
}

export async function UpdatePeerTableData(client, info, difficulty) {
  // const updateQuery = format(
  //   "UPDATE peer_info SET current_difficulty=%L WHERE location LIKE %L",
  //   parseInt(difficulty),
  //   info.name
  // );
  const updateQuery = `UPDATE peer_info SET current_difficulty=ARRAY[${difficulty}] WHERE location LIKE '${info.name}'`;
  try {
    await client.query(updateQuery);
  } catch (err) {
    console.log(err);
  }
}

export async function InsertTransactionsTableData(client, block) {
  var values = [];
  const transactions = block[0]?.transactions;
  for (var i = 0; i < transactions.length; i++) {
    var transaction = transactions[i];
    var value = [
      parseInt(transaction.blockNumber, 16),
      transaction.to,
      transaction.from,
      block[0].timestamp,
      parseInt(transaction.value, 16),
      transaction.hash,
      JSON.stringify(""),
      JSON.stringify(transaction),
      await GetChainfromAddress(transaction.to),
      await GetChainfromAddress(transaction.from),
    ];
    values.push(value);
  }
  const insertQuery = format(
    "INSERT INTO transactions (block_number , to_addr , from_addr , tx_time , tx_value , hash , contract_code , full_transaction, to_location, from_location) VALUES %L ",
    values
  );

  try {
    await client.query(insertQuery);
  } catch (err) {
    console.log(err);
  }
}
