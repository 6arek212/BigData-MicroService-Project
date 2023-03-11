



# Pizza Orders , Big Data And Microservices 


<img src="https://user-images.githubusercontent.com/10331972/224487463-e143ea77-5afa-4778-817c-fee5441737cd.png" title="dashboard">

#### A part of a university project

</br>

## Project Overview

A microservice project that receives pizza orders from a simulator and processes them to be visulized in dashboard, analytics, and search results

</br>

### Infrastructure

<img src="https://user-images.githubusercontent.com/10331972/224487482-d33a8fc4-870e-4a42-95e1-6784c564f609.png" title="Infrastructure">

</br>

### Pipeline

<img src="https://user-images.githubusercontent.com/10331972/224487490-920793ee-d935-4fa8-a381-38df294e58c3.png"  title="pipline">

## How To Run

`First run this command in all folders`

    npm install

<br/>

`Add an .env file in all folders which contains`

    STORES_TOPIC

    MONGODB_PW

    MONGODB_UR

    MONGODB_URL

    BIGML_API_KEY 

    BIGML_USERNAME

</br>

`Run Elasticsearch in Docker `

    docker network create elastic

    docker run --name elasticsearch --net elastic -p 9200:9200 -e discovery.type=single-node -e ES_JAVA_OPTS="-Xms1g -Xmx1g" -e xpack.security.enabled=false -it 
    docker.elastic.co/elasticsearch/elasticsearch:8.2.2

</br>


`Run Redis in Docker `

      docker run --name some-redis -d redis -p 6379:6379

</br>


`Run this command in application server folder and then in data producer folder`

    npm start

</br>





## What has been done ?

- ### Backend

    - **Redis** for caching the dashboard data
    - **MongoDb** to store the data for training the a machine learning model
    - **Elasticsearch** for a quick search queries
    - **Kafka** for passing the data between different applications
    - **Clustering**, Evrey instance of the application server will run NUM_CPU_CORES of processes
    - Data in json format
    - Clean Architecture
    - **BigML** API for training a **machine learning model**
    - **WebSocket** for live data emitting, Socketio / Socketio Cluster / Socketio Sticky
    - Restful API
    - Express
    - Built with **Horizontal Scalling** in mind



- ### Frontend

  - React App
  - Modren Design
  - Charts
  - Dashboard page
  - Search page 
  - Analytics page for machine learning data
  - Websocket connection
  - Http requests
    



</br>

## Demo

`version 2`

<img src="https://user-images.githubusercontent.com/10331972/224487524-6724c31b-4b10-4642-9343-44afafe6e95e.gif"  title="Dashboard in action 1">

`version 1`

<img src="https://user-images.githubusercontent.com/10331972/224487521-4b6f362a-1cc3-485a-bc68-74b56d93f77d.gif" title="Dashboard in action 1">

</br>

## Authors

* **Tarik Husin**  - linkedin -> https://www.linkedin.com/in/tarik-husin-706754184/
* **Wissam Kabha**  - github -> https://github.com/Wissam111
* **Ajwan Khori**  - github -> https://github.com/AjwanKhoury

</br>


## Issues Faced

- Kafka consumer receives data not in order

    - Fix: Just add to the producer a key for every message, then messages with the same key will be received in order

- Kafka dublicate messages

    - Fix: to be fixed 


- Redis Automic queries

    - Fix: Use lua scripts, Or redisClient.multi()


## References

- https://github.com/socketio/socket.io-sticky
- https://www.dataversity.net/how-to-overcome-data-order-issues-in-apache-kafka/
- https://www.npmjs.com/package/redis
- https://socket.io/docs/v4/cluster-adapter/
- https://www.elastic.co/guide/en/cloud/current/ec-getting-started-node-js.html