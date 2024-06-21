<script>
    import Contacts from "./HeaderContents/Contacts.svelte";
    import Description from "./HeaderContents/Description.svelte";
    import Jumplinks from "./HeaderContents/Jumplinks.svelte";
    export let id;
</script>

<header id={id} class="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
    <div>
        <Description />
        <Jumplinks />
    </div>
    <Contacts />
</header>