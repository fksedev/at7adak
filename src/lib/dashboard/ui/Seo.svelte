<script lang="ts">
    import { page } from '$app/state'
    import type { Snippet } from 'svelte'

    const clean_url = (str:any) => str.replace(/([^:])(\/\/+)/g, '$1/');
    const baseurl = page.url.protocol + '//' + page.url.host
    const url = clean_url(baseurl + page.url.pathname)

    let {
        image = '',
        description = '',
        keywords = [],
        title = '',
        siteTitle = '',
        twitterUsername = '',
        s3_url = '',
        jsonLd = undefined,
        metaTags = undefined,
        linkTags = undefined,
        children,
    }: {
        image?: string;
        description?: string;
        keywords?: string[];
        title?: string;
        siteTitle?: string;
        twitterUsername?: string;
        s3_url?: string;
        jsonLd?: any;
        metaTags?: any;
        linkTags?: any;
        children?: Snippet;
    } = $props()

    let __title = $derived((title && siteTitle) ? `${title} | ${siteTitle}` : title ? title : siteTitle)

    let __jsonLd = $derived(jsonLd || {
        "@type": "WebPage",
        "name": __title
    })

    let img = $derived(image ? clean_url(baseurl+'/'+image) : '')

    function getMimeTypeFromExtension(url: string) {
        const extensionMap = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'svg': 'image/svg+xml',
            'webp': 'image/webp'
        }
        const ext = ((url.split('?')[0]).split('.')).pop()?.toLowerCase() || '';
        return extensionMap[ext] || 'application/octet-stream';
    }
    const mimeType = $derived(getMimeTypeFromExtension(image))
</script>

<svelte:head>
    <title>{__title}</title>
    {#if description}
        <meta name="description" content={description}>
    {/if}
    {#if keywords?.length}
        <meta name="keywords" content={keywords.join(', ')}>
    {/if}

    <link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">

    {#if s3_url}
        <link rel="dns-prefetch" href={s3_url}>
        <link rel="preconnect" href={s3_url}>
    {/if}

    <link rel="canonical" href={url}>

    <meta
        name="robots"
        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
    >

    <meta name="googlebot" content="index, follow">
    <meta property="og:site_name" content={siteTitle}>
    <meta property="og:url" content={url}>
    <meta property="og:type" content={'website'}>
    <meta property="og:title" content={__title}>
    <meta property="og:description" content={description}>

    {#if image}
        <meta name="twitter:image" content={img}>

        <meta property="og:image" content={img}>
        <meta property="og:image:secure_url" content={img.replace('http://', 'https://')}>
        <meta property="og:image:type" content={mimeType}>
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:image:alt" content={__title}>
    {/if}

    <!-- TWITTER -->
    <meta name="twitter:card" content="summary_large_image">
    
    {#if twitterUsername}
        <meta name="twitter:creator" content={`@${twitterUsername}`}>
        <meta name="twitter:site" content={`@${twitterUsername}`}>
    {/if}

    {@html `${'<scri' + 'pt type="application/ld+json">'}${JSON.stringify({
        '@context': 'https://schema.org',
        ...__jsonLd
    })}${'</scri' + 'pt>'}`}

    {#if metaTags?.length}
        {#each metaTags as tag}
            <meta {...tag}>
        {/each}
    {/if}

    {#if linkTags?.length}
        {#each linkTags as tag}
            <link {...tag}>
        {/each}
    {/if}

    {@render children?.()}

</svelte:head>
