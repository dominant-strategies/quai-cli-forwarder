import format from "pg-format";

export async function InsertBlockTableData(client, nodeInfo, blocks) {
  var values = [];
  for (var i = 0; i < blocks.length; i++) {
    var block = blocks[i];
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
    info.name,
    "",
    parseInt(info.context),
    info.height,
    hashrate,
  ];
  const insertQuery = format(
    "INSERT INTO node_info (location , http_port , ws_port , ip , name , enode , context , height, hashrate) VALUES (%L) ",
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
  )}, ${parseInt(info.ws)}, '${host}', '${info.name}', '', '', ${
    info.context
  }, ARRAY[${difficulty}])`;

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
  const transactions = block?.transactions;
  for (var i = 0; i < transactions; i++) {
    var transaction = transactions[i];
    var value = [
      transaction.blockNumber,
      transaction.to,
      transaction.from,
      block.timestamp,
      transaction.value,
      transaction.hash,
      "",
      JSON.stringify(transaction),
    ];
    values.push(value);
  }
  const insertQuery = format(
    "INSERT INTO transactions (block_number , to , from , timestamp , value , hash , contract_code , full_transaction) VALUES %L ",
    values
  );

  try {
    await client.query(insertQuery);
  } catch (err) {
    console.log(err);
  }
}
