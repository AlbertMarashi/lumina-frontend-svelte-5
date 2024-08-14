<PageHead
    description="Find information about government agencies, departments, and elected officials."
    title="Government Directory"/>
<script lang="ts">
import PageHead from "$lib/components/PageHead.svelte"
import Tag from "$lib/display/Tag.svelte"
import Heading from "$lib/display/Heading.svelte"
import Paragraph from "$lib/display/Paragraph.svelte"
import BulletedList from "svelte-material-icons/FormatListBulletedSquare.svelte"
import Card from "$lib/layouts/Card.svelte"
import DirectoryList from "./DirectoryList.svelte"
import Grid from "$lib/layouts/Grid.svelte"
import GridItem from "$lib/layouts/GridItem.svelte"
import FlexWrap from "$lib/display/FlexWrap.svelte"
import Segment from "$lib/controls/Segment.svelte"
import DotsCircle from "svelte-material-icons/DotsCircle.svelte"
import MenuDown from "svelte-material-icons/MenuDown.svelte"
import Sidebar from "./Sidebar.svelte"
import Box from "$lib/layouts/Box.svelte"
import Government from "svelte-material-icons/Bank.svelte"
import Flex from "$lib/layouts/Flex.svelte"
import ResponsiveLayout from "$lib/layouts/ResponsiveLayout.svelte"
import {OrganisationType, type Organisation} from "./org_types"
import GenericDropdown from "$lib/controls/GenericDropdown.svelte"
import OptionsNew from "$lib/controls/OptionsNew.svelte"

const organisations: Organisation[] = [
    {
        name: "Anti-Corruption Department",
        slug: "anti-corruption-department",
        type: "Department",
        status: "Halted"
    },
    {
        name: "Assembly",
        slug: "assembly",
        type: "Committee",
        description: "The voice of Lumina empowering citizens to directly participate in the decision-making process of the government.",
        is_core: true,
        status: "Halted"
    },
    {
        name: "Aviation Authority",
        slug: "aviation-authority",
        type: "Authority",
        status: "Halted"
    },
    {
        name: "Border Force Authority",
        slug: "border-force-authority",
        type: "Authority",
        status: "Halted"
    },
    {
        name: "Corrections Department",
        slug: "corrections-department",
        type: "Department",
        status: "Halted"
    },
    {
        name: "Culture Department",
        slug: "culture-department",
        type: "Department",
        status: "Halted"
    },
    {
        name: "Defense Department",
        slug: "defense-department",
        type: "Department",
        status: "Halted"
    },
    {
        name: "Emergency Services Department",
        slug: "emergency-services-department",
        type: "Department",
        status: "Halted"
    },
    {
        name: "Environment Agency",
        slug: "environment-agency",
        type: "Agency",
        status: "Halted"
    },
    {
        name: "Fines Agency",
        slug: "fines-agency",
        type: "Agency",
        status: "Halted"
    },
    {
        name: "Foreign Affairs Department",
        slug: "foreign-affairs-department",
        type: "Department",
        status: "Halted"
    },
    {
        name: "Health Department",
        slug: "health-department",
        type: "Department",
        status: "Halted"
    },
    {
        name: "Human Services Department",
        slug: "human-services-department",
        type: "Department",
        status: "Halted"
    },
    {
        name: "Infrastructure Department",
        slug: "infrastructure-department",
        type: "Department",
        status: "Halted"
    },
    {
        name: "Intelligence Department",
        slug: "intelligence-department",
        type: "Department",
        status: "Halted"
    },
    {
        name: "Investments Agency",
        slug: "investments-agency",
        type: "Agency",
        status: "Halted"
    },
    {
        name: "Jobs and Skills Department",
        slug: "jobs-and-skills-department",
        type: "Department",
        status: "Halted"
    },
    {
        name: "Justice Department",
        slug: "justice-department",
        description: "The independent branch of government responsible for interpreting and enforcing the law.",
        is_core: true,
        type: "Department",
        status: "Halted"
    },
    {
        name: "Land Department",
        slug: "land-department",
        type: "Department",
        status: "Halted"
    },
    {
        name: "Light Square Department",
        slug: "light-square-department",
        type: "Department",
        officialWebsite: "https://lightsquare.org",
        status: "Active"
    },
    {
        name: "Lumina Bank",
        slug: "lumina-bank",
        type: "Institution",
        status: "Halted"
    },
    {
        name: "Lumina Platform",
        slug: "lumina-platform",
        type: "Corporation",
        status: "Halted"
    },
    {
        name: "Lumina University",
        slug: "lumina-university",
        officialWebsite: "https://luminauniversity.earth",
        type: "Institution",
        status: "Active"
    },
    {
        name: "Media Department",
        slug: "media-department",
        type: "Department",
        status: "Halted"
    },
    {
        name: "Naval Department",
        slug: "naval-department",
        type: "Department",
        status: "Halted"
    },
    {
        name: "Nuclear Energy Department",
        slug: "nuclear-energy-department",
        type: "Department",
        status: "Halted"
    },
    {
        name: "Ombudsman Authority",
        slug: "ombudsman-authority",
        type: "Authority",
        status: "Halted"
    },
    {
        name: "Organisations Department",
        slug: "organisations-department",
        type: "Department",
        status: "Halted"
    },
    {
        name: "Police Authority",
        slug: "police-authority",
        type: "Authority",
        status: "Halted"
    },
    {
        name: "Provisional Committee",
        slug: "provisional-committee",
        is_core: true,
        description: "The temporary governing body responsible for the smooth functioning of government during its early stages.",
        type: "Committee",
        status: "Active"
    },
    {
        name: "Remunerations Agency",
        slug: "remunerations-agency",
        type: "Agency",
        status: "Halted"
    },
    {
        name: "Resources Department",
        slug: "resources-department",
        type: "Department",
        status: "Halted"
    },
    {
        name: "Safety Department",
        slug: "safety-department",
        type: "Department",
        status: "Halted"
    },
    {
        name: "Space Department",
        slug: "space-department",
        type: "Department",
        status: "Halted"
    },
    {
        name: "Sports Agency",
        slug: "sports-agency",
        type: "Agency",
        status: "Halted"
    },
    {
        name: "Statistics Agency",
        slug: "statistics-agency",
        type: "Agency",
        status: "Halted"
    },
    {
        name: "Tenders Department",
        slug: "tenders-department",
        type: "Department",
        status: "Halted"
    },
    {
        name: "Tourism Department",
        slug: "tourism-department",
        type: "Department",
        status: "Halted"
    }
]



let org_types: {
    name: string,
    description: string,
}[] = [
    {
        name: "Agency",
        description: "A government organisation that is responsible for a specific function. Agencies are usually headed by a director.",
    },
    {
        name: "Department",
        description: "A division of government that is responsible for a specific area of government. Departments are usually headed by a president",
    },
    {
        name: "Committee",
        description: "A group of individuals appointed or elected to consider, investigate and report on a specific issue.",
    },
    {
        name: "Authority",
        description: "An organisation with the power to enforce rules or regulations within a specific area",
    },
    {
        name: "Institution",
        description: "An organisation, typically for the purpose of research or education, that is established by a government or other authority.",
    },
    {
        name: "Corporation",
        description: "A company or group of people authorised to act as a single entity and recognised as such in law, headed by a director",
    }
]

let core_orgs = $derived(organisations.filter(org => org.is_core))
let type: null | OrganisationType = $state(null)
let status: null | "Halted" | "Active" = $state(null)
let filtered_orgs = $derived(organisations.filter(org =>
    (type === null || type === org.type)
        && (status === null || status === org.status)
))

</script>
<hero>
    <inner>
        <Flex
            align_items="flex-start"
            max_width="500px">
            <Tag text="Official Resource"/>
            <Heading
                left_icon={BulletedList}
                text="Government Directory"/>
            <Paragraph>
                Your guide to the structures, organisations and key people in the government of Lumina.
            </Paragraph>
        </Flex>
        <Grid
            columns={{
                mobile: 4,
                tablet: 8,
                laptop: 12
            }}
            horizontal_gap={40}
            side_padding={false}
            vertical_gap={40}>
            <GridItem
                columns={{
                    mobile: "span 4",
                    tablet: "span 3",
                    laptop: "span 4",
                }}
                flex_direction="column"
                gap={80}>
                <Sidebar
                    items={[
                        {
                            name: "Core Institutions",
                            href: "#core"
                        },
                        {
                            name: "Government Structures",
                            href: "#structures"
                        },
                        {
                            name: "Directory",
                            href: "#directory"
                        },
                    ]}/>
            </GridItem>
            <GridItem
                columns={{
                    mobile: "span 4",
                    tablet: "span 5",
                    laptop: "span 8",
                }}
                flex_direction="column"
                gap={80}>

                <Flex align_items="flex-start">
                    <Heading
                        id="core"
                        level={2}
                        text="Core Institutions"
                        underline={true}/>
                    <Flex max_width="500px">
                        <Paragraph>
                            A highlight of the most essential and fundamental organisations that play a crucial role in the functioning of the government.
                        </Paragraph>
                    </Flex>
                    <ResponsiveLayout
                        align_items="stretch"
                        min_item_size={220}>
                        {#each core_orgs as org}
                            <Card
                                align_items="flex-start"
                                gap={16}
                                justify_content="space-between"
                                padding="16px">
                                <Flex gap={8}>
                                    <Heading
                                        left_icon={Government}
                                        level={4}
                                        text={org.name}/>
                                    {#if org.description}
                                        <Paragraph>
                                            { org.description }
                                        </Paragraph>
                                    {/if}
                                </Flex>
                                <FlexWrap>
                                    <Tag text={org.type}/>
                                    {#if org.is_core}
                                        <Tag text="Core"/>
                                    {/if}
                                    <Tag
                                        --color={org.status === "Halted" ? "var(--foreground)" : "var(--green)"}

                                        text={org.status}/>
                                </FlexWrap>
                            </Card>
                        {/each}
                    </ResponsiveLayout>
                </Flex>
                <Flex align_items="flex-start">
                    <Heading
                        id="structures"
                        level={2}
                        text="Government Structures"
                        underline={true}/>
                    <Flex max_width="500px">
                        <Paragraph>
                            Descriptions of the various types of government entities.
                        </Paragraph>
                    </Flex>
                    <Card padding="16px">
                        <ResponsiveLayout
                            align_items="stretch"
                            gap={32}
                            min_item_size={220}>
                            {#each org_types as type}
                                <Box gap="16px">
                                    <Flex
                                        align_items="flex-start"
                                        gap={8}>
                                        <Tag text={type.name}/>
                                        <Paragraph>
                                            { type.description }
                                        </Paragraph>
                                    </Flex>
                                </Box>
                            {/each}
                        </ResponsiveLayout>
                    </Card>
                </Flex>
                <Flex align_items="flex-start">
                    <Heading
                        id="directory"
                        level={2}
                        text="Directory"
                        underline={true}/>
                    <Flex max_width="500px">
                        <Paragraph>
                            A comprehensive list of all government entities
                            <!-- , you an filter the list by type,
                        and status and view detailed information about each entity by clicking on it to learn more. -->
                        </Paragraph>
                    </Flex>
                    <FlexWrap>
                        <GenericDropdown>
                            {#snippet element({ toggle})}
                                <Segment
                                    style={type ? "branded" : "translucent"}
                                    left_icon={BulletedList}
                                    onclick={toggle}
                                    right_icon={MenuDown}>
                                    {#if type}
                                        { type }
                                    {:else}
                                        All Types
                                    {/if}
                                </Segment>
                            {/snippet}
                            {#snippet dropdown({ close })}
                                <OptionsNew
                                    onselect={opt => {
                                        close()
                                        type = opt
                                    }}
                                    options={[null, ...Object.values(OrganisationType)] as const}
                                    selected={type}>
                                    {#snippet option(opt)}
                                        <selector>
                                            {#if opt === null}
                                                <Tag
                                                    --color="var(--blue)"
                                                    text="All"/>
                                            {:else}
                                                <Tag text={opt}/>
                                                <!-- <description>
                                                    { org_types.find(t => t.name === opt)?.description }
                                                </description> -->
                                            {/if}
                                        </selector>
                                    {/snippet}
                                </OptionsNew>
                            {/snippet}
                        </GenericDropdown>

                        <GenericDropdown>
                            {#snippet element({ toggle })}
                                <Segment
                                    style={status ? "branded" : "translucent"}
                                    left_icon={DotsCircle}
                                    onclick={toggle}
                                    right_icon={MenuDown}>
                                    {#if status}
                                        { status }
                                    {:else}
                                        All Statuses
                                    {/if}
                                </Segment>
                            {/snippet}
                            {#snippet dropdown({ close })}
                                <OptionsNew
                                    onselect={opt => {
                                        close()
                                        status = opt
                                    }}
                                    options={[null, "Halted", "Active"] as const}
                                    selected={status}>
                                    {#snippet option(opt)}
                                        <selector>
                                            {#if opt === null}
                                                <Tag
                                                    --color="var(--blue)"
                                                    text="All"/>
                                            {:else if opt === "Halted"}
                                                <Tag
                                                    --color="var(--foreground)"
                                                    text="Halted"/>
                                            {:else if opt === "Active"}
                                                <Tag
                                                    --color="var(--green)"
                                                    text="Active"/>
                                            {/if}
                                        </selector>
                                    {/snippet}
                                </OptionsNew>
                            {/snippet}
                        </GenericDropdown>
                    </FlexWrap>
                    <DirectoryList organisations={filtered_orgs}/>
                </Flex>
            </GridItem>

        </Grid>
    </inner>
</hero>
<style>

hero {
    display: flex;
    width: 100%;
    align-items: center;
    flex-direction: column;
}

selector {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-weight: 600;
    font-size: 16px;
    padding: 4px;
    gap: 4px;
}

inner {
    display: flex;
    flex-direction: column;
    gap: 80px;
    width: 100%;
    padding: 80px 24px;
    max-width: 1200px;
    margin: 0 auto;
}
</style>