"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const projectTypes = [
    {
        value: "fixed_price",
        label: "Fixed Price",
        description: "Set price for the entire project",
    },
    {
        value: "hourly",
        label: "Hourly Rate",
        description: "Billed by the hour for work performed",
    },
    {
        value: "milestone",
        label: "Milestone-Based",
        description: "Payment tied to completion of specific milestones",
    },
    {
        value: "retainer",
        label: "Monthly Retainer",
        description: "Ongoing work with monthly payment",
    },
]

interface ProjectTypeSelectorProps {
    value: string
    onChange: (value: string) => void
}

export function ProjectTypeSelector({ value, onChange }: ProjectTypeSelectorProps) {
    const [open, setOpen] = useState(false)

    const selectedType = projectTypes.find((type) => type.value === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                    {selectedType ? selectedType.label : "Select project type..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Search project type..." />
                    <CommandList>
                        <CommandEmpty>No project type found.</CommandEmpty>
                        <CommandGroup>
                            {projectTypes.map((type) => (
                                <CommandItem
                                    key={type.value}
                                    value={type.value}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check className={cn("mr-2 h-4 w-4", value === type.value ? "opacity-100" : "opacity-0")} />
                                    <div className="flex flex-col">
                                        <span>{type.label}</span>
                                        <span className="text-xs text-neutral-500">{type.description}</span>
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

