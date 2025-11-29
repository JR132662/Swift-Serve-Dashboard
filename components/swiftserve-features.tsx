"use client";

import { Brain, LayoutDashboard, Zap, Users } from 'lucide-react';

export default function SwiftServeFeatures() {
	const features = [
		{
			icon: Brain,
			title: "AI-Powered Automation",
			description: "Use AI to your advantage. Our vision AI learns your restaurant's patterns and automatically identifies bottlenecks, predicts peak hours, and recommends optimizations. No more manual analysis—let AI handle the predictable patterns and teach it your operational preferences.",
		},
		{
			icon: LayoutDashboard,
			title: "Simplify Your Operations",
			description: "Having your restaurant operations optimized with all your metrics together is possible and necessary to make good decisions. View wait times, service speed, customer flow, and POS data in one unified dashboard.",
		},
		{
			icon: Zap,
			title: "All-in-One Platform",
			description: "The all-in-one solution where you don't have to have your restaurant data scattered everywhere. Start a new way to manage operations with integrated cameras, POS systems, analytics, and team coordination in a single platform.",
		},
		{
			icon: Users,
			title: "Manage Your Team",
			description: "Keeping your team aligned is possible, thanks to our real-time alerts and recommendations. No mess with communication—get instant notifications when action is needed, assign tasks, and track performance all in one place.",
		},
	];

	return (
		<section className="w-full relative z-20 py-20 bg-background">
			<div className="mx-auto max-w-7xl px-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
					{features.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<div key={index} className="flex flex-col">
								{/* Icon and Title */}
								<div className="flex items-center gap-4 mb-4">
									<div 
										className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
										style={{ background: '#ba6908' }}
									>
										<Icon className="w-6 h-6 text-white" />
									</div>
									<h3 className="text-2xl md:text-3xl font-bold text-black">
										{feature.title}
									</h3>
								</div>

								{/* Description */}
								<p className="text-base md:text-lg text-black mb-6 leading-relaxed">
									{feature.description}
								</p>

								{/* Visual Placeholder - Uniform across all */}
								<div className="rounded-2xl border bg-card p-6 min-h-[240px] flex items-center justify-center">
									<div className="w-full h-full rounded-lg bg-muted/30 border border-dashed border-muted flex items-center justify-center">
										<div className="text-center">
											<div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center">
												<Icon className="w-8 h-8 text-muted-foreground" />
											</div>
											<p className="text-sm text-muted-foreground">
												SwiftServe Dashboard Preview
											</p>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

