// import { Ed25519Keypair, JsonRpcProvider, Network, } from "@mysten/sui.js";
const { SuiClient, getFullnodeUrl } = require("@mysten/sui.js/client");
const { Ed25519Keypair } = require("@mysten/sui.js/keypairs/ed25519");
const { TransactionBlock } = require("@mysten/sui.js/transactions");
const { fromB64, toHEX, MIST_PER_SUI } = require("@mysten/sui.js/utils");
const {
  requestSuiFromFaucetV0,
  getFaucetHost,
} = require("@mysten/sui.js/faucet");

let contractAddress =
  "0xe2cf4b9f2345750a72ea5352d9b626d0d9c65abfb1a725f6d40dc009155d69e4";

async function main() {
  const sk = Uint8Array.from(
    fromB64("LFMmhrl8aoLlToemIiFLJ6+VfmlPLMS3lvJymclzxsA=")
  );

  const signer = Ed25519Keypair.fromSecretKey(sk);

  const client = new SuiClient({
    url: "https://fullnode.devnet.sui.io",
  });

  const beforeBalance = await client.getBalance({
    owner: signer.toSuiAddress(),
  });

  console.log("before balance", beforeBalance);

  const tx = new TransactionBlock();

  const vec = tx.makeMoveVec({
    objects: [
      tx.pure.address(
        "0x9c6a0771586036ac7837d349ed13e56fa2f3bcc81c0b8fbc7ed396b0630c71e6"
      ),
    ],
  });

  tx.moveCall({
    target: `0xe2cf4b9f2345750a72ea5352d9b626d0d9c65abfb1a725f6d40dc009155d69e4::devnet_nft::transfer`,
    // typeArguments: [
    //   // "0xe2cf4b9f2345750a72ea5352d9b626d0d9c65abfb1a725f6d40dc009155d69e4::devnet_nft::DevNetNFT",
    // ],
    arguments: [
      tx.object(
        "0xcee0511d32008df032c05e4ad4ab7694d130ca65157562977227343d5a1702b0"
      ),
      tx.pure.address(
        "0x9c6a0771586036ac7837d349ed13e56fa2f3bcc81c0b8fbc7ed396b0630c71e6"
      ),
    ],
  });

  const txnResponse = await client.devInspectTransactionBlock({
    transactionBlock: tx,
    sender: signer,
  });

  console.log("txnResponse: ", txnResponse);
}
main();
