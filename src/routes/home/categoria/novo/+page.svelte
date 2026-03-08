<script lang="ts">
  import CategoryForm from '$lib/components/form/CategoryForm.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

  let { form, data } = $props();
</script>

<Breadcrumbs items={[
  { href: '/home', label: 'Home' },
  { href: '/home/categoria', label: 'Categoria' },
  { href: '/home/categoria/novo', label: 'Adicionar' }
]} />

<CategoryForm entidade={null} themes={data.themes}/>
