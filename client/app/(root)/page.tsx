export default function Home() {
  return (
    <div className="flex justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          Track Pull Requests Like Never Before
        </h1>
        <p className="text-lg text-center sm:text-left max-w-lg mt-0">
          Stop losing track of pull requests. Get real-time visibility into your
          team&#39;s PR status, review progress, and merger history - all in one
          beautiful dashboard.
        </p>
      </main>
    </div>
  );
}
