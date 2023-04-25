const mqttService = require("../service/mqttService");

// Broker URL
const MQTT_HOST = 'fce85f7acde44e06b48fc42411abf0e8.s2.eu.hivemq.cloud'; // Compte créé sur HiveMQ Cloud

var mqttClient = new mqttService(MQTT_HOST);
mqttClient.connect();

exports.getHomePage = async function (req, res) {
  try {
    res.render("pages/home");
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};

exports.publishMQTTMessage = async function (req, res) {
  try {
    const topic = req.body.topic;
    const message = req.body.message;

    console.log(`Request Topic :: ${topic}`);
    console.log(`Request Message :: ${message}`);

    mqttClient.publish(topic, message, {});
    res
      .status(200)
      .json({ status: "200", message: "Sucessfully published MQTT Message" });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
