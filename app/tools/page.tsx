"use client"

import { useState } from "react"
import { ArrowLeft, Circle, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CircleGenerator } from "@/components/circle-generator"
import Link from "next/link"

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--primary) 1px, transparent 1px),
              linear-gradient(to bottom, var(--primary) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2 font-mono text-xs">
                  <ArrowLeft className="w-4 h-4" />
                  VOLVER
                </Button>
              </Link>
              <div className="w-px h-8 bg-border/50" />
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-primary" />
                <h1 className="text-lg font-bold tracking-tighter">
                  <span className="text-primary">MC</span>LOC
                  <span className="text-muted-foreground font-normal ml-2 text-sm">/ HERRAMIENTAS</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Circle Generator */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 border border-primary/50 flex items-center justify-center">
              <Circle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">GENERADOR DE CIRCULOS</h2>
              <p className="text-xs font-mono text-muted-foreground">
                Genera circulos pixel-perfect para tus builds
              </p>
            </div>
          </div>
          <CircleGenerator />
        </section>
      </main>
    </div>
  )
}
