"use client";

import { useState, useEffect, useMemo } from "react";
import Countdown from "react-countdown";
import { BaseError } from "viem";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { nftABI } from "../generated";
import { useDebounce } from "../hooks/useDebounce";
import { stringify } from "../utils/stringify";

export function MintNfts() {
  const [count, setCount] = useState("");
  const [start, setStart] = useState(false);
  const debouncedCount = useDebounce(count);

  const { config } = usePrepareContractWrite({
    address: "0x99701229936735d642433b4d73dbb6cbb66a4422",
    abi: nftABI,
    functionName: "mint",
    enabled: Boolean(debouncedCount),
    args: [BigInt(debouncedCount)],
  });
  const { write, data, error, isLoading, isError } = useContractWrite(config);
  const {
    data: receipt,
    isLoading: isPending,
    isSuccess,
    isError: transactionIsError,
  } = useWaitForTransaction({ hash: data?.hash });

  useEffect(() => {
    if (isSuccess || transactionIsError) {
    }
    setCount("");
  }, [isSuccess]);

  const counter = useMemo(
    () => (
      <Countdown date={Date.now() + 30000} onComplete={() => setStart(true)} />
    ),
    []
  );

  return (
    <>
      {counter}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          write?.();
        }}
      >
        <input
          placeholder="token amount"
          onChange={(e) => setCount(e.target.value)}
          value={count}
        />
        <button disabled={!start || !write} type="submit">
          Mint
        </button>
      </form>

      {isLoading && <div>Check wallet...</div>}
      {isPending && <div>Transaction pending...</div>}
      {isSuccess && (
        <>
          <div>Transaction Hash: {data?.hash}</div>
          <div>
            Transaction Receipt: <pre>{stringify(receipt, null, 2)}</pre>
          </div>
        </>
      )}
      {isError && <div>{(error as BaseError)?.shortMessage}</div>}
    </>
  );
}
