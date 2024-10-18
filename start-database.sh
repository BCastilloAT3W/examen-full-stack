#!/bin/bash

set -eo pipefail

DB_PASSWORD="${MYSQL_ROOT_PASSWORD:=123}"
DB_NAME="${MYSQL_DATABASE:=crm}"
DB_PORT="${MYSQL_PORT:=3306}"
DB_HOST="${MYSQL_HOST:=localhost}"

MYSQL_CONTAINER=$(docker run \
  -e MYSQL_DATABASE=${DB_NAME} \
  -e MYSQL_ROOT_PASSWORD=${DB_PASSWORD} \
  -p ${DB_PORT}:3306 \
  -d mysql:latest \
  --max-connections=1000)

echo "MySQL container started with ID: $MYSQL_CONTAINER"
echo "Waiting for MySQL to be ready..."
until docker exec $MYSQL_CONTAINER mysql --user="root" --password="${DB_PASSWORD}" --host="${DB_HOST}" --execute="SELECT 1" &> /dev/null; do
    echo "MySQL is still initializing - sleeping"
    sleep 1
done
echo "MySQL is up and ready for connections!"
