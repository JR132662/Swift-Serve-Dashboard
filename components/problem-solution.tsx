"use client";

export default function ProblemSolution() {
  return (
    <section className="w-full py-16" style={{ background: 'var(--card)', color: 'var(--card-foreground)' }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-4xl leading-tight">The challenge restaurants face</h1>
          <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            Restaurants need fast, accurate visibility into guest flow and service performance — but current approaches are slow, expensive, or invasive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Common problems</h3>
            <ul className="space-y-4 text-neutral-700 dark:text-neutral-300">
              <li>
                <strong className="mr-2">No real-time visibility:</strong>
                Managers rely on spot checks and manual reporting, which miss transient problems.
              </li>
              <li>
                <strong className="mr-2">High hardware costs:</strong>
                Sensor installations and bespoke hardware are expensive to deploy and maintain.
              </li>
              <li>
                <strong className="mr-2">Slow decision cycles:</strong>
                By the time problems are analyzed, the peak period has passed.
              </li>
              <li>
                <strong className="mr-2">Fragmented data:</strong>
                POS, staff notes and siloed tools make it hard to get a single source of truth.
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">How SwiftServe solves it</h3>
            <ul className="space-y-4 text-neutral-700 dark:text-neutral-300">
              <li>
                <strong className="mr-2">Vision AI from existing cameras:</strong>
                No new sensors — we analyze feeds to produce accurate, privacy-respecting metrics.
              </li>
              <li>
                <strong className="mr-2">Live metrics & alerts:</strong>
                Real-time dashboards for wait times, service speed, lane efficiency and more.
              </li>
              <li>
                <strong className="mr-2">Actionable guidance:</strong>
                Automatic recommendations to reduce bottlenecks and improve throughput.
              </li>
              <li>
                <strong className="mr-2">Fast deploy & integrations:</strong>
                Deploy in hours and connect data to your workflows — POS, BI tools and team alerts.
              </li>
            </ul>

            <div className="mt-4 flex gap-3">
              <a className="inline-block rounded-md px-5 py-3 font-medium" href="#" style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                Request a demo
              </a>
              <a className="inline-block rounded-md px-5 py-3" href="#" style={{ border: '1px solid var(--border)', color: 'var(--foreground)', background: 'transparent' }}>
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
