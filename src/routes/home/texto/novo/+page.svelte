<script lang="ts">
  import TextForm from '$lib/components/form/TextForm.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

  let { form, data } = $props();
</script>

<Breadcrumbs items={[
  { href: '/home', label: 'Home' },
  { href: '/home/texto', label: 'Texto' },
  { href: '/home/texto/novo', label: 'Adicionar' }
]} />

<TextForm entidade={null} categories={data.categories}/>
