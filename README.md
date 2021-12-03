# quai-cli-forwarder
CLI forwarder for the dashboard


Quai CLI Requirements:

1. Connect to each of the Quai Network nodes
2. Check the current head for each location (ex. Prime 2000, Region 1000, Zone 250) from the Postgres db
3. Download all blocks up until that height
4. Store downloaded blocks and transactions into the blocks and transactions table in Postgres respectively
5. Open WebSockets and retrieve newly mined blocks, put blocks and transactions into blocks and transactions table.
6. Monitor the node info and store node info in the node_info table. Node info should primarily contain:
    - hashrate
    - enode
    - height
    - context
    - name
    - ip
    - location
7. Monitor the peer info and trach the current head of all peers.