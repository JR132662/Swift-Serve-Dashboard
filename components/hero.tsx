import React from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { TextEffect } from '@/components/motion-primitives/text-effect'
import { AnimatedGroup } from '@/components/motion-primitives/animated-group'
import dynamic from 'next/dynamic'
import { Marquee, MarqueeContent, MarqueeItem } from '@/components/ui/marquee'

// RippleGrid is a WebGL client-only component; import dynamically with SSR disabled
const RippleGrid = dynamic(() => import('@/components/RippleGrid'))

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            y: 12,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export default function Hero() {
    return (
        <>
            <main className="overflow-hidden">
                {/* RippleGrid background (client-only) */}
                <div className="absolute inset-0 -z-20 pointer-events-none">
                    <RippleGrid
                        enableRainbow={false}
                        gridColor="#D97706"
                        rippleIntensity={0.01}
                        gridSize={6.0}
                        gridThickness={29.0}
                        mouseInteraction={true}
                        mouseInteractionRadius={1}
                        opacity={1}
                    />
                </div>
                <div
                    aria-hidden
                    className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block">
                    <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>
                <section>
                    <div className="relative pt-24 md:pt-36">
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            delayChildren: 1,
                                        },
                                    },
                                },
                                item: {
                                    hidden: {
                                        opacity: 0,
                                        y: 20,
                                    },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            type: 'spring',
                                            bounce: 0.3,
                                            duration: 2,
                                        },
                                    },
                                },
                            }}
                            className="mask-b-from-35% mask-b-to-90% absolute inset-0 top-56 -z-20 lg:top-32">
                        </AnimatedGroup>

                        <div
                            aria-hidden
                            className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
                        />

                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>
                                    <Link
                                        href="#link"
                                        className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                        <span className="text-foreground text-sm">Computing at the Edge</span>
                                        <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                                        <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </AnimatedGroup>

                                <TextEffect
                                    speedSegment={0.3}
                                    as="h1"
                                    className="mx-auto mt-8 max-w-4xl text-balance text-5xl max-md:font-semibold md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                                    Modern Solutions for Customer Engagement
                                </TextEffect>
                                <TextEffect
                                    per="line"
                                    speedSegment={0.3}
                                    delay={0.5}
                                    as="p"
                                    className="mx-auto mt-8 max-w-2xl text-balance text-lg text-shadow-lg">
                                    SwiftServe turns existing camera feeds into privacy-first, real-time insights that reveal guest flow, wait times, and service performance.
                                    <br />
                                    Deploys in hours and integrates with POS and analytics tools to deliver live alerts and actionable recommendations that reduce wait and improve throughput.
                                </TextEffect>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                                    <div
                                        key={1}
                                        className="rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5 bg-[#ba6908]">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-xl px-5 text-base">
                                            <Link href="#link">
                                                <span className="text-nowrap">Start Building</span>
                                            </Link>
                                        </Button>
                                    </div>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="h-10.5 rounded-xl px-5">
                                        <Link href="#link">
                                            <span className="text-nowrap">Request a demo</span>
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>

                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}>
                            <div className="mask-b-from-85% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                                    <Image
                                        className="bg-background aspect-15/8 relative rounded-2xl"
                                        src="/Images/Dashboard.png"
                                        alt="app screen"
                                        width={2700}
                                        height={1440}
                                    />
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>
                <section className="bg-background pb-16 pt-30 md:pb-32">
                    <h2 className="text-center text-4xl md:text-5xl leading-tight">Easy Integration with Your Favorite POS Systems</h2>
                    <Marquee className="mt-8 md:mt-20">
                            <MarqueeContent>
                                <MarqueeItem className="flex items-center justify-center h-12 sm:h-16 md:h-20 w-full mx-4 sm:mx-8 md:mx-12">
                                    <img
                                        className="h-12 sm:h-16 md:h-20 w-fit"
                                        src="/Images/Clover_mobile_app_Logo.svg.png"
                                        alt="Clover Logo"
                                        height="26"
                                        width="auto"
                                    />
                                </MarqueeItem>
                                <MarqueeItem className="flex items-center justify-center h-12 sm:h-16 md:h-20 w-full mx-4 sm:mx-8 md:mx-12">
                                    <img
                                        className="h-12 sm:h-16 md:h-20 w-fit"
                                        src="/Images/Square_Inc._logo.svg_.png"
                                        alt="Square Logo"
                                        height="26"
                                        width="auto"
                                    />
                                </MarqueeItem>
                                <MarqueeItem className="flex items-center justify-center h-12 sm:h-16 md:h-20 w-full mx-4 sm:mx-8 md:mx-12">
                                    <img
                                        className="h-12 sm:h-16 md:h-20 w-fit"
                                        src="/Images/Toast_logo.svg.png"
                                        alt="Toast Logo"
                                        height="26"
                                        width="auto"
                                    />
                                </MarqueeItem>
                            </MarqueeContent>
                    </Marquee>
                </section>
            </main>
        </>
    )
}
