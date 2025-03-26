"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, FileText, Video, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface Resource {
    id: string
    title: string
    description: string
    url: string
    type: "article" | "video" | "template" | "guide"
}

interface ResourcesProps {
    industry?: string
    issueType?: string
}

export function EducationalResources({ industry = "general", issueType }: ResourcesProps) {
    // This would ideally come from an API or database
    const resources: Record<string, Resource[]> = {
        payment_terms: [
            {
                id: "1",
                title: "Securing Your Payments as a Freelancer",
                description: "Learn how to structure payment terms to minimize risk and ensure timely payment.",
                url: "/resources/payment-terms-guide",
                type: "guide",
            },
            {
                id: "2",
                title: "Payment Milestone Template",
                description: "A ready-to-use template for structuring payment milestones in your contracts.",
                url: "/resources/payment-milestone-template",
                type: "template",
            },
            {
                id: "3",
                title: "How to Handle Late Payments",
                description: "Video walkthrough on addressing and preventing late payments.",
                url: "/resources/late-payments-video",
                type: "video",
            },
        ],
        revision_policy: [
            {
                id: "4",
                title: "Setting Clear Revision Boundaries",
                description: "Learn how to define revision scopes and limits to prevent scope creep.",
                url: "/resources/revision-boundaries",
                type: "guide",
            },
            {
                id: "5",
                title: "Revision Clause Template",
                description: "A template for clear revision terms in your contracts.",
                url: "/resources/revision-clause-template",
                type: "template",
            },
        ],
        intellectual_property: [
            {
                id: "6",
                title: "Understanding IP Rights for Freelancers",
                description: "A comprehensive guide to intellectual property rights for freelance work.",
                url: "/resources/ip-rights-guide",
                type: "guide",
            },
            {
                id: "7",
                title: "IP Rights Clause Template",
                description: "A balanced IP rights clause template for freelance contracts.",
                url: "/resources/ip-clause-template",
                type: "template",
            },
        ],
        scope_definition: [
            {
                id: "8",
                title: "Defining Project Scope Clearly",
                description: "Learn how to write clear scope definitions to prevent misunderstandings.",
                url: "/resources/scope-definition-guide",
                type: "guide",
            },
            {
                id: "9",
                title: "Scope of Work Template",
                description: "A detailed template for defining project scope in your contracts.",
                url: "/resources/scope-template",
                type: "template",
            },
        ],
        general: [
            {
                id: "10",
                title: "Freelance Contract Essentials",
                description: "The key elements every freelance contract should include.",
                url: "/resources/contract-essentials",
                type: "guide",
            },
            {
                id: "11",
                title: "Red Flags in Client Contracts",
                description: "Learn to identify problematic clauses in contracts you're asked to sign.",
                url: "/resources/contract-red-flags",
                type: "article",
            },
        ],
    }

    // Filter resources based on issue type if provided
    const relevantResources = issueType && resources[issueType] ? resources[issueType] : resources["general"]

    // Add industry-specific resources if available
    const industryResources =
        industry !== "general" && resources[industry] ? [...relevantResources, ...resources[industry]] : relevantResources

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Educational Resources
                </CardTitle>
                <CardDescription>Learn more about contract best practices and how to protect yourself.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid grid-cols-4 mb-4">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="guides">Guides</TabsTrigger>
                        <TabsTrigger value="templates">Templates</TabsTrigger>
                        <TabsTrigger value="videos">Videos</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        {industryResources.map((resource) => (
                            <ResourceCard key={resource.id} resource={resource} />
                        ))}
                    </TabsContent>

                    <TabsContent value="guides" className="space-y-4">
                        {industryResources
                            .filter((r) => r.type === "guide" || r.type === "article")
                            .map((resource) => (
                                <ResourceCard key={resource.id} resource={resource} />
                            ))}
                    </TabsContent>

                    <TabsContent value="templates" className="space-y-4">
                        {industryResources
                            .filter((r) => r.type === "template")
                            .map((resource) => (
                                <ResourceCard key={resource.id} resource={resource} />
                            ))}
                    </TabsContent>

                    <TabsContent value="videos" className="space-y-4">
                        {industryResources
                            .filter((r) => r.type === "video")
                            .map((resource) => (
                                <ResourceCard key={resource.id} resource={resource} />
                            ))}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

function ResourceCard({ resource }: { resource: Resource }) {
    const getIcon = (type: string) => {
        switch (type) {
            case "article":
            case "guide":
                return <FileText className="h-4 w-4" />
            case "video":
                return <Video className="h-4 w-4" />
            case "template":
                return <AlertTriangle className="h-4 w-4" />
            default:
                return <BookOpen className="h-4 w-4" />
        }
    }
    return (
        <Link href={resource.url}>
            <div className="p-4 border rounded-lg hover:bg-neutral-50 transition-colors">
                <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 bg-primary/10 rounded-md text-primary">{getIcon(resource.type)}</div>
                    <div>
                        <h3 className="font-medium text-sm">{resource.title}</h3>
                        <p className="text-xs text-neutral-500 mt-1">{resource.description}</p>
                        <div className="mt-2">
                            <span className="text-xs font-medium px-2 py-1 bg-neutral-100 rounded-full capitalize">
                                {resource.type}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

