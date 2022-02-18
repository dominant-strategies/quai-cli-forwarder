include config.env

run-background:
	@PGUSER=$(PGUSER) PGHOST=$(PGHOST) PGPASSWORD=$(PGPASS) PGDATABASE=$(PGDATABASE) PGPORT=$(PGPORT) NODE_HOST=$(NODEHOST) nohup node index.js >> output.log 2>&1 &
	@echo $! > save_pid.txt

stop:
	@if pgrep quai-cli; then pkill -f quai-cli; fi
	@echo "Stopping all instances of go-quai"