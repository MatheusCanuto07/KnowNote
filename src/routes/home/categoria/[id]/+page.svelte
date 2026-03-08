<script lang="ts">
  import CategoryForm from '$lib/components/form/CategoryForm.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

  let { data } = $props();
</script>

<Breadcrumbs items={[
  { href: '/home', label: 'Home' },
  { href: '/home/categoria', label: 'Categoria' },
  { href: `/home/categoria/${data.category?.id}`, label: data.category?.name ?? '' }
]} />

<CategoryForm entidade={data.category ?? null}/>
