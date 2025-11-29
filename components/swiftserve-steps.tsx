"use client";

import { Camera, BarChart3, Plug } from 'lucide-react';

export default function SwiftServeSteps() {
	const steps = [
		{
			icon: Camera,
			title: "Connect Your Cameras",
			description: "SwiftServe seamlessly integrates with your existing camera infrastructure. No additional hardware needed - just connect and start monitoring your restaurant operations in real-time.",
		},
		{
			icon: BarChart3,
			title: "Get Real-Time Insights",
			description: "Our vision AI analyzes customer flow, wait times, and service performance instantly. View live dashboards and receive actionable alerts to optimize your operations.",
		},
		{
			icon: Plug,
			title: "Integrate & Automate",
			description: "Connect with your POS system and analytics tools. Get automated recommendations that reduce wait times, improve throughput, and enhance guest experiences.",
		},
	];

	return (
		<section className="w-full relative z-20 py-20 bg-background">
			<div className="mx-auto max-w-7xl px-6">
				{/* Header */}
				<div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl leading-tight mb-4 text-black dark:text-white">
						Three Simple Steps to Success
					</h2>
					<p className="text-lg max-w-2xl mx-auto text-black dark:text-white">
						Transform your restaurant operations in three simple steps. From connecting your existing cameras to gaining real-time insights and automating your workflow, SwiftServe makes it easy to optimize service and improve guest experiences.
					</p>
				</div>

				{/* Three Steps */}
				<div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 mb-16">
					{steps.map((step, index) => {
						const Icon = step.icon;
						return (
							<div key={index} className="flex-1 flex flex-col items-center text-center relative">
								{/* Step Icon */}
								<div 
									className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
									style={{ background: '#ba6908' }}
								>
									<Icon className="w-10 h-10 text-white" />
								</div>

								{/* Step Content */}
								<h3 
									className="text-xl md:text-2xl font-semibold mb-4"
									style={{ color: '#ba6908' }}
								>
									{step.title}
								</h3>
								<p className="text-sm md:text-base text-black dark:text-white max-w-sm">
									{step.description}
								</p>

								{/* Arrow Connector (hidden on mobile, shown between steps on desktop) */}
								{index < steps.length - 1 && (
									<div className="hidden md:block absolute top-10 -right-4 md:-right-2 lg:right-0 w-8 md:w-12 lg:w-16">
										<svg
											width="100%"
											height="2"
											viewBox="0 0 100 2"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M0 1 L100 1"
												stroke="#ba6908"
												strokeWidth="2"
												strokeDasharray="5 5"
											/>
											<polygon
												points="95,0 100,1 95,2"
												fill="#ba6908"
											/>
										</svg>
									</div>
								)}
							</div>
						);
					})}
				</div>

				{/* Bottom Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
					{/* Color Arrangement Circle */}
					<div className="rounded-2xl border p-6 bg-card">
						<div className="flex items-center gap-2 mb-4">
							<div className="w-3 h-3 rounded-full bg-red-500"></div>
							<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
							<div className="w-3 h-3 rounded-full bg-green-500"></div>
							<h4 className="text-lg font-semibold ml-2">Performance Metrics</h4>
						</div>
						<div className="flex items-center justify-around">
							<div className="flex flex-col items-center">
								<div className="relative w-24 h-24">
									<svg className="w-24 h-24 transform -rotate-90">
										<circle
											cx="48"
											cy="48"
											r="40"
											fill="none"
											stroke="currentColor"
											strokeWidth="8"
											className="text-muted"
										/>
										<circle
											cx="48"
											cy="48"
											r="40"
											fill="none"
											stroke="#ba6908"
											strokeWidth="8"
											strokeDasharray={`${2 * Math.PI * 40 * 0.85} ${2 * Math.PI * 40}`}
											strokeLinecap="round"
										/>
									</svg>
									<div className="absolute inset-0 flex items-center justify-center">
										<span className="text-2xl font-bold">85%</span>
									</div>
								</div>
								<p className="text-xs mt-2 text-muted-foreground">Throughput</p>
							</div>
							<div className="flex flex-col items-center">
								<div className="relative w-24 h-24">
									<svg className="w-24 h-24 transform -rotate-90">
										<circle
											cx="48"
											cy="48"
											r="40"
											fill="none"
											stroke="currentColor"
											strokeWidth="8"
											className="text-muted"
										/>
										<circle
											cx="48"
											cy="48"
											r="40"
											fill="none"
											stroke="#ba6908"
											strokeWidth="8"
											strokeDasharray={`${2 * Math.PI * 40 * 0.72} ${2 * Math.PI * 40}`}
											strokeLinecap="round"
										/>
									</svg>
									<div className="absolute inset-0 flex items-center justify-center">
										<span className="text-2xl font-bold">+12%</span>
									</div>
								</div>
								<p className="text-xs mt-2 text-muted-foreground">Service Speed</p>
							</div>
							<div className="flex flex-col items-center">
								<div className="relative w-24 h-24">
									<svg className="w-24 h-24 transform -rotate-90">
										<circle
											cx="48"
											cy="48"
											r="40"
											fill="none"
											stroke="currentColor"
											strokeWidth="8"
											className="text-muted"
										/>
										<circle
											cx="48"
											cy="48"
											r="40"
											fill="none"
											stroke="#ba6908"
											strokeWidth="8"
											strokeDasharray={`${2 * Math.PI * 40 * 0.45} ${2 * Math.PI * 40}`}
											strokeLinecap="round"
										/>
									</svg>
									<div className="absolute inset-0 flex items-center justify-center">
										<span className="text-lg font-bold">3m 24s</span>
									</div>
								</div>
								<p className="text-xs mt-2 text-muted-foreground">Avg Wait Time</p>
							</div>
						</div>
					</div>

					{/* Font Used / Typography */}
					<div className="rounded-2xl border p-6 bg-card">
						<div className="flex items-center gap-2 mb-4">
							<div className="w-3 h-3 rounded-full bg-red-500"></div>
							<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
							<div className="w-3 h-3 rounded-full bg-green-500"></div>
							<h4 className="text-lg font-semibold ml-2">Built In Suggestions</h4>
						</div>
						<div className="flex items-center gap-6">
							<div className="text-6xl font-bold"></div>
							<div className="flex flex-col gap-2">
								<div className="text-sm">Peak hours detected — consider adding staff</div>
								<div className="text-sm">Wait time exceeds threshold — open additional register</div>
								<div className="text-xs text-muted-foreground mt-2">
									• Real-time operational recommendations
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

