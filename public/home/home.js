var publishForm = document.getElementById("publishForm");

publishForm.addEventListener("submit", function (e) {
  e.preventDefault();
  var topic = document.getElementById("topic").value;
  var message = document.getElementById("messagePub").value;
  document.getElementById("messagePub").value = '';
  fetch("/publisher", {
    method: "POST",
    body: JSON.stringify({
      topic: topic,
      message: message,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    })
    .catch((error) => console.error("Error:", error));
});

let mqttClient;

window.addEventListener("load", (event) => {
  connectToBroker();
  subscribeToTopic();
});

function connectToBroker() {
  const clientId = "client" + Math.random().toString(36).substring(7);

  const host = "wss://fce85f7acde44e06b48fc42411abf0e8.s2.eu.hivemq.cloud:8884/mqtt"; // Websocket pour connecter le client à mon broker

  const options = {
    username: "mkhalouk",
    password: "mkhalouk",
    keepalive: 60,
    clientId: clientId,
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
  };

  mqttClient = mqtt.connect(host, options);

  mqttClient.on("error", (err) => {
    console.log("Error: ", err);
    mqttClient.end();
  });

  mqttClient.on("reconnect", () => {
    console.log("Reconnecting...");
  });

  mqttClient.on("connect", () => {
    console.log("Client connected:" + clientId);
  });

  // Received
  mqttClient.on("message", (topic, message, packet) => {
    console.log(
      "Received Message: " + message.toString() + "\nOn topic: " + topic
    );
    const messageTextArea = document.querySelector("#messageSub");
    messageTextArea.value += message + "\r\n";
  });
}

function subscribeToTopic() {
  const topic = document.querySelector("#topic").value.trim();
  console.log(`Subscribing to Topic: ${topic}`);

  mqttClient.subscribe(topic, { qos: 0 });
}

function unsubscribeToTopic() {
  const topic = document.querySelector("#topic").value.trim();
  console.log(`Unsubscribing to Topic: ${topic}`);

  mqttClient.unsubscribe(topic, { qos: 0 });
}
