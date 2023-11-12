"use client";
import { title, subtitle } from "@/components/primitives";

export function Hero() {
  return (
    <div className="inline-block max-w-lg text-center justify-center">
      <h1 className={title()}>DAOBox&nbsp;</h1>
      <h1 className={title({ color: "violet" })}>Budgets&nbsp;</h1>
      <br />
      <h1 className={title()}> Scalable Secure Frictionless </h1>
      <h2 className={subtitle({ class: "mt-4" })}>
        DAO payments without all the votes
      </h2>
    </div>
  );
}
