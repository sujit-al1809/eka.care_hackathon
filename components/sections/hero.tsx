"use client";

import { motion } from "framer-motion";
import FlickeringGrid from "@/components/magicui/flickering-grid";

import { Icons } from "@/components/icons";
import HeroVideoDialog from "@/components/magicui/hero-video";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

function HeroTitles() {
  return (
    <div className="flex w-full max-w-5xl flex-col space-y-8 overflow-hidden pt-8 relative items-center text-center">
      {/* Abstract Background Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10" />

      {/* Multilingual Background Text */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] text-7xl font-bold overflow-hidden pointer-events-none select-none">
        <div className="animate-pulse duration-[4000ms]">
          <span>हिंदी தமிழ் తెలుగు ಕನ್ನಡ ગુજરાતી മലയാളം বাংলা मराठी</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm"
      >
        <span className="mr-2">✨</span> New Generation Healthcare
      </motion.div>

      <motion.h1
        className="text-center text-5xl font-bold leading-tight sm:text-6xl md:text-8xl relative z-10 tracking-tight"
        initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
        animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          ease: [0.16, 1, 0.3, 1],
          staggerChildren: 0.2,
        }}
      >
        <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/50 bg-clip-text text-transparent">
          Swasth
        </span>
        <span className="bg-gradient-to-br from-primary via-primary/80 to-primary/40 bg-clip-text text-transparent ml-4">
          AI
        </span>
      </motion.h1>

      <motion.p
        className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-muted-foreground sm:text-xl sm:leading-9 text-balance relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.6,
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        An AI-powered clinical triage & diagnostic support system
        <span className="text-foreground font-medium"> built for India.</span>
        <br />
        <span className="mt-4 block text-base md:text-lg text-muted-foreground/80">
          Experience healthcare conversations in <span className="text-primary/80 font-medium">Hindi, Tamil, Telugu, Kannada</span> & more
        </span>
      </motion.p>
    </div>
  );
}

function HeroCTA() {
  const { user } = useUser();

  return (
    <motion.div
      className="mx-auto mt-10 flex w-full max-w-2xl flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={user ? "/dashboard" : "/signin"}
        className={cn(
          buttonVariants({ variant: "default", size: "lg" }),
          "w-full sm:w-auto min-w-[200px] text-lg h-14 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
        )}
      >
        <Icons.logo className="mr-2 h-6 w-6" />
        {user ? "Go to Dashboard" : "Start Consultation"}
      </Link>

      {!user && (
        <Link
          href="/how-it-works"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "w-full sm:w-auto h-14 rounded-full border-2 hover:bg-muted/50 transition-all duration-300"
          )}
        >
          View Demo
        </Link>
      )}
    </motion.div>
  );
}

function HeroImage() {
  return (
    <motion.div
      className="relative mx-auto flex w-full items-center justify-center mt-20"
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative rounded-2xl p-2 bg-gradient-to-b from-border/50 to-border/10 backdrop-blur-sm border border-border/40 shadow-2xl">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-3xl blur-2xl opacity-20 -z-10" />
        <HeroVideoDialog
          animationStyle="from-center"
          videoSrc="https://imagekit.io/player/embed/rmyd10ywi/Recording%202025-06-29%20204016.mp4?updatedAt=1751212929355&thumbnail=https%3A%2F%2Fik.imagekit.io%2Frmyd10ywi%2FRecording%25202025-06-29%2520204016.mp4%2Fik-thumbnail.jpg%3FupdatedAt%3D1751212929355&updatedAt=1751212929355"
          thumbnailSrc="/dashboard.png"
          thumbnailAlt="Hero Video"
          className="rounded-xl shadow-sm max-w-screen-lg w-full"
        />
      </div>
    </motion.div>
  );
}

export default function Hero2() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-background">
      {/* Background Flickering Grid */}
      <FlickeringGrid
        className="z-0 absolute inset-0 size-full feature-grid"
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.2}
        flickerChance={0.1}
        height={800}
        width={800}
      />

      {/* Gradient Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 z-0 pointer-events-none" />

      <div className="relative z-10 flex w-full flex-col items-center justify-start px-4 pt-32 pb-20 sm:px-6 sm:pt-40 md:pt-48 lg:px-8 max-w-7xl mx-auto">
        <HeroTitles />
        <HeroCTA />
        <HeroImage />
      </div>

    </section>
  );
}
