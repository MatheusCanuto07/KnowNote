<script lang="ts">
  import type { ActionData } from './$types';
  import ColaboradorForm from '$lib/components/form/CategoriaForm.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

  let { form, data } = $props();
</script>

<Breadcrumbs items={[
  { href: '/home', label: 'Home' },
  { href: '/home/equipe', label: 'Equipe' },
  { href: '/home/equipe/novo', label: 'Adicionar' }
]} />

<ColaboradorForm entidade={null}/>