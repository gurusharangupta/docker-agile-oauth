# docker-agile-oauth
 agile-oauth.jar has application properties changed with
 localhost:9092 -> kafka:9092

 The jar is built from agile-oauth-backend project

Run command "docker-compose up"

If any changes in files are made:

Run command "docker-compose up --build"


 These docker files will setup

 Container      Port(Host:Container)

Java            8080:8080
Websocket       8091:8091
Kafka               :9092
Zookeeper           :2181

