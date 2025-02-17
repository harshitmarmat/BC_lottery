const fs = require("fs")
const path = require("path");
const solc = require("solc");

const filePath = path.join(__dirname,'contracts','Lottery.sol');

const source = fs.readFileSync(filePath, 'utf8');

const res = solc.compile(source,1).contracts[":Lottery"]
console.log(res);

module.exports = res
