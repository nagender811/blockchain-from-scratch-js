const hexToBinary = require("hex-to-binary");
const { GENESIS_DATA, MINE_RATE } = require("./config");
const { cryptoHash } = require("./crypto-hash");

class Block {
  constructor({ timestamp, prevHash, hash, data, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.data = data;
    this.prevHash = prevHash;
    this.hash = hash;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }
  static genesis() {
    return new this(GENESIS_DATA);
  }
  static mineBlock({ prevBlock, data }) {
    let hash, timestamp;
    const prevHash = prevBlock.hash;
    let { difficulty } = prevBlock;
    let nonce = 0;
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({
        originalBlock: prevBlock,
        timestamp,
      });
      hash = cryptoHash(timestamp, prevHash, data, nonce, difficulty);
    } while (
      hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    );
    return new this({
      timestamp,
      prevHash,
      data,
      difficulty,
      nonce,
      hash,
    });
  }

  static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock;
    if (difficulty < 1) return 1;
    const difference = timestamp - originalBlock.timestamp;
    if (difference > MINE_RATE) return difficulty - 1;
    return difficulty + 1;
  }
}

const block1 = new Block({
  timestamp: "16/12/25",
  prevHash: "0x123",
  hash: "0x1ab",
  data: "Hello",
});
// console.log(block1);

// const genesis = Block.genesis();
// console.log(genesis);

// const result = Block.mineBlock({ prevBlock: block1, data: "block2" });
// console.log(result);

module.exports = { Block };
