<script lang="ts">
  import type { PageProps } from "./$types";
  import { page } from "$app/state";
  import UpdatePage from "$lib/components/buttons/UpdatePage.svelte";
  import { SvelteURL } from "svelte/reactivity";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { loadFromLocalStorage, saveToLocalStorage } from "$lib/utils/localStorageLogic";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import Actions from "$lib/components/Actions.svelte";

  let { data }: PageProps = $props();
  let { themes, total } = $derived(data);
  const LOCALSTORAGE_KEY = "tema_filters";
  let isLoading = $state(true);
  let url = new SvelteURL(page.url);

  onMount(async () => {
    const activeParam = url.searchParams.get("active");
    if (activeParam) {
      saveToLocalStorage(LOCALSTORAGE_KEY, { active: activeParam });
      isLoading = false;
      return; 
    }
    const saved = loadFromLocalStorage(LOCALSTORAGE_KEY) as { active: string } | null;
    if (saved) {
      if (!activeParam) url.searchParams.set("active", saved.active);
    } else {
      if (!activeParam) url.searchParams.set("active", "false");
      saveToLocalStorage(LOCALSTORAGE_KEY, {
        active: url.searchParams.get("active")!
      });
    }

    await goto(`${url.pathname}?${url.searchParams.toString()}`);
    isLoading = false;
  });

  $effect(() => {
    const active = url.searchParams.get("active");
    
    if (active) {
      saveToLocalStorage(LOCALSTORAGE_KEY, { active });
    }
  });
</script>

<Breadcrumbs items={[
  { href: '/home', label: 'Home' },
  { href: '/home/tema', label: 'Tema' }
]} />

<Actions actions={[
  { href: '/home/tema/novo', label: 'Adicionar', class: 'btn-success' }
]} />

<div class="w-full mt-5">
  <div class="overflow-x-auto overflow-y-auto max-h-125 rounded-xl border border-base-content">
    <table class="table w-full min-w-175">
      <thead class="sticky top-0 bg-base-100 z-10 shadow-sm">
        <tr>
          <th class="w-3/12">Nome</th>
          <th class="w-9/12">Descrição</th>
          <th class="w-1/12">Ações</th>
        </tr>
      </thead>
      <tbody>
        {#if isLoading}
          <tr>
            <td colspan="12" class="text-center">
              <span class="loading loading-dots loading-sm"></span>
            </td>
          </tr>
        {:else if themes.length === 0}
          <tr>
            <td colspan="12" class="text-center">
                Nenhum tema encontrado para o filtro selecionado
            </td>
          </tr>
        {:else }
          {#each themes as theme}
            <tr class={theme.active ? "" : "line-through"}>
              <td>{theme.name}</td>
              <td>{theme.description}</td>
              <td>
                <div class="dropdown dropdown-left">
                  <div tabindex="0" role="button" class="btn m-1">...</div>
                  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                  <ul
                    tabindex="0"
                    class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                  >
                    <li>
                      <a
                        class="btn btn-success"
                        href="/home/tema/{theme.id}">Editar
                      </a>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
  <UpdatePage
    entityName="tema"
    displayItems={themes.length}
    totalItems={total}
    pluralName="temas"
  />
</div>
