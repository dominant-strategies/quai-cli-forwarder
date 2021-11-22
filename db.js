import format from "pg-format";

export async function InsertBlockTableData(client, blocks) {
  client.query(
    format(
      "INSERT INTO blocks (context, location, number, timestamp, gas_limit, gas_used, difficulty, network_difficulty, hash, header) VALUES %L",
      values
    ),
    [],
    (err, result) => {
      console.log(err);
      console.log(result);
    }
  );
}
