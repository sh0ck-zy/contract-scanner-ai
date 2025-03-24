import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { prisma } from '@/lib/db';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req: Request) {
    // Get the webhook signature from the request headers
    const headerPayload = headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    // If there are no signature headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new NextResponse('Missing svix headers', { status: 400 });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a Svix instance with your webhook secret
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

    let evt: WebhookEvent;

    // Verify the webhook signature
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new NextResponse('Error verifying webhook', { status: 400 });
    }

    // Handle the webhook
    const { type } = evt;

    if (type === 'user.created') {
        const { id, email_addresses, first_name, last_name } = evt.data;
        const email = email_addresses[0].email_address;
        const name = [first_name, last_name].filter(Boolean).join(' ');

        try {
            // Create user in database
            const user = await prisma.user.create({
                data: {
                    clerkId: id,
                    email,
                    subscriptionStatus: 'TRIAL', // Start with trial access
                },
            });

            // Send welcome email
            await sendWelcomeEmail(email, name);

            return NextResponse.json({ message: 'User created successfully' });
        } catch (error) {
            console.error('Error processing user creation webhook:', error);
            return new NextResponse('Error processing webhook', { status: 500 });
        }
    }

    return NextResponse.json({ message: 'Webhook processed' });
}