"use client";

export default function About() {
	return (
		<section className="w-full relative z-20 py-20" style={{ background: 'var(--card)', color: 'var(--card-foreground)' }}>
			<div className="mx-auto max-w-7xl px-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
					{/* Left: copy */}
					<div>
						<h2 className="text-4xl md:text-5xl leading-tight mb-4">
							Built for restaurants. Designed for results.
						</h2>
						<p className="text-lg max-w-2xl mb-6">
							SwiftServe turns camera feeds into clear, actionable insights. Our
							vision AI tracks wait times, service speed, lane efficiency, and
							customer flow — so managers can remove bottlenecks, improve
							throughput, and deliver consistent guest experiences without
							installing sensors.
						</p>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
							<div className="flex items-start gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 text-black font-bold">AI</div>
								<div>
									<div className="font-semibold">Vision AI</div>
									<div className="text-sm text-black">Accurate people & flow detection</div>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500 text-black font-bold">RT</div>
								<div>
									<div className="font-semibold">Real-time</div>
									<div className="text-sm text-black">Live dashboards & alerts</div>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400 text-black font-bold">NO</div>
								<div>
									<div className="font-semibold">No extra hardware</div>
									<div className="text-sm text-black">Works with existing cameras</div>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500 text-black font-bold">SI</div>
								<div>
									<div className="font-semibold">Actionable</div>
									<div className="text-sm text-black">Operational recommendations & reports</div>
								</div>
							</div>
						</div>

						<div className="flex flex-wrap gap-4">
							<a className="inline-block rounded-md px-6 py-3 font-medium" href="#" style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
								Get started — free trial
							</a>
							<a className="inline-block rounded-md px-6 py-3" href="#" style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}>
								Request demo
							</a>
						</div>
					</div>

					{/* Right: visual / stats card */}
					<div className="relative">
						<div className="rounded-2xl border p-6" style={{ borderColor: 'var(--border)' }}>
							<div className="flex items-center justify-between mb-6">
								<div>
									<div className="text-xs uppercase">Average wait</div>
									<div className="text-3xl font-bold">3m 24s</div>
								</div>
								<div>
									<div className="text-xs uppercase">Service speed</div>
									<div className="text-3xl font-bold">+12%</div>
								</div>
							</div>

							<div className="h-40 rounded-md flex items-center justify-center" style={{ background: 'var(--card)', color: 'var(--card-foreground)' }}>
								Live preview — tables & flow
							</div>

							<div className="mt-6 flex items-center justify-between text-sm">
								<div>Privacy-first • Secure • PCI-ready</div>
								<div>Deploys in hours</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}


