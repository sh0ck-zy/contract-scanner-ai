"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const industries = [
    {
        value: "web_development",
        label: "Web Development",
        description: "Websites, web apps, and online services",
    },
    {
        value: "graphic_design",
        label: "Graphic Design",
        description: "Visual design, branding, and illustration",
    },
    {
        value: "content_creation",
        label: "Content Creation",
        description: "Writing, editing, and content strategy",
    },
    {
        value: "marketing",
        label: "Marketing",
        description: "Digital marketing, SEO, and advertising",
    },
    {
        value: "consulting",
        label: "Consulting",
        description: "Professional advice and expertise",
    },
    {
        value: "general",
        label: "Other/General",
        description: "All other freelance services",
    },
]

interface IndustrySelectorProps {
    value: string
    onChange: (value: string) => void
}

export function IndustrySelector({ value, onChange }: IndustrySelectorProps) {
    const [open, setOpen] = useState(false)

    const selectedIndustry = industries.find((industry) => industry.value === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                    {selectedIndustry ? selectedIndustry.label : "Select industry..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Search industry..." />
                    <CommandList>
                        <CommandEmpty>No industry found.</CommandEmpty>
                        <CommandGroup>
                            {industries.map((industry) => (
                                <CommandItem
                                    key={industry.value}
                                    value={industry.value}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check className={cn("mr-2 h-4 w-4", value === industry.value ? "opacity-100" : "opacity-0")} />
                                    <div className="flex flex-col">
                                        <span>{industry.label}</span>
                                        <span className="text-xs text-neutral-500">{industry.description}</span>
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