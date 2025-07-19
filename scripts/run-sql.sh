#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: ./scripts/run-sql.sh <relative-sql-path-in-migrations> [env-file]"
  exit 1
fi

SQL_FILE="./migrations/$1"
ENV_FILE=${2:-".env.development"}

if [ ! -f "$SQL_FILE" ]; then
  echo "SQL file not found: $SQL_FILE"
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "Env file not found: $ENV_FILE"
  exit 1
fi

echo "Running migration with env: $ENV_FILE"

dotenv -e "$ENV_FILE" -- bash -c "docker exec -i postgre psql -U \$DB_USER -d \$DB_NAME -f - < \"$SQL_FILE\""
