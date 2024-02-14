## Pharmaccess

This repository contains the code and artefacts for the Pharmaccess HIE



#### Components
1. OpenHIM
2. HAPI FHIR JPA Server
3. OpenHIM
4. OpenHIM Mediators



Pre-requisites

1. Docker - Instructions on how to install Docker can be found on the Docker website
            This repository relies heavily on Docker containers.

#### Setup Instructions

#### InstantHIE

1. Clone the repository

```git clone https://github.com/IntelliSOFT-Consulting/pharmaccess```

2. cd into the repository folder

```cd pharmaccess```


3. Use docker compose to start containers

```sudo ./start-hie.sh```


#### FHIR Datapipes

1. Clone the repository

```git clone https://github.com/IntelliSOFT-Consulting/pharmaccess```

2. cd into the repository folder

```cd pharmaccess```


3. Use docker compose to start containers

```sudo ./start-data-pipes.sh```


#### FHIR Gateway

1. Clone the repository

```git clone https://github.com/IntelliSOFT-Consulting/pharmaccess```

2. cd into the repository folder

```cd pharmaccess```


3. Use docker compose to start containers

```sudo ./start-gateway.sh```

#### Apache Superset

1. Clone the repository

```git clone https://github.com/IntelliSOFT-Consulting/pharmaccess```

2. cd into the repository folder

```cd pharmaccess```


3. Use docker compose to start containers

```sudo ./start-superset.sh```