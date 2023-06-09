var publishForm = document.getElementById("publishForm");
var privateChannelBtn = document.getElementById("privateChannelBtn");
var btnPrivateChannel = document.getElementById("joinPrivateChannelBtn");
let clientId;

publishForm.addEventListener("submit", function (e) {
  e.preventDefault();
  var topic = document.getElementById("topic").value;
  var message = clientId + ' : ' + document.getElementById("messagePub").value;
  document.getElementById("messagePub").value = '';
  fetch("/chat", {
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
    .catch((error) => console.error("Error:", error));
});

privateChannelBtn.addEventListener("click", function (e) {
  e.preventDefault();
  privateChannelBtn.textContent = 'Se déconnecter';
  var inputPrivateChannel = document.getElementById("privateTopicChannel");
  var labelPrivateChannel = document.getElementById("privateChannelLabel");
  if(inputPrivateChannel.hidden) {
    inputPrivateChannel.hidden = false;
    labelPrivateChannel.textContent = '';
    btnPrivateChannel.hidden = false;
  } else {
    privateChannelBtn.textContent = 'Canal privé';
    inputPrivateChannel.hidden = true;
    labelPrivateChannel.textContent = 'Vous êtes déconnecté du channel privé, vous êtes revenu sur le channel général';
    btnPrivateChannel.hidden = true;
    unsubscribeToTopic();
    document.querySelector("#topic").value = 'generalTopic';
    subscribeToTopic();
    document.getElementById("discussionLabel").textContent = 'Discussion';
  }
});

btnPrivateChannel.addEventListener("click", function (e) {
  e.preventDefault();
  var inputPrivateChannelTopic = document.getElementById("privateTopicChannel").value;
  unsubscribeToTopic();
  document.querySelector("#topic").value = inputPrivateChannelTopic;
  subscribeToTopic();
  document.getElementById("discussionLabel").textContent += ' (Vous êtes sur le channel '+ inputPrivateChannelTopic + ')';
});

let mqttClient;

window.addEventListener("load", async (event) => {
  const sessionData = await getSessionData();
  connectToBroker(sessionData);
  subscribeToTopic();
});

async function getSessionData() {
  const response = await fetch('/getsessiondata');
  const data = await response.json();
  return data;
}

function connectToBroker(sessionData = '') {
  if(!sessionData.user) {
    // sessionData.user.username = 'Anonymous';
    clientId = 'Anonymous-'+ Math.random().toString(36).substring(7);
  } else {
    clientId = sessionData.user.username;
  }

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
