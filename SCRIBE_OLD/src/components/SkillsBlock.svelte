<script lang=ts>
    interface SkillsBlock {
        title: string;
        length: number;
        notes: string;
        stations: {
            instructors: string[];
            topic: string;
            notes: string;
        }[];
    }

    interface Props {
        block: SkillsBlock;
    }

    let { block }: Props = $props();
</script>

<div class="grid grid-cols-subgrid bg-blue-200 rounded-lg p-4 col-span-full">
    <div>
        <h4 class="text-xl">{block.type}</h4>
        <h5 class="text-md text-gray-500">{block.length} mins</h5>
    </div>
    <div class="p-1">
        {#if block.notes}
        <p class="mb-2">{block.notes}</p>
        {/if}
        <div>
            <h6 class="text-lg mb-2">Stations</h6>
            {#each block.stations as station}
            <p class="text-base ml-2">Topic: {station.topic}</p>
            <p class="text-base ml-2 mb-1">Instructor: {station.instructors.join(', ')}</p>
            <p class="text-base ml-2 mb-2">{station.notes}</p>
            <hr class="ml-2 border-b border-black border-solid mb-3 w-20" />
            {/each}
        </div>
    </div>
</div>
