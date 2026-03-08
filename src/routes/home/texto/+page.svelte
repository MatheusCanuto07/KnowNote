<script lang="ts">
  import type { PageProps } from "./$types";
  import { page } from "$app/state";
  import UpdatePage from "$lib/components/buttons/UpdatePage.svelte";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import Actions from "$lib/components/Actions.svelte";

  let { data }: PageProps = $props();
  let { texts, total } = $derived(data);

</script>

<Breadcrumbs items={[
  { href: '/home', label: 'Home' },
  { href: '/home/texto', label: 'Texto' }
]} />

<Actions actions={[
  { href: '/home/texto/novo', label: 'Adicionar', class: 'btn-success' }
]} />

<div class="w-full mt-5">
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
              <td>
                {@html text.content}
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
</div>

<style>

</style>