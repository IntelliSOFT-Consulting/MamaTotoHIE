#!/bin/bash

if [ -n "$1" ]; then
    cd fhir-data-pipes
    docker compose -f docker/compose-controller-spark-sql-single.yaml $1 $2 $3
else
    cd fhir-data-pipes
    docker network create cloudbuild
    DWH_ROOT="$(pwd)/my-amazing-data" docker compose -f docker/compose-controller-spark-sql-single.yaml up -d --force-recreate
fi