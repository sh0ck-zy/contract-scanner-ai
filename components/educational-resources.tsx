"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, BookOpen } from "lucide-react"
import Link from "next/link"

export interface ResourcesProps {
  resourceType: string
}

export function EducationalResources({ resourceType }: ResourcesProps) {
  // Map of resource types to specific resources
  const resourceMap: Record<string, Array<{ title: string; url: string }>> = {
    payment_terms: [
      { title: "Setting Fair Payment Terms for Freelancers", url: "/resources/payment-terms" },
      { title: "How to Ensure Timely Payments in Your Contracts", url: "/resources/timely-payments" },
    ],
    intellectual_property: [
      { title: "Protecting Your Intellectual Property as a Freelancer", url: "/resources/ip-rights" },
      { title: "Copyright Basics for Creative Professionals", url: "/resources/copyright-guide" },
    ],
    scope_definition: [
      { title: "Defining Project Scope to Prevent Scope Creep", url: "/resources/scope-definition" },
      { title: "Creating Clear Deliverables in Service Agreements", url: "/resources/clear-deliverables" },
    ],
    revision_policy: [
      { title: "Setting Reasonable Revision Limits in Contracts", url: "/resources/revision-policy" },
      { title: "Managing Client Feedback and Change Requests", url: "/resources/feedback-management" },
    ],
    general: [
      { title: "Freelance Contract Essentials: What to Include", url: "/resources/contract-essentials" },
      { title: "Red Flags to Watch for in Client Contracts", url: "/resources/contract-red-flags" },
      { title: "Negotiating Better Terms with Potential Clients", url: "/resources/negotiation-tips" },
    ],
  }

  // Default to general resources if the type isn't in our map
  const resources = resourceMap[resourceType] || resourceMap.general

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Educational Resources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {resources.map((resource, index) => (
            <li key={index}>
              <Link 
                href={resource.url} 
                className="text-sm flex items-start gap-2 text-primary hover:text-primary/80 hover:underline"
              >
                <ExternalLink className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{resource.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

