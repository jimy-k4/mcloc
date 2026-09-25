"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"
import { horizontalDistance, formatDistance } from "@/lib/distance"
import type { Location } from "@/lib/types"

export interface Connection {
  id: string
  from: string
  to: string
  color: string
}

interface ConnectionLayerProps {
  connections: Connection[]
  locations: Location[]
  worldToCanvas: (x: number, z: number, w: number, h: number) => { x: number; y: number; scale: number }
  canvasWidth: number
  canvasHeight: number
  onDeleteConnection: (id: string) => void
  onChangeColor: (id: string, color: string) => void
}

const CONNECTION_COLORS = [
  "#ef4444",
  "#f59e0b",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#06b6d4",
  "#f97316",
]

export function ConnectionLayer({
  connections,
  locations,
  worldToCanvas,
  canvasWidth,
  canvasHeight,
  onDeleteConnection,
  onChangeColor,
}: ConnectionLayerProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const getLocation = (id: string) => locations.find((l) => l.id === id)

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={canvasWidth}
      height={canvasHeight}
      style={{ overflow: "visible" }}
    >
      {connections.map((conn) => {
        const fromLoc = getLocation(conn.from)
        const toLoc = getLocation(conn.to)
        if (!fromLoc || !toLoc) return null

        const from = worldToCanvas(fromLoc.x, fromLoc.z, canvasWidth, canvasHeight)
        const to = worldToCanvas(toLoc.x, toLoc.z, canvasWidth, canvasHeight)
        const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 }
        const dist = horizontalDistance(
          { x: fromLoc.x, y: fromLoc.y, z: fromLoc.z },
          { x: toLoc.x, y: toLoc.y, z: toLoc.z }
        )
        const isHovered = hoveredId === conn.id

        return (
          <g key={conn.id}>
            {/* Glow line */}
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={conn.color}
              strokeWidth={isHovered ? 4 : 2}
              strokeOpacity={0.3}
              strokeDasharray="8,4"
              filter="url(#glow)"
            />
            {/* Main line */}
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={conn.color}
              strokeWidth={isHovered ? 3 : 1.5}
              strokeDasharray="8,4"
              className="pointer-events-auto cursor-pointer"
              onMouseEnter={() => setHoveredId(conn.id)}
              onMouseLeave={() => setHoveredId(null)}
            />
            {/* Distance label */}
            <g transform={`translate(${mid.x}, ${mid.y})`}>
              <rect
                x={-30}
                y={-10}
                width={60}
                height={20}
                fill="rgba(0,0,0,0.85)"
                stroke={conn.color}
                strokeWidth={1}
                rx={2}
              />
              <text
                x={0}
                y={5}
                textAnchor="middle"
                fill="white"
                fontSize={10}
                fontFamily="JetBrains Mono, monospace"
              >
                {formatDistance(dist)}b
              </text>
            </g>
            {/* Delete button on hover */}
            {isHovered && (
              <g
                transform={`translate(${mid.x + 35}, ${mid.y - 10})`}
                className="pointer-events-auto cursor-pointer"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                  onDeleteConnection(conn.id)
                }}
              >
                <circle r={8} fill="rgba(239,68,68,0.9)" />
                <line x1={-3} y1={-3} x2={3} y2={3} stroke="white" strokeWidth={1.5} />
                <line x1={3} y1={-3} x2={-3} y2={3} stroke="white" strokeWidth={1.5} />
              </g>
            )}
            {/* Color dots on hover */}
            {isHovered && (
              <g transform={`translate(${mid.x}, ${mid.y + 18})`}>
                {CONNECTION_COLORS.map((c, i) => (
                  <circle
                    key={c}
                    cx={(i - CONNECTION_COLORS.length / 2) * 14 + 7}
                    cy={8}
                    r={5}
                    fill={c}
                    stroke={conn.color === c ? "white" : "transparent"}
                    strokeWidth={1.5}
                    className="pointer-events-auto cursor-pointer"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      onChangeColor(conn.id, c)
                    }}
                  />
                ))}
              </g>
            )}
            {/* SVG filter for glow */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </g>
        )
      })}
    </svg>
  )
}
