import { ConnectButton } from "../../components/ConnectButton";
import { MintNfts } from "../../components/MintNfts";
import { WriteContractPrepared } from "../../components/WriteContractPrepared";

export function Mint() {
  return (
    <>
      <ConnectButton />
      <h1>Mint Your NFTs!</h1>
      <MintNfts />
      {/* <WriteContractPrepared /> */}
    </>
  );
}

export default Mint;
