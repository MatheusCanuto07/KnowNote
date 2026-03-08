<script lang="ts">
  import TextForm from '$lib/components/form/TextForm.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

  let { data } = $props();
</script>

<Breadcrumbs items={[
  { href: '/home', label: 'Home' },
  { href: '/home/texto', label: 'Texto' },
  { href: `/home/texto/${data.text?.id}`, label: 'Editar' }
]} />

<TextForm categories={data.categories} entidade={data.text ?? null}/>
