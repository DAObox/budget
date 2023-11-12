import { BudgetCard } from "../components/BudgetCard";

export default function Home() {
  return (
    // <section className="flex flex-col items-center justify-center gap-4">
    //   <BudgetCard />
    //   <BudgetCard />
    //   <BudgetCard />
    //   <BudgetCard />
    //   <BudgetCard />
    //   <BudgetCard />
    // </section>

    <div id="NewRootRoot" className="flex flex-col w-full">
      <div className="bg-[#101010] flex flex-col justify-between h-[812px] shrink-0 items-center pt-[321px] pb-8">
        <img
          src="https://file.rendit.io/n/jqavy1CcE0owESKvTO7a.svg"
          alt="Logo"
          id="Logo"
        />
        <div className="text-sm font-['Poppins'] font-medium text-white">
          Welcome to payup mobile app
        </div>
      </div>
    </div>
  );
}
