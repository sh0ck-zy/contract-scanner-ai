interface ContractTemplate {
    template: string
    regionSpecific?: Record<string, string>
}

const contractTemplates: Record<string, Record<string, ContractTemplate>> = {
    web_development: {
        fixed_price: {
            template: `
# WEB DEVELOPMENT AGREEMENT

This Web Development Agreement (the "Agreement") is entered into as of [DATE], by and between:

**Client:** [CLIENT_NAME], with a principal place of business at [CLIENT_ADDRESS] ("Client")

**Developer:** [DEVELOPER_NAME], with a principal place of business at [DEVELOPER_ADDRESS] ("Developer")

## 1. SERVICES

Developer agrees to provide the following web development services (the "Services") to Client:

[PROJECT_DESCRIPTION]

### 1.1 Deliverables

Developer shall deliver the following deliverables (the "Deliverables"):

[DELIVERABLES]

## 2. TIMELINE

Developer shall complete the Services according to the following timeline:

[TIMELINE]

## 3. PAYMENT TERMS

### 3.1 Fee

Client agrees to pay Developer a fixed fee of [AMOUNT] for the Services.

### 3.2 Payment Schedule

Payment shall be made according to the following schedule:

[PAYMENT_TERMS]

### 3.3 Late Payments

Payments not received within 15 days of the due date will be subject to a late fee of 1.5% per month or the maximum allowed by law, whichever is less.

## 4. REVISIONS AND CHANGES

### 4.1 Included Revisions

The fixed fee includes up to two (2) rounds of minor revisions to the Deliverables.

### 4.2 Additional Revisions

Additional revisions or changes to the project scope will be billed at Developer's standard hourly rate of [HOURLY_RATE] per hour.

### 4.3 Change Request Process

All change requests must be submitted in writing. Developer will evaluate each change request and provide Client with an estimate of the additional time and cost required, if any.

## 5. INTELLECTUAL PROPERTY RIGHTS

### 5.1 Client Content

Client retains all ownership rights to content provided to Developer for use in the Deliverables.

### 5.2 Developer's Work

Upon receipt of full payment, Developer grants Client a non-exclusive, worldwide license to use the Deliverables.

### 5.3 Third-Party Materials

Developer will identify any third-party materials incorporated into the Deliverables, and Client shall be responsible for obtaining licenses for such materials if necessary.

## 6. ACCEPTANCE TESTING

### 6.1 Testing Period

Client shall have 7 days from delivery to inspect and test the Deliverables.

### 6.2 Acceptance

If Client does not report any issues within the testing period, the Deliverables shall be deemed accepted.

## 7. TERMINATION

### 7.1 Termination by Client

Client may terminate this Agreement at any time by providing written notice to Developer. Upon termination, Client shall pay for all Services performed up to the date of termination, plus a kill fee of 25% of the remaining contract value.

### 7.2 Termination by Developer

Developer may terminate this Agreement if Client fails to make any payment when due or breaches any material term of this Agreement.

## 8. WARRANTIES AND LIMITATIONS

### 8.1 Developer's Warranty

Developer warrants that the Deliverables will substantially conform to the specifications for a period of 30 days after acceptance.

### 8.2 Limitation of Liability

Developer's liability shall be limited to the amount paid by Client under this Agreement.

## 9. GENERAL PROVISIONS

### 9.1 Independent Contractor

Developer is an independent contractor, not an employee of Client.

### 9.2 Governing Law

This Agreement shall be governed by the laws of [JURISDICTION].

### 9.3 Entire Agreement

This Agreement constitutes the entire agreement between the parties and supersedes all prior discussions and agreements.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

CLIENT: ________________________
[CLIENT_NAME]

DEVELOPER: ________________________
[DEVELOPER_NAME]
      `,
            regionSpecific: {
                US: `
## 10. COMPLIANCE WITH LAWS

### 10.1 Freelance Worker Protection

This Agreement is designed to comply with applicable freelancer protection laws, including the California Freelance Worker Protection Act and the New York Freelance Isn't Free Act.

### 10.2 Payment Timeline

In accordance with these laws, all payments shall be made within 15 days of invoice submission or milestone completion.
        `,
                EU: `
## 10. COMPLIANCE WITH LAWS

### 10.1 GDPR Compliance

Developer shall comply with all applicable data protection laws, including the General Data Protection Regulation (GDPR).

### 10.2 Data Processing

If the Services involve processing personal data, the parties shall enter into a separate Data Processing Agreement.
        `,
            },
        },
        hourly: {
            template: `
# WEB DEVELOPMENT SERVICES AGREEMENT

This Web Development Services Agreement (the "Agreement") is entered into as of [DATE], by and between:

**Client:** [CLIENT_NAME], with a principal place of business at [CLIENT_ADDRESS] ("Client")

**Developer:** [DEVELOPER_NAME], with a principal place of business at [DEVELOPER_ADDRESS] ("Developer")

## 1. SERVICES

Developer agrees to provide the following web development services (the "Services") to Client:

[PROJECT_DESCRIPTION]

### 1.1 Deliverables

Developer shall deliver the following deliverables (the "Deliverables"):

[DELIVERABLES]

## 2. TIMELINE

Developer shall provide the Services according to the following estimated timeline:

[TIMELINE]

## 3. PAYMENT TERMS

### 3.1 Hourly Rate

Client agrees to pay Developer at the rate of [HOURLY_RATE] per hour for the Services.

### 3.2 Estimates

Developer will provide Client with estimates for specific tasks, but actual billing will be based on hours worked.

### 3.3 Payment Schedule

Developer will invoice Client [PAYMENT_TERMS]. Invoices shall include a detailed breakdown of hours worked and tasks performed.

### 3.4 Late Payments

Payments not received within 15 days of the invoice date will be subject to a late fee of 1.5% per month or the maximum allowed by law, whichever is less.

## 4. REVISIONS AND CHANGES

### 4.1 Change Requests

Client may request changes to the Services at any time. Developer will evaluate each change request and provide Client with an estimate of the additional time required.

### 4.2 Approval Process

Developer will not proceed with any changes that will increase the estimated hours without Client's written approval.

## 5. INTELLECTUAL PROPERTY RIGHTS

### 5.1 Client Content

Client retains all ownership rights to content provided to Developer for use in the Deliverables.

### 5.2 Developer's Work

Upon receipt of full payment, Developer grants Client a non-exclusive, worldwide license to use the Deliverables.

### 5.3 Third-Party Materials

Developer will identify any third-party materials incorporated into the Deliverables, and Client shall be responsible for obtaining licenses for such materials if necessary.

## 6. ACCEPTANCE TESTING

### 6.1 Testing Period

Client shall have 7 days from delivery to inspect and test the Deliverables.

### 6.2 Acceptance

If Client does not report any issues within the testing period, the Deliverables shall be deemed accepted.

## 7. TERMINATION

### 7.1 Termination by Client

Client may terminate this Agreement at any time by providing written notice to Developer. Upon termination, Client shall pay for all hours worked up to the date of termination.

### 7.2 Termination by Developer

Developer may terminate this Agreement if Client fails to make any payment when due or breaches any material term of this Agreement.

## 8. WARRANTIES AND LIMITATIONS

### 8.1 Developer's Warranty

Developer warrants that the Deliverables will substantially conform to the specifications for a period of 30 days after acceptance.

### 8.2 Limitation of Liability

Developer's liability shall be limited to the amount paid by Client under this Agreement.

## 9. GENERAL PROVISIONS

### 9.1 Independent Contractor

Developer is an independent contractor, not an employee of Client.

### 9.2 Governing Law

This Agreement shall be governed by the laws of [JURISDICTION].

### 9.3 Entire Agreement

This Agreement constitutes the entire agreement between the parties and supersedes all prior discussions and agreements.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

CLIENT: ________________________
[CLIENT_NAME]

DEVELOPER: ________________________
[DEVELOPER_NAME]
      `,
            regionSpecific: {
                US: `
## 10. COMPLIANCE WITH LAWS

### 10.1 Freelance Worker Protection

This Agreement is designed to comply with applicable freelancer protection laws, including the California Freelance Worker Protection Act and the New York Freelance Isn't Free Act.

### 10.2 Payment Timeline

In accordance with these laws, all payments shall be made within 15 days of invoice submission.
        `,
                EU: `
## 10. COMPLIANCE WITH LAWS

### 10.1 GDPR Compliance

Developer shall comply with all applicable data protection laws, including the General Data Protection Regulation (GDPR).

### 10.2 Data Processing

If the Services involve processing personal data, the parties shall enter into a separate Data Processing Agreement.
        `,
            },
        },
    },
    graphic_design: {
        fixed_price: {
            template: `
# GRAPHIC DESIGN AGREEMENT

This Graphic Design Agreement (the "Agreement") is entered into as of [DATE], by and between:

**Client:** [CLIENT_NAME], with a principal place of business at [CLIENT_ADDRESS] ("Client")

**Designer:** [DESIGNER_NAME], with a principal place of business at [DESIGNER_ADDRESS] ("Designer")

## 1. SERVICES

Designer agrees to provide the following graphic design services (the "Services") to Client:

[PROJECT_DESCRIPTION]

### 1.1 Deliverables

Designer shall deliver the following deliverables (the "Deliverables"):

[DELIVERABLES]

## 2. TIMELINE

Designer shall complete the Services according to the following timeline:

[TIMELINE]

## 3. PAYMENT TERMS

### 3.1 Fee

Client agrees to pay Designer a fixed fee of [AMOUNT] for the Services.

### 3.2 Payment Schedule

Payment shall be made according to the following schedule:

[PAYMENT_TERMS]

### 3.3 Late Payments

Payments not received within 15 days of the due date will be subject to a late fee of 1.5% per month or the maximum allowed by law, whichever is less.

## 4. REVISIONS AND CHANGES

### 4.1 Included Revisions

The fixed fee includes up to two (2) rounds of revisions to the Deliverables.

### 4.2 Additional Revisions

Additional revisions or changes to the project scope will be billed at Designer's standard hourly rate of [HOURLY_RATE] per hour.

### 4.3 Change Request Process

All change requests must be submitted in writing. Designer will evaluate each change request and provide Client with an estimate of the additional time and cost required, if any.

## 5. INTELLECTUAL PROPERTY RIGHTS

### 5.1 Client Content

Client retains all ownership rights to content provided to Designer for use in the Deliverables.

### 5.2 Designer's Work

Upon receipt of full payment, Designer grants Client a non-exclusive, worldwide license to use the Deliverables for the purposes specified in this Agreement.

### 5.3 Usage Rights

The Deliverables may be used by Client for the following purposes:

- [SPECIFY USAGE RIGHTS]

Any additional usage rights must be negotiated separately and may require additional fees.

### 5.4 Designer's Portfolio Rights

Designer retains the right to display the Deliverables in Designer's portfolio and promotional materials.

## 6. APPROVAL PROCESS

### 6.1 Approval Period

Client shall have 7 days from delivery to review and approve the Deliverables.

### 6.2 Acceptance

If Client does not request revisions within the approval period, the Deliverables shall be deemed accepted.

## 7. TERMINATION

### 7.1 Termination by Client

Client may terminate this Agreement at any time by providing written notice to Designer. Upon termination, Client shall pay for all Services performed up to the date of termination, plus a kill fee of 25% of the remaining contract value.

### 7.2 Termination by Designer

Designer may terminate this Agreement if Client fails to make any payment when due or breaches any material term of this Agreement.

## 8. WARRANTIES AND LIMITATIONS

### 8.1 Designer's Warranty

Designer warrants that the Deliverables will be original work, except for any materials provided by Client or obtained from stock or licensed sources.

### 8.2 Limitation of Liability

Designer's liability shall be limited to the amount paid by Client under this Agreement.

## 9. GENERAL PROVISIONS

### 9.1 Independent Contractor

Designer is an independent contractor, not an employee of Client.

### 9.2 Governing Law

This Agreement shall be governed by the laws of [JURISDICTION].

### 9.3 Entire Agreement

This Agreement constitutes the entire agreement between the parties and supersedes all prior discussions and agreements.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

CLIENT: ________________________
[CLIENT_NAME]

DESIGNER: ________________________
[DESIGNER_NAME]
      `,
            regionSpecific: {
                US: `
## 10. COMPLIANCE WITH LAWS

### 10.1 Freelance Worker Protection

This Agreement is designed to comply with applicable freelancer protection laws, including the California Freelance Worker Protection Act and the New York Freelance Isn't Free Act.

### 10.2 Payment Timeline

In accordance with these laws, all payments shall be made within 15 days of invoice submission or milestone completion.
        `,
                EU: `
## 10. COMPLIANCE WITH LAWS

### 10.1 Moral Rights

Designer's moral rights in the Deliverables are acknowledged and respected in accordance with applicable EU laws.

### 10.2 Right of Attribution

Designer shall be credited as the creator of the Deliverables where appropriate, unless otherwise agreed in writing.
        `,
            },
        },
    },
    content_creation: {
        fixed_price: {
            template: `
# CONTENT CREATION AGREEMENT

This Content Creation Agreement (the "Agreement") is entered into as of [DATE], by and between:

**Client:** [CLIENT_NAME], with a principal place of business at [CLIENT_ADDRESS] ("Client")

**Creator:** [CREATOR_NAME], with a principal place of business at [CREATOR_ADDRESS] ("Creator")

## 1. SERVICES

Creator agrees to provide the following content creation services (the "Services") to Client:

[PROJECT_DESCRIPTION]

### 1.1 Deliverables

Creator shall deliver the following deliverables (the "Deliverables"):

[DELIVERABLES]

## 2. TIMELINE

Creator shall complete the Services according to the following timeline:

[TIMELINE]

## 3. PAYMENT TERMS

### 3.1 Fee

Client agrees to pay Creator a fixed fee of [AMOUNT] for the Services.

### 3.2 Payment Schedule

Payment shall be made according to the following schedule:

[PAYMENT_TERMS]

### 3.3 Late Payments

Payments not received within 15 days of the due date will be subject to a late fee of 1.5% per month or the maximum allowed by law, whichever is less.

## 4. REVISIONS AND CHANGES

### 4.1 Included Revisions

The fixed fee includes up to two (2) rounds of revisions to the Deliverables.

### 4.2 Additional Revisions

Additional revisions or changes to the project scope will be billed at Creator's standard hourly rate of [HOURLY_RATE] per hour.

### 4.3 Change Request Process

All change requests must be submitted in writing. Creator will evaluate each change request and provide Client with an estimate of the additional time and cost required, if any.

## 5. INTELLECTUAL PROPERTY RIGHTS

### 5.1 Client Content

Client retains all ownership rights to content provided to Creator for use in the Deliverables.

### 5.2 Creator's Work

Upon receipt of full payment, Creator grants Client a non-exclusive, worldwide license to use the Deliverables for the purposes specified in this Agreement.

### 5.3 Usage Rights

The Deliverables may be used by Client for the following purposes:

- [SPECIFY USAGE RIGHTS]

Any additional usage rights must be negotiated separately and may require additional fees.

### 5.4 Creator's Portfolio Rights

Creator retains the right to display excerpts of the Deliverables in Creator's portfolio and promotional materials, unless otherwise specified.

### 5.5 Byline and Credit

Creator shall receive appropriate byline or credit for the Deliverables as follows:

- [SPECIFY BYLINE/CREDIT REQUIREMENTS]

## 6. APPROVAL PROCESS

### 6.1 Approval Period

Client shall have 7 days from delivery to review and approve the Deliverables.

### 6.2 Acceptance

If Client does not request revisions within the approval period, the Deliverables shall be deemed accepted.

## 7. TERMINATION

### 7.1 Termination by Client

Client may terminate this Agreement at any time by providing written notice to Creator. Upon termination, Client shall pay for all Services performed up to the date of termination, plus a kill fee of 25% of the remaining contract value.

### 7.2 Termination by Creator

Creator may terminate this Agreement if Client fails to make any payment when due or breaches any material term of this Agreement.

## 8. WARRANTIES AND LIMITATIONS

### 8.1 Creator's Warranty

Creator warrants that the Deliverables will be original work, except for any materials provided by Client or obtained from properly cited sources.

### 8.2 Limitation of Liability

Creator's liability shall be limited to the amount paid by Client under this Agreement.

## 9. GENERAL PROVISIONS

### 9.1 Independent Contractor

Creator is an independent contractor, not an employee of Client.

### 9.2 Governing Law

This Agreement shall be governed by the laws of [JURISDICTION].

### 9.3 Entire Agreement

This Agreement constitutes the entire agreement between the parties and supersedes all prior discussions and agreements.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

CLIENT: ________________________
[CLIENT_NAME]

CREATOR: ________________________
[CREATOR_NAME]
      `,
            regionSpecific: {
                US: `
## 10. COMPLIANCE WITH LAWS

### 10.1 Freelance Worker Protection

This Agreement is designed to comply with applicable freelancer protection laws, including the California Freelance Worker Protection Act and the New York Freelance Isn't Free Act.

### 10.2 Payment Timeline

In accordance with these laws, all payments shall be made within 15 days of invoice submission or milestone completion.
        `,
                EU: `
## 10. COMPLIANCE WITH LAWS

### 10.1 Moral Rights

Creator's moral rights in the Deliverables are acknowledged and respected in accordance with applicable EU laws.

### 10.2 Right of Attribution

Creator shall be credited as the author of the Deliverables where appropriate, unless otherwise agreed in writing.
        `,
            },
        },
    },
    general: {
        fixed_price: {
            template: `
# FREELANCE SERVICES AGREEMENT

This Freelance Services Agreement (the "Agreement") is entered into as of [DATE], by and between:

**Client:** [CLIENT_NAME], with a principal place of business at [CLIENT_ADDRESS] ("Client")

**Freelancer:** [FREELANCER_NAME], with a principal place of business at [FREELANCER_ADDRESS] ("Freelancer")

## 1. SERVICES

Freelancer agrees to provide the following services (the "Services") to Client:

[PROJECT_DESCRIPTION]

### 1.1 Deliverables

Freelancer shall deliver the following deliverables (the "Deliverables"):

[DELIVERABLES]

## 2. TIMELINE

Freelancer shall complete the Services according to the following timeline:

[TIMELINE]

## 3. PAYMENT TERMS

### 3.1 Fee

Client agrees to pay Freelancer a fixed fee of [AMOUNT] for the Services.

### 3.2 Payment Schedule

Payment shall be made according to the following schedule:

[PAYMENT_TERMS]

### 3.3 Late Payments

Payments not received within 15 days of the due date will be subject to a late fee of 1.5% per month or the maximum allowed by law, whichever is less.

## 4. REVISIONS AND CHANGES

### 4.1 Included Revisions

The fixed fee includes up to two (2) rounds of revisions to the Deliverables.

### 4.2 Additional Revisions

Additional revisions or changes to the project scope will be billed at Freelancer's standard hourly rate of [HOURLY_RATE] per hour.

### 4.3 Change Request Process

All change requests must be submitted in writing. Freelancer will evaluate each change request and provide Client with an estimate of the additional time and cost required, if any.

## 5. INTELLECTUAL PROPERTY RIGHTS

### 5.1 Client Content

Client retains all ownership rights to content provided to Freelancer for use in the Deliverables.

### 5.2 Freelancer's Work

Upon receipt of full payment, Freelancer grants Client a non-exclusive, worldwide license to use the Deliverables.

### 5.3 Third-Party Materials

Freelancer will identify any third-party materials incorporated into the Deliverables, and Client shall be responsible for obtaining licenses for such materials if necessary.

## 6. ACCEPTANCE PROCESS

### 6.1 Acceptance Period

Client shall have 7 days from delivery to review and accept the Deliverables.

### 6.2 Acceptance

If Client does not request revisions within the acceptance period, the Deliverables shall be deemed accepted.

## 7. TERMINATION

### 7.1 Termination by Client

Client may terminate this Agreement at any time by providing written notice to Freelancer. Upon termination, Client shall pay for all Services performed up to the date of termination, plus a kill fee of 25% of the remaining contract value.

### 7.2 Termination by Freelancer

Freelancer may terminate this Agreement if Client fails to make any payment when due or breaches any material term of this Agreement.

## 8. WARRANTIES AND LIMITATIONS

### 8.1 Freelancer's Warranty

Freelancer warrants that the Deliverables will substantially conform to the specifications for a period of 30 days after acceptance.

### 8.2 Limitation of Liability

Freelancer's liability shall be limited to the amount paid by Client under this Agreement.

## 9. GENERAL PROVISIONS

### 9.1 Independent Contractor

Freelancer is an independent contractor, not an employee of Client.

### 9.2 Governing Law

This Agreement shall be governed by the laws of [JURISDICTION].

### 9.3 Entire Agreement

This Agreement constitutes the entire agreement between the parties and supersedes all prior discussions and agreements.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

CLIENT: ________________________
[CLIENT_NAME]

FREELANCER: ________________________
[FREELANCER_NAME]
      `,
            regionSpecific: {
                US: `
## 10. COMPLIANCE WITH LAWS

### 10.1 Freelance Worker Protection

This Agreement is designed to comply with applicable freelancer protection laws, including the California Freelance Worker Protection Act and the New York Freelance Isn't Free Act.

### 10.2 Payment Timeline

In accordance with these laws, all payments shall be made within 15 days of invoice submission or milestone completion.
        `,
                EU: `
## 10. COMPLIANCE WITH LAWS

### 10.1 Data Protection

Freelancer shall comply with all applicable data protection laws, including the General Data Protection Regulation (GDPR).

### 10.2 Right of Attribution

Freelancer's right to be identified as the creator of the Deliverables is acknowledged in accordance with applicable laws.
        `,
            },
        },
        hourly: {
            template: `
# FREELANCE SERVICES AGREEMENT (HOURLY)

This Freelance Services Agreement (the "Agreement") is entered into as of [DATE], by and between:

**Client:** [CLIENT_NAME], with a principal place of business at [CLIENT_ADDRESS] ("Client")

**Freelancer:** [FREELANCER_NAME], with a principal place of business at [FREELANCER_ADDRESS] ("Freelancer")

## 1. SERVICES

Freelancer agrees to provide the following services (the "Services") to Client:

[PROJECT_DESCRIPTION]

### 1.1 Deliverables

Freelancer shall deliver the following deliverables (the "Deliverables"):

[DELIVERABLES]

## 2. TIMELINE

Freelancer shall provide the Services according to the following estimated timeline:

[TIMELINE]

## 3. PAYMENT TERMS

### 3.1 Hourly Rate

Client agrees to pay Freelancer at the rate of [HOURLY_RATE] per hour for the Services.

### 3.2 Estimates

Freelancer will provide Client with estimates for specific tasks, but actual billing will be based on hours worked.

### 3.3 Payment Schedule

Freelancer will invoice Client [PAYMENT_TERMS]. Invoices shall include a detailed breakdown of hours worked and tasks performed.

### 3.4 Late Payments

Payments not received within 15 days of the invoice date will be subject to a late fee of 1.5% per month or the maximum allowed by law, whichever is less.

## 4. REVISIONS AND CHANGES

### 4.1 Change Requests

Client may request changes to the Services at any time. Freelancer will evaluate each change request and provide Client with an estimate of the additional time required.

### 4.2 Approval Process

Freelancer will not proceed with any changes that will increase the estimated hours without Client's written approval.

## 5. INTELLECTUAL PROPERTY RIGHTS

### 5.1 Client Content

Client retains all ownership rights to content provided to Freelancer for use in the Deliverables.

### 5.2 Freelancer's Work

Upon receipt of full payment, Freelancer grants Client a non-exclusive, worldwide license to use the Deliverables.

### 5.3 Third-Party Materials

Freelancer will identify any third-party materials incorporated into the Deliverables, and Client shall be responsible for obtaining licenses for such materials if necessary.

## 6. ACCEPTANCE PROCESS

### 6.1 Acceptance Period

Client shall have 7 days from delivery to review and accept the Deliverables.

### 6.2 Acceptance

If Client does not request revisions within the acceptance period, the Deliverables shall be deemed accepted.

## 7. TERMINATION

### 7.1 Termination by Client

Client may terminate this Agreement at any time by providing written notice to Freelancer. Upon termination, Client shall pay for all hours worked up to the date of termination.

### 7.2 Termination by Freelancer

Freelancer may terminate this Agreement if Client fails to make any payment when due or breaches any material term of this Agreement.

## 8. WARRANTIES AND LIMITATIONS

### 8.1 Freelancer's Warranty

Freelancer warrants that the Deliverables will substantially conform to the specifications for a period of 30 days after acceptance.

### 8.2 Limitation of Liability

Freelancer's liability shall be limited to the amount paid by Client under this Agreement.

## 9. GENERAL PROVISIONS

### 9.1 Independent Contractor

Freelancer is an independent contractor, not an employee of Client.

### 9.2 Governing Law

This Agreement shall be governed by the laws of [JURISDICTION].

### 9.3 Entire Agreement

This Agreement constitutes the entire agreement between the parties and supersedes all prior discussions and agreements.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

CLIENT: ________________________
[CLIENT_NAME]

FREELANCER: ________________________
[FREELANCER_NAME]
      `,
            regionSpecific: {
                US: `
## 10. COMPLIANCE WITH LAWS

### 10.1 Freelance Worker Protection

This Agreement is designed to comply with applicable freelancer protection laws, including the California Freelance Worker Protection Act and the New York Freelance Isn't Free Act.

### 10.2 Payment Timeline

In accordance with these laws, all payments shall be made within 15 days of invoice submission.
        `,
                EU: `
## 10. COMPLIANCE WITH LAWS

### 10.1 Data Protection

Freelancer shall comply with all applicable data protection laws, including the General Data Protection Regulation (GDPR).

### 10.2 Right of Attribution

Freelancer's right to be identified as the creator of the Deliverables is acknowledged in accordance with applicable laws.
        `,
            },
        },
    },
}

export function getContractTemplate(industry: string, projectType: string, region = "US"): string {
    // Default to general/fixed_price if the specific template doesn't exist
    const industryKey = industry in contractTemplates ? industry : "general"
    const projectTypeKey = projectType in contractTemplates[industryKey] ? projectType : "fixed_price"

    const template = contractTemplates[industryKey][projectTypeKey]

    let fullTemplate = template.template

    // Add region-specific clauses if available
    if (template.regionSpecific && template.regionSpecific[region]) {
        fullTemplate += template.regionSpecific[region]
    }

    return fullTemplate
}

