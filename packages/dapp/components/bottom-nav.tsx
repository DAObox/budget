import { Button } from "@nextui-org/button";
import { ClockIcon, HomeIcon, QRCodeIcon } from "./icons";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/iy0yPzxXKCr
 */
export function BottomNav() {
  return (
    <section className="fixed inset-x-0 bottom-0 flex items-center justify-around h-16 bg-white border-t-2 shadow-lg dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
      <Button isIconOnly variant="light" aria-label="Home">
        <HomeIcon />
      </Button>
      <Button isIconOnly variant="light" aria-label="Home">
        <ClockIcon />
      </Button>
      <Button
        isIconOnly
        radius="full"
        variant="ghost"
        color="default"
        aria-label="QR-Code"
        size="lg"
      >
        <QRCodeIcon width={28} height={28} size={28} />
      </Button>
      <Button isIconOnly variant="light" aria-label="Wallet">
        <svg
          className="w-6 h-6 text-zinc-500 dark:text-zinc-400"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
          <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
        </svg>
      </Button>
      <Button isIconOnly variant="light" aria-label="User">
        <svg
          className="w-6 h-6 text-zinc-500 dark:text-zinc-400"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </Button>
    </section>
  );
}
