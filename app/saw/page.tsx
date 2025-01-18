"use client";
import { useDSSInput } from "@/components/hooks/useDSSInput";

export default function SawPage() {
  const { Component: InputDSS } = useDSSInput();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="text-2xl text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          Simple Additive Weighting (SAW) Content
        </div>
        <InputDSS />
      </main>
    </div>
  );
}
