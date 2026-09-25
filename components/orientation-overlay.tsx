"use client"

import { Compass } from "lucide-react"

interface OrientationOverlayProps {
  canvasWidth: number
  canvasHeight: number
  originX: number
  originY: number
}

export function OrientationOverlay({ canvasWidth, canvasHeight, originX, originY }: OrientationOverlayProps) {
  const margin = 12
  const compassSize = 48

  // Clamp axis labels to visible area
  const clampX = (x: number) => Math.max(margin + 20, Math.min(canvasWidth - margin - 20, x))
  const clampY = (y: number) => Math.max(margin + 14, Math.min(canvasHeight - margin - 14, y))

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={canvasWidth}
      height={canvasHeight}
      style={{ overflow: "hidden" }}
    >
      {/* Axis labels at edges */}
      {/* +X (East) - right side */}
      <g transform={`translate(${clampX(canvasWidth - margin)}, ${clampY(originY)})`}>
        <rect x={-24} y={-10} width={48} height={20} fill="rgba(0,0,0,0.6)" rx={2} />
        <text x={0} y={4} textAnchor="middle" fill="#ef4444" fontSize={9} fontFamily="JetBrains Mono, monospace" fontWeight="bold">
          {'+X East'}
        </text>
      </g>

      {/* -X (West) - left side */}
      <g transform={`translate(${clampX(margin)}, ${clampY(originY)})`}>
        <rect x={-26} y={-10} width={52} height={20} fill="rgba(0,0,0,0.6)" rx={2} />
        <text x={0} y={4} textAnchor="middle" fill="#ef4444" fontSize={9} fontFamily="JetBrains Mono, monospace" fontWeight="bold">
          {'-X West'}
        </text>
      </g>

      {/* +Z (South) - bottom */}
      <g transform={`translate(${clampX(originX)}, ${clampY(canvasHeight - margin)})`}>
        <rect x={-28} y={-10} width={56} height={20} fill="rgba(0,0,0,0.6)" rx={2} />
        <text x={0} y={4} textAnchor="middle" fill="#60a5fa" fontSize={9} fontFamily="JetBrains Mono, monospace" fontWeight="bold">
          {'+Z South'}
        </text>
      </g>

      {/* -Z (North) - top */}
      <g transform={`translate(${clampX(originX)}, ${clampY(margin)})`}>
        <rect x={-28} y={-10} width={56} height={20} fill="rgba(0,0,0,0.6)" rx={2} />
        <text x={0} y={4} textAnchor="middle" fill="#60a5fa" fontSize={9} fontFamily="JetBrains Mono, monospace" fontWeight="bold">
          {'-Z North'}
        </text>
      </g>

      {/* Compass indicator - top-right corner */}
      <g transform={`translate(${canvasWidth - compassSize - 8}, 8)`}>
        <rect width={compassSize} height={compassSize} fill="rgba(0,0,0,0.7)" stroke="rgba(255,255,255,0.1)" strokeWidth={1} rx={4} />
        {/* N */}
        <text x={compassSize / 2} y={14} textAnchor="middle" fill="#60a5fa" fontSize={10} fontFamily="JetBrains Mono, monospace" fontWeight="bold">
          N
        </text>
        {/* S */}
        <text x={compassSize / 2} y={compassSize - 4} textAnchor="middle" fill="#60a5fa" fontSize={10} fontFamily="JetBrains Mono, monospace" fontWeight="bold">
          S
        </text>
        {/* E */}
        <text x={compassSize - 6} y={compassSize / 2 + 4} textAnchor="middle" fill="#ef4444" fontSize={10} fontFamily="JetBrains Mono, monospace" fontWeight="bold">
          E
        </text>
        {/* W */}
        <text x={6} y={compassSize / 2 + 4} textAnchor="middle" fill="#ef4444" fontSize={10} fontFamily="JetBrains Mono, monospace" fontWeight="bold">
          W
        </text>
        {/* Cross lines */}
        <line x1={compassSize / 2} y1={16} x2={compassSize / 2} y2={compassSize - 16} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
        <line x1={12} y1={compassSize / 2} x2={compassSize - 12} y2={compassSize / 2} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      </g>
    </svg>
  )
}
