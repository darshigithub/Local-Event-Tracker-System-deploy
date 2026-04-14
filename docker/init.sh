#!/bin/bash
set -e

echo "Initializing PostgreSQL databases..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL

-- Create Event DB if not exists
DO
\$do\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = '${EVENT_DB}') THEN
      CREATE DATABASE "${EVENT_DB}";
   END IF;
END
\$do\$;

-- Create Inventory DB if not exists
DO
\$do\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = '${INVENTORY_DB}') THEN
      CREATE DATABASE "${INVENTORY_DB}";
   END IF;
END
\$do\$;

EOSQL

echo "Databases are ready!"