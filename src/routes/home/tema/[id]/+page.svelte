<script lang="ts">
  import ThemeForm from '$lib/components/form/ThemeForm.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

  let { data } = $props();
</script>

<Breadcrumbs items={[
  { href: '/home', label: 'Home' },
  { href: '/home/tema', label: 'Tema' },
  { href: `/home/tema/${data.theme?.id}`, label: data.theme?.name ?? '' }
]} />

<ThemeForm entidade={data.theme ?? null}/>