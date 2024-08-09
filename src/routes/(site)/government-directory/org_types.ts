export enum OrganisationType {
    Agency = "Agency",
    Authority = "Authority",
    Committee = "Committee",
    Corporation = "Corporation",
    Department = "Department",
    Institution = "Institution",
}

export type Organisation = {
    name: string
    officialWebsite?: string,
    description?: string,
    slug: string
    type: keyof typeof OrganisationType,
    status: "Halted" | "Active",
    is_core?: true
}