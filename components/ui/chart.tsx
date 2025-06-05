"use client"

import type * as React from "react"

export const Chart = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative">{children}</div>
}

export const ChartContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative">{children}</div>
}

export const ChartTooltip = ({ children }: { children: React.ReactNode }) => {
  return <div className="absolute z-10">{children}</div>
}

export const ChartTooltipContent = () => {
  return <div className="bg-white border rounded-md shadow-md p-2">Tooltip Content</div>
}

export const ChartLegend = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center gap-2">{children}</div>
}

export const ChartLegendItem = ({ name, color }: { name: string; color: string }) => {
  return (
    <div className="flex items-center gap-1">
      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }}></div>
      <span>{name}</span>
    </div>
  )
}

export const ChartGrid = () => {
  return <div className="absolute inset-0 pointer-events-none"></div>
}

export const ChartXAxis = () => {
  return <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200"></div>
}

export const ChartYAxis = () => {
  return <div className="absolute top-0 left-0 bottom-0 w-0.5 bg-gray-200"></div>
}

export const ChartArea = ({ data, name, color }: { data: number[]; name: string; color: string }) => {
  return <div className="area">Area</div>
}

export const ChartLine = ({ data, name, color }: { data: number[]; name: string; color: string }) => {
  return <div className="line">Line</div>
}

export const ChartBar = ({ data, name, color }: { data: number[]; name: string; color: string }) => {
  return <div className="bar">Bar</div>
}
