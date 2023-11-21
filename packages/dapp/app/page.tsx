import { PayupLogo } from "@/components/icons";
import { title } from "@/components/primitives";
import { LoginButton } from "@/components/login-button";
import { EaseInDiv } from "@/components/framer";

export default async function Home() {
  await new Promise((resolve) => setTimeout(resolve, 6000));

  return (
    <EaseInDiv className="flex flex-col items-center justify-between h-full px-6 pt-48 py-14">
      <div className="flex flex-col items-center justify-center w-full pb-4 align-middle">
        <PayupLogo />
        <h1 className={title({ class: "mt-12" })}> Scalable Secure </h1>
        <h1 className={title()}> Frictionless </h1>
        <h2 className="mt-4">DAO payments without all the bloodclart votes</h2>
      </div>
      <LoginButton />
    </EaseInDiv>
  );
}
