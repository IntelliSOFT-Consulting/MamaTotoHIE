#!/bin/bash

if [ -n "$1" ]; then
    docker compose -f hie/docker-compose.yml $1 $2 $3
else
    docker compose -f hie/docker-compose.yml up -d --force-recreate
fi