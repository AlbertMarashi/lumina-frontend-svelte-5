<script lang="ts">
import Button from "$lib/controls/Button.svelte"
import Heading from "$lib/display/Heading.svelte"
import Tag from "$lib/display/Tag.svelte"
import Apps from "svelte-material-icons/Apps.svelte"
import Settlement from "$lib/icons/Settlement.svelte"
import StatusCard from "./StatusCard.svelte"
import ClockTimeFour from "svelte-material-icons/ClockTimeFour.svelte"
import Paragraph from "$lib/display/Paragraph.svelte"
import FlexWrap from "$lib/display/FlexWrap.svelte"
import site_data from "$lib/data/site_data"
import Discord from "svelte-material-icons/Discord.svelte"
import Flex from "$lib/layouts/Flex.svelte"

</script>

<Tag text="Citizenship"/>
<Heading
    right_icon={Settlement}
    text="Citizenship Status"/>
<StatusCard
    left_icon={ClockTimeFour}
    title="Status">Pending</StatusCard>
<Flex direction="column">
    <Paragraph>
        We'll let you know the next steps as we continue to build our systems.
    </Paragraph>
    <Paragraph>
        In the meantime, feel free to join our community Discord server if you would like to get involved and volunteer.
    </Paragraph>
    <FlexWrap>
        <Button
            href={site_data.socials.discord}
            hug={true}
            label="Join Discord"
            right_icon={Discord}/>
        <Button
            style="translucent"
            href="/"
            hug={true}
            label="Open Hub"
            right_icon={Apps}/>
    </FlexWrap>
</Flex>