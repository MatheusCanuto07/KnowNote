<script lang="ts">
  import ThemeForm from '$lib/components/form/ThemeForm.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

  let { form, data } = $props();
</script>

<Breadcrumbs items={[
  { href: '/home', label: 'Home' },
  { href: '/home/tema', label: 'Tema' },
  { href: '/home/tema/novo', label: 'Adicionar' }
]} />

<ThemeForm entidade={null}/>