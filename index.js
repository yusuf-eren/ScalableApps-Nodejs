const http = require('http');
const cluster = require('cluster');
const cpus = require('os').cpus().length;

if (cluster.isMaster) {
  console.log('this is the master process: ', process.pid);
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`worker process ${process.pid} had died`);
    console.log(`only ${Object.keys(cluster.workers).length} `);
  });
} else {
  http
    .createServer((req, res) => {
      res.end(`process ${process.pid}`);
      if (req.url === '/kill') {
        process.exit();
      } else if(req.url === "/") {
        console.log(`serving from ${process.pid}...`);
      }
    })
    .listen(3000);
}
