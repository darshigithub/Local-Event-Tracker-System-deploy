#!/bin/bash
set -e

echo "Initializing PostgreSQL databases..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE $EVENT_DB;
    CREATE DATABASE $INVENTORY_DB;
EOSQL