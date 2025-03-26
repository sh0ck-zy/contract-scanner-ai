import { NextResponse } from "next/server"

export function errorResponse(message: string, status = 500) {
    return new NextResponse(JSON.stringify({ error: message }), {
        status,
        headers: {
            "Content-Type": "application/json",
        },
    })
}

export function successResponse(data: any) {
    return NextResponse.json(data)
}

// Helper to validate required fields
export function validateRequiredFields(data: any, fields: string[]) {
    for (const field of fields) {
        if (!data[field]) {
            return `Missing required field: ${field}`
        }
    }
    return null
}

