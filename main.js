const mqtt = require("mqtt");
const fs = require("fs");
require("dotenv").config();

const env = process.env;

const vehicleSn = "FDC123456789012345678901234567";

let options = {
  port: env.MQTT_BROKER_PORT,
  username: env.MQTT_BROKER_USERNAME,
  password: env.MQTT_BROKER_PASSWORD,
  ca: fs.readFileSync(env.MQTT_AUTH_CA),
  cert: fs.readFileSync(env.MQTT_AUTH_CERT),
  key: fs.readFileSync(env.MQTT_AUTH_KEY),
  timeout: 10,
};

const client = mqtt.connect("mqtts://" + env.MQTT_BROKER_HOST, options);

client.on("connect", function () {
  console.log("connected");

  client.subscribe(vehicleSn, (err) => {
    if (!err) {
      console.log("subscribed");
      // setInterval(() => {
      //   sendDoorLockCmd(client);
      // }, 10000);
    }
  });
});

client.on("error", function (error) {
  console.log("Can't connect " + error);
  process.exit(1);
});

client.on("message", function (topic, message) {
  console.log(message.toString());
  //   client.end();
});

const sendDoorLockCmd = (client) => {
  // randomly set cmd as lock or unlock
  const isToLock = Math.random() > 0.5 ? true : false;
  const message = {
    // timestamp: "20240905T053030Z",
    timestamp: new Date().toISOString(),
    vehicleId: vehicleSn,
    action: "doorLock",
    data: {
      cmd: isToLock ? "doorLock" : "doorUnlock",
    },
  };

  client.publish(
    vehicleSn + "/conn/remote-control/sreq/door-lock-unlock/v0",
    JSON.stringify(message)
  );
};
