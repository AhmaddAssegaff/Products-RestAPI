#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: ./scripts/create-migration.sh <table_name>"
  exit 1
fi

MIGRATIONS_DIR="./migrations"
DATE=$(date +"%Y_%m_%d")
NAME=$1

# Hitung jumlah folder yang sudah ada
COUNT=$(find "$MIGRATIONS_DIR" -mindepth 1 -maxdepth 1 -type d | wc -l)
NEXT_NUMBER=$(printf "%02d" $((COUNT + 1)))

FOLDER_NAME="${NEXT_NUMBER}_table_${NAME}"

mkdir -p "${MIGRATIONS_DIR}/${FOLDER_NAME}"

UP_FILE="${MIGRATIONS_DIR}/${FOLDER_NAME}/${DATE}_${NAME}.up.sql"
DOWN_FILE="${MIGRATIONS_DIR}/${FOLDER_NAME}/${DATE}_${NAME}.down.sql"

cat <<EOL > "$UP_FILE"
CREATE TABLE IF NOT EXISTS ${NAME} (

);

EOL

cat <<EOL > "$DOWN_FILE"
DROP TABLE IF EXISTS ${NAME};

EOL

echo "✅ Migration created at ${MIGRATIONS_DIR}/${FOLDER_NAME}"
