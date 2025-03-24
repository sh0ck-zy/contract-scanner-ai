"use client"

import * as React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChartConfig {
  [key: string]: {
    label: string
    color?: string
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
}

export function ChartContainer({ config, children, className, ...props }: ChartContainerProps) {
  const [tooltipData, setTooltipData] = React.useState<{
    name?: string
    value?: number | string
    payload?: Record<string, any>
  } | null>(null)
  const [tooltipLeft, setTooltipLeft] = React.useState(0)
  const [tooltipTop, setTooltipTop] = React.useState(0)

  return (
    <TooltipProvider>
      <div
        className={className}
        style={{
          // Set CSS variables for chart colors
          ...Object.fromEntries(Object.entries(config).map(([key, value]) => [`--color-${key}`, value.color])),
        }}
        {...props}
      >
        <Tooltip open={!!tooltipData} onOpenChange={() => {}}>
          <TooltipTrigger asChild>
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
              onMouseLeave={() => setTooltipData(null)}
            >
              {React.cloneElement(children as React.ReactElement, {
                onMouseMove: (e: React.MouseEvent) => {
                  setTooltipLeft(e.clientX)
                  setTooltipTop(e.clientY)
                },
              })}
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="bg-white border border-neutral-200 shadow-md p-2 rounded-md"
            style={{
              position: "fixed",
              left: tooltipLeft,
              top: tooltipTop - 16,
              transform: "translate(-50%, -100%)",
              zIndex: 50,
            }}
          >
            {tooltipData && (
              <div className="text-sm">
                <div className="font-medium">{tooltipData.name}</div>
                <div className="text-neutral-500">{tooltipData.value}</div>
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: Record<string, any>
  }>
  label?: string
  formatter?: (value: number, name: string, props: any) => [string, string]
  labelFormatter?: (label: string) => string
  hideLabel?: boolean
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
  hideLabel = false,
}: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="bg-white border border-neutral-200 shadow-md p-2 rounded-md">
      {!hideLabel && <div className="font-medium text-sm">{labelFormatter ? labelFormatter(label!) : label}</div>}
      <div className="space-y-1">
        {payload.map((item, index) => {
          const formattedValue = formatter ? formatter(item.value, item.name, item.payload) : item.value

          return (
            <div key={index} className="flex items-center text-sm">
              <div
                className="w-2 h-2 rounded-full mr-1"
                style={{
                  backgroundColor: item.payload.fill || item.payload.color,
                }}
              />
              <span className="text-neutral-500">
                {item.name}: {formattedValue}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ChartTooltip(props: any) {
  return <>{props.content}</>
}

