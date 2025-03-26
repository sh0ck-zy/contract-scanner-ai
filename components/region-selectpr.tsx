"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const regions = [
    {
        value: "US",
        label: "United States",
        description: "US-based freelancing regulations",
    },
    {
        value: "CA",
        label: "California",
        description: "California FWPA and state-specific regulations",
    },
    {
        value: "NY",
        label: "New York",
        description: "NY Freelance Isn't Free Act and state regulations",
    },
    {
        value: "EU",
        label: "European Union",
        description: "EU freelancer protection regulations",
    },
    {
        value: "UK",
        label: "United Kingdom",
        description: "UK freelancer and contractor regulations",
    },
    {
        value: "AU",
        label: "Australia",
        description: "Australian independent contractor laws",
    },
    {
        value: "CA_COUNTRY",
        label: "Canada",
        description: "Canadian freelancer regulations",
    },
    {
        value: "OTHER",
        label: "Other Regions",
        description: "General international best practices",
    },
]

interface RegionSelectorProps {
    value: string
    onChange: (value: string) => void
}

export function RegionSelector({ value, onChange }: RegionSelectorProps) {
    const [open, setOpen] = useState(false)

    const selectedRegion = regions.find((region) => region.value === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                    {selectedRegion ? selectedRegion.label : "Select region..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Search region..." />
                    <CommandList>
                        <CommandEmpty>No region found.</CommandEmpty>
                        <CommandGroup>
                            {regions.map((region) => (
                                <CommandItem
                                    key={region.value}
                                    value={region.value}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check className={cn("mr-2 h-4 w-4", value === region.value ? "opacity-100" : "opacity-0")} />
                                    <div className="flex flex-col">
                                        <span>{region.label}</span>
                                        <span className="text-xs text-neutral-500">{region.description}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

