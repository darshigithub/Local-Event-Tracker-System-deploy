#!/bin/bash

echo "Creating databases..."

psql -U "$POSTGRES_USER" <<EOF
CREATE DATABASE event_management_db;
CREATE DATABASE inventory_db;
EOF