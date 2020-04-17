const debug = require("debug")("raft"),
  argv = require("argh").argv,
  RaftIO = require("../"), // require("raft-socket.io")
  Log = require("../log"); // require("raft-socket.io/log");
//
// We're going to start with a static list of servers. A minimum cluster size is
// 4 as that only requires majority of 3 servers to have a new leader to be
// assigned. This allows the failure of one single server.
//
const ports = [8081, 8082, 8083];

//
// The port number of this Node process.
//
var port = +argv.port || ports[0];

//
// Now that we have all our variables we can safely start up our server with our
// assigned port number.
//
const raft = new RaftIO("http://127.0.0.1:" + port, {
  "election min": "1s",
  "election max": "5s",
  heartbeat: "1s",
  Log,
  path: "./db/" + port
});

raft.on("heartbeat timeout", function () {
  debug("heart beat timeout, starting election");
});

raft
  .on("term change", function (to, from) {
    debug("we're now running on term %s -- was %s", to, from);
  })
  .on("leader change", function (to, from) {
    debug("we have a new leader to: %s -- was %s", to, from);
  })
  .on("state change", function (to, from) {
    debug(
      "we have a new state to: %s -- was %s",
      RaftIO.states[to],
      RaftIO.states[from]
    );
  });

raft.on("leader", function () {
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  console.log("I am elected as LEADER");
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
});

raft.on("candidate", function () {
  console.log("----------------------------------");
  console.log("I am starting as candidate");
  console.log("----------------------------------");
});

//
// Join in other nodes so they start searching for each other.
//
ports.forEach(nr => {
  if (!nr || port === nr) return;

  raft.join("http://127.0.0.1:" + nr);
});
