const mqtt = require("mqtt");

class MQTTService {
  constructor(host, messageCallback) {
    this.mqttClient = null;
    this.host = host;
    this.messageCallback = messageCallback;
  }

  connect() {
    const MQTT_HOST = 'fce85f7acde44e06b48fc42411abf0e8.s2.eu.hivemq.cloud';
    const MQTT_PORT = 8883;
    const MQTT_PROTOCOL = 'mqtts';
    const MQTT_USERNAME = 'mkhalouk';
    const MQTT_PASSWORD = 'mkhalouk';

    const mqttOptions = {
      host: MQTT_HOST,
      port: MQTT_PORT,
      protocol: MQTT_PROTOCOL,
      username: MQTT_USERNAME,
      password: MQTT_PASSWORD
    };
    this.mqttClient = mqtt.connect(mqttOptions);

    // MQTT Callback for 'error' event
    this.mqttClient.on("error", (err) => {
      console.log(err);
      this.mqttClient.end();
    });

    // this.mqttClient.on("connect", () => {
    //   console.log(`MQTT client connected`);
    // });

    this.mqttClient.on("message", function (topic, message) {
      console.log(message.toString());
      if (this.messageCallback) this.messageCallback(topic, message);
    });

    this.mqttClient.on("close", () => {
      console.log(`MQTT client disconnected`);
    });
  }

  publish(topic, message, options) {
    this.mqttClient.publish(topic, message);
  }

  subscribe(topic, options) {
    this.mqttClient.subscribe(topic, options);
  }
}

module.exports = MQTTService;
