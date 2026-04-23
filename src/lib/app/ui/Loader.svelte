<script lang="ts">
    let {
        color = 'currentColor',
        size = 24,
        stroke = 1,
        show = true,
    }: {
        color?: string;
        size?: number;
        stroke?: number;
        show?: boolean;
    } = $props()
</script>
{#if show}
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 38 38" 
        stroke={color}
        style="width: {size}px; height: {size}px;"
    >
        <g fill="none" fill-rule="evenodd">
            <g transform="translate(1 1)" stroke-width={stroke}>
                <circle stroke-opacity=".5" cx="18" cy="18" r="18"/>
                <path d="M36 18c0-9.94-8.06-18-18-18">
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 18 18"
                        to="360 18 18"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                </path>
            </g>
        </g>
    </svg>
{/if}
