<script lang=ts>
    interface BasicBlock {
        title: string;
        length: number;
        notes: string;
    }

    interface Props {
        block: BasicBlock;
        color: string;
    }

    let { block, color }: Props = $props();
</script>

<div class="grid grid-cols-subgrid {color} rounded-lg p-4 col-span-full">
    <div>
        <h4 class="text-xl">{block.type}</h4>
        <h5 class="text-md text-gray-500">{block.length} mins</h5>
    </div>
    <div class="p-1">
        <span>{block.notes}</span>
    </div>
</div>
