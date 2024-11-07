# Pharmaccess

This repository contains the code and artefacts for the MamaToto HIE

## Components

Based on the Instant v2 Packaging, developed by Jembi Systems, the system is contains the following components;

1. OpenHIM
2. HAPI FHIR JPA Server
3. OpenHIM Mediators
4. Keycloak
5. Nginx Proxy

## Pre-requisites

1. Docker - Instructions on how to install Docker can be found on the Docker website
            This repository relies heavily on Docker containers.

2. Instant v2 CLI - Installation instructions [here](https://jembi.gitbook.io/instant-v2/getting-started/quick-start)

## Setup Instructions

Simply run

`instant project up`

## Running The Instant HIE

1. Clone the repository

    ```git clone https://github.com/PharmAccess/MamaToto-HIE.git```

2. cd into the repository folder

    ```cd MamaToto-HIE```

3. create a .env file from the .env.example file and modify the values as needed

    ```bash
    cp ./hie/.env.example ./hie/.env
    cp ./hie/mediators/.env.example ./hie/mediators/.env
    ```

4. Use docker compose to start containers

    ```sudo ./start-hie.sh```
