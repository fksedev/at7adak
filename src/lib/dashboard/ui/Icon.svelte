<script lang="ts">
    import Icon from '@iconify/svelte';
    let {
        name,
        icon,
        color, 
        size,
        rotate,
        hFlip,
        vFlip,
        style,
        className,
    }: {
        name?: string;
        icon?: string;
        color?: string;
        size?: string | number;
        rotate?: 0 | 1 | 2 | 3 | undefined;
        hFlip?: boolean;
        vFlip?: boolean;
        style?: string;
        className?: string;
    } = $props()

    let _icon = $derived(icon ? icon : name?.includes(':') ? name : `lucide:${name}`)

</script>

<span class={className}>
    <Icon icon={_icon} width={size} {color} {rotate} {hFlip} {vFlip} {style} />
</span>
