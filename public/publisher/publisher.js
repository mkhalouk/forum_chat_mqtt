var publishForm = document.getElementById("publishForm");

publishForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  var topic = document.getElementById("topic").value;
  var message = document.getElementById("message").value;
  document.getElementById("message").value = '';
  const messageTextArea = document.querySelector("#messageSub");
  messageTextArea.value += 'Vous : ' + message + "\r\n";

  const sessionData = await getSessionData();
  const sender = sessionData.user.username;

  fetch("/publisher", {
    method: "POST",
    body: JSON.stringify({
      topic: topic,
      message: message,
      sender: sender,
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

// receive the msgs
let mqttClient;

window.addEventListener("load", async (event) => {
  connectToBroker();
  const sessionData = await getSessionData();
  if(sessionData.user) {
    subscribeToTopic(sessionData.user.topic_token);
  }
});

window.addEventListener("beforeunload", async (event) => {
  const sessionData = await getSessionData();
  if(sessionData.user) {
    unsubscribeToTopic(sessionData.user.topic_token);
  }
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
    const sender = topic.split("/")[1];
    messageTextArea.value += sender + ' : ' + message + "\r\n";
    console.log(packet)
  });
}

function subscribeToTopic(topic) {
  if(topic) {
    console.log(`Subscribing to Topic: ${topic}`);
    mqttClient.subscribe(topic, { qos: 0 });
  }
}

function unsubscribeToTopic(topic) {
  if(topic) {
    console.log(`Unsubscribing from Topic: ${topic}`);
    mqttClient.unsubscribe(topic, { qos: 0 });
  }
}

async function getSessionData() {
  const response = await fetch("/getsessiondata");
  const data = await response.json();
  return data;
}