<script lang=ts>
    import BasicBlock from './BasicBlock.svelte'
  import SkillsBlock from './SkillsBlock.svelte';

    let meeting = {
        title: "Cooking",
        date: new Date("Oct 21 2007"),
        blocks: [
            {
                type: "Preopening",
                length: 10,
                notes: "We will discuss some details about the lesson."
            },
            {
                type: "Group Instruction",
                length: 30,
                notes: "Mr. Keiper will teach everyone calculus."
            },
            {
                type: "Opening Ceremony",
                length: 30,
                notes: "Mr. Keiper will teach everyone calculus."
            },
            {
                type: "Skills Instruction",
                length: 30,
                notes: "Hello!",
                stations: [
                    {
                        instructors: ["Noah", "Ben"],
                        topic: "Lunch",
                        notes: "Noah and Ben will be giving examples of good lunches, and making grilled cheese. "
                    },
                    {
                        instructors: ["Noah", "Ben"],
                        topic: "Lunch",
                        notes: "Noah and Ben will be giving examples of good lunches, and making grilled cheese. "
                    }
                ]
            },
            {
                type: "Game",
                length: 15,
                notes: "Fishy Fishy..."
            },
            {
                type: "Closing",
                length: 5,
                notes: "Announcements\nLeader's minute\nClosing"
            },
        ]
    }

    console.log(meeting)
</script>

<div class="w-full flex flex-col items-center justify-center p-10">
    <h1 class="text-4xl mb-4">Meeting Plan</h1>
    <h2 class="text-3xl mb-2">{meeting.title}</h2>
    <subtitle class="text-lg text-gray-600 mb-4">{meeting.date.toLocaleDateString('en', { dateStyle: 'long' })}</subtitle>
    <div class="flex flex-col items-start">
        <h3 class="text-2xl mb-6">Schedule</h3>
        <div class="grid grid-cols-[auto,_auto] gap-x-8 gap-y-4 ">
            {#each meeting.blocks as block}
            {#if block.type == "Preopening"}
            <BasicBlock color="bg-gray-200" {block} />
            {/if}
            {#if block.type == "Group Instruction"}
            <BasicBlock color="bg-yellow-200" {block} />
            {/if}
            {#if block.type == "Opening Ceremony"}
            <BasicBlock color="bg-pink-200" {block} />
            {/if}
            {#if block.type == "Game"}
            <BasicBlock color="bg-indigo-200" {block} />
            {/if}
            {#if block.type == "Closing"}
            <BasicBlock color="bg-rose-200" {block} />
            {/if}
            {#if block.type == "Skills Instruction"}
            <SkillsBlock {block} />
            {/if}
            {/each}
        </div>
    </div>
</div>

<style>

</style>
