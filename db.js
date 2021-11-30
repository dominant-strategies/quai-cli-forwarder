import format from "pg-format";

export async function InsertBlockTableData(client, nodeInfo, blocks) {
  var values = [];
  for (var i = 0; i < blocks.length; i++) {
    var block = blocks[i]
    delete block["transactions"]
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
      JSON.stringify(block)
    ];
    values.push(value)
  }

  const insertQuery = format("INSERT INTO blocks (context , location , number , timestamp , gas_limit , gas_used , difficulty , network_difficulty , hash , header) VALUES %L ", values)

  try {
    // var result= await client.query(insertQuery);
  } catch (err){
    console.log(err)
  }
  // console.log(result)
}

export async function InsertTransactionsTableData(client, nodeInfo, transactions) {
  
}
