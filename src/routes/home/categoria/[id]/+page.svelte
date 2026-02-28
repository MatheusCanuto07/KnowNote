<script lang="ts">
  import ColaboradorForm from '$lib/components/form/ColaboradorForm.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

  let { data } = $props();
  console.log(data);
</script>

<Breadcrumbs items={[
  { href: '/home', label: 'Home' },
  { href: '/home/equipe', label: 'Equipe' },
  { href: `/home/equipe/${data.colaborador?.id}`, label: data.colaborador?.name ?? '' }
]} />

<ColaboradorForm entidade={data.colaborador ?? null}/>