<script lang="ts">
  import type { PageProps } from "./$types";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import UpdatePage from "$lib/components/buttons/UpdatePage.svelte";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";

  let { data }: PageProps = $props();
  let { texts, total } = $derived(data);
  let isLoading = $state(false);
  let texto = $state(page.url.searchParams.get("texto") ?? "");

  function getPreview(content: string): string {
    return content
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async function filtrarPorTexto() {
    isLoading = true;

    const next = new URL(page.url);

    if (texto.trim() === '') {
      next.searchParams.delete('texto');
    } else {
      next.searchParams.set('texto', texto.trim());
    }

    next.searchParams.delete('page');

    await goto(next.toString(), {
      replaceState: true,
      noScroll: true,
      keepFocus: true,
    });

    isLoading = false;
  }

</script>

<Breadcrumbs items={[
  { href: '/home', label: 'Home' },
  { href: '/home/texto', label: 'Texto' }
]} />

<div class="flex flex-wrap justify-end">
  <div class="w-full mt-3 lg:w-4/12 lg:pl-3 lg:mt-0">
    <div class="join w-full">
      <input
        type="text"
        name="textoFilter"
        id="textoFilter"
        placeholder="Filtrar por texto"
        bind:value={texto}
        onkeydown={(e) => {
          if (e.key === 'Enter') {
            filtrarPorTexto();
          }
        }}
        class="input input-bordered join-item w-full"
      />
      <button class="btn join-item" type="button" onclick={filtrarPorTexto}>Filtrar</button>
    </div>
  </div>
  <div class="w-full mt-3 lg:w-2/12 lg:pl-3 lg:mt-0">
    <div class="dropdown dropdown-end w-full">
      <a href="/home/texto/novo" class="btn w-full btn-success">
        Adicionar
      </a>
    </div>
  </div>
</div>

<div class="w-full mt-5">
  

  {#if isLoading}
    <div class="rounded-xl border border-base-content min-h-48 flex items-center justify-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:else}
    <div class="overflow-x-auto overflow-y-auto max-h-125 rounded-xl border border-base-content">
      <table class="table w-full min-w-175">
        <thead class="sticky top-0 bg-base-100 z-10 shadow-sm">
          <tr>
            <th class="w-3/12">Título</th>
            <th class="w-8/12">Conteúdo</th>
            <th class="w-1/12">Ações</th>
          </tr>
        </thead>
        <tbody>
          {#if texts.length === 0}
            <tr>
              <td colspan="12" class="text-center">
                  Nenhum texto encontrado
              </td>
            </tr>
          {:else }
            {#each texts as text}
              <tr>
                <td>{text.name}</td>
                <td class="max-w-0">
                  <div class="text-preview" title={getPreview(text.content)}>
                    {getPreview(text.content)}
                  </div>
                </td>
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
                          href="/home/texto/{text.id}">Editar
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
      entityName="texto"
      displayItems={texts.length}
      totalItems={total}
      pluralName="textos"
    />
  {/if}
</div>

<style>
  .text-preview {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

</style>