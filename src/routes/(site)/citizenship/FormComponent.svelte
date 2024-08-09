<script lang="ts">
import { page } from "$app/stores"
import IdentityPicker from "$lib/controls/IdentityPicker.svelte"
import Input from "$lib/controls/Input.svelte"
import MultiSegment from "$lib/controls/MultiSegment.svelte"
import Segment from "$lib/controls/Segment.svelte"
import SingleSegment from "$lib/controls/SingleSegment.svelte"
import { countries } from "$lib/data/countries"
import { ethnicities } from "$lib/data/ethnicities"
import { occupations } from "$lib/data/occupations"
import { skills } from "$lib/data/skills"
import InputWrapper from "$lib/display/InputWrapper.svelte"

import SwapHorizontal from "svelte-material-icons/SwapHorizontal.svelte"
import Calendar from "svelte-material-icons/Calendar.svelte"
import Job from "svelte-material-icons/HammerScrewdriver.svelte"
import ChevronRight from "svelte-material-icons/ChevronRight.svelte"
import Button from "$lib/controls/Button.svelte"
import Heading from "$lib/display/Heading.svelte"
import Passport from "svelte-material-icons/Passport.svelte"
import { invalidateAll } from "$app/navigation"
import { regex_search } from "$lib/utils/regex"
import type { GetUserResult } from "$lib/queries/surreal_queries"
import asyncStatus from "$lib/utils/asyncStatus"
import { safe_db } from "$lib/stores/database"

$: data = $page.data

export let user: NonNullable<GetUserResult[0][number]>

let sexes = ["Male", "Female", "Other"] as const

type CitizenshipRegistration = {
    first_name: string,
    last_name: string,
    sex: null | typeof sexes[number]
    country_of_citizenship: typeof countries,
    date_of_birth: string
    country_of_residence: typeof countries[number] | null
    country_of_birth: typeof countries[number] | null
    skills: string[][],
    occupations: string[][],
    ethnic_groups: typeof ethnicities[number][]
}

let citizenship_registration: CitizenshipRegistration = {
    first_name: user.first_name,
    last_name: user.last_name,
    sex: null,
    date_of_birth: "",
    country_of_citizenship: [],
    country_of_residence: null,
    country_of_birth: null,
    skills: [],
    occupations: [],
    ethnic_groups: []
}

async function register() {
    function expect<T>(foo: T | undefined | null, error: string): T {
        if (foo != undefined) return foo
        throw new Error(error)
    }

    try {
        if (citizenship_registration.ethnic_groups.length == 0)
            throw new Error("You must select at least one ethnic group")
        if (citizenship_registration.country_of_citizenship.length == 0)
            throw new Error("You must select a country of citizenship")
        if (isNaN(new Date(citizenship_registration.date_of_birth).getTime()))
            throw new Error("Invalid date of birth")

        let normalised = {
            ...citizenship_registration,
            sex: expect(citizenship_registration.sex, "You must select a sex"),
            country_of_citizenship: citizenship_registration.country_of_citizenship.map(c => c.code),
            country_of_residence: expect(citizenship_registration.country_of_residence?.code, "You must select a country of residence"),
            country_of_birth: expect(citizenship_registration.country_of_birth?.code, "You must select a country of birth"),
            skills: citizenship_registration.skills.map(s => s[0]),
            occupations: citizenship_registration.occupations.map(o => o[0]),
            date_of_birth: new Date(citizenship_registration.date_of_birth).getTime(),
        }

        const db = await safe_db()

        let [application] = await db.query(`
                CREATE ONLY application CONTENT $application
            `,
            {
                application: {
                    application_type: "citizenship",
                    application: {
                        ...normalised,
                        user: user.id
                    }
                }
            })

        if (!application) {
            throw new Error("Could not create application")
        }

        await invalidateAll()
        return data.alerts.create_alert("success", "Citizenship application created")
    } catch (e) {
        if(e instanceof Error) {
            return data.alerts.create_alert("error", e.message)
        } else {
            return data.alerts.create_alert("error", "An unknown error occurred")
        }
    }
}
</script>
<Heading
    right_icon={Passport}
    text="Citizenship Registration"/>
<div class="inputs">
    <IdentityPicker
        bind:first_name={ citizenship_registration.first_name }
        bind:last_name={ citizenship_registration.last_name }/>
    <InputWrapper name="Sex">
        <div class="horizontal-segments">
            {#each sexes as sex}
                <Segment
                    style={citizenship_registration.sex == sex ? "branded" : "translucent"}
                    onclick={() => citizenship_registration.sex = sex}
                    text={sex}/>
            {/each}
        </div>
    </InputWrapper>
    <div class="date-wrapper">
        <Input
            name="Date of birth"
            left_icon={Calendar}
            placeholder="Enter Date"
            type="date"
            bind:value={ citizenship_registration.date_of_birth }/>
    </div>
    <div class="horizontal-inputs">
        <MultiSegment
            name="Country of Citizenship"
            get_title={country => country.name}
            options={search => countries.filter(country => regex_search(search).test(country.name))}
            bind:values={ citizenship_registration.country_of_citizenship }>
        </MultiSegment>
        <MultiSegment
            name="Ethnic Group"
            allow_other={query => query}
            options={search => ethnicities.filter(ethnicity => regex_search(search).test(ethnicity))}
            bind:values={ citizenship_registration.ethnic_groups }/>
    </div>
    <div class="horizontal-inputs">
        <SingleSegment
            name="Country of Residence"
            get_title={value => value.name}
            options={search => countries.filter(country => regex_search(search).test(country.name))}
            placeholder="Select Country"
            right_icon={SwapHorizontal}
            bind:value={ citizenship_registration.country_of_residence }/>
        <SingleSegment
            name="Country of Birth"
            get_title={value => value.name}
            options={search => countries.filter(country => regex_search(search).test(country.name))}
            placeholder="Select Country"
            right_icon={SwapHorizontal}
            bind:value={ citizenship_registration.country_of_birth }/>
    </div>
    <div class="horizontal-inputs">
        <MultiSegment
            name="Occupation"
            allow_other={query => [query]}
            get_title={option => option[0]}
            left_icon={Job}
            options={search => occupations.filter(occupation => occupation.some(alias => regex_search(search).test(alias)))}
            bind:values={ citizenship_registration.occupations }
            let:option
            let:search>
            <div class="aliases">
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html
                    option.slice(1)
                        .map(alias => alias.replace(new RegExp(search ? search : "$^", "ig"), match => `<strong>${match}</strong>`))
                        .sort(a => new RegExp(search, "ig").test(a) ? -1 : 1)
                        .join(", ")}
            </div>
        </MultiSegment>
        <MultiSegment
            name="Skills"
            allow_other={query => [query.trim()]}
            get_title={option => option[0]}
            left_icon={Job}
            options={search => skills.filter(skill => skill.some(alias => new RegExp(search, "ig").test(alias)))}
            bind:values={ citizenship_registration.skills }
            let:option
            let:search>
            <div class="aliases">
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html
                    option.slice(1)
                        .map(alias => alias.replace(new RegExp(search ? search : "$^", "ig"), match => `<strong>${match}</strong>`))
                        .sort(a => new RegExp(search, "ig").test(a) ? -1 : 1)
                        .join(", ")}
            </div>
        </MultiSegment>
    </div>
    <div>
        <Button
            hug={true}
            label="Apply for citizenship"
            onclick={asyncStatus(register)}
            right_icon={ChevronRight}></Button>
    </div>
</div>
<style>
    .aliases {
        opacity: 0.5;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        padding-top: 8px;
        padding-bottom: 2px;
        width: 100%;
    }

    .date-wrapper {
        max-width: 250px;
    }

    .inputs {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 24px;
    }

    .horizontal-inputs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
    }
    @media (max-width: 600px) {
        .horizontal-inputs {
            grid-template-columns: 1fr;
        }
    }

    .horizontal-segments {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
</style>