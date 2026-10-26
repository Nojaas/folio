"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center gap-5 px-2.5 pb-2.5 text-center sm:gap-6">
      <h1 className="text-base font-medium tracking-tight text-muted-foreground sm:text-lg">
        Something went wrong.
      </h1>
      <button
        type="button"
        onClick={reset}
        className="text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
      >
        Try again
      </button>
    </main>
  );
}
