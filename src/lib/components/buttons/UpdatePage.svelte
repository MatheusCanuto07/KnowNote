<script lang="ts">
  import { page } from "$app/state";
  import { filters } from './filter.svelte.js';
  interface Props {
    displayItems: number;
    totalItems: number;
    entityName: string;
    pluralName: string;
	}

	let { displayItems, totalItems, entityName, pluralName }: Props = $props();
  let pageNumber = $state(1);
</script>

<div class="flex justify-center items-center flex-col mt-6 pb-5 pt-2 border-t border-base-300">
  <div class="text-sm text-base-content/70">
    Exibindo {displayItems} de {totalItems} {totalItems === 1 ? entityName : pluralName}
  </div>
  <div>
    <button
      class="btn"
      disabled={pageNumber === 1}
      onclick={() => {
        pageNumber = parseInt(page.url.searchParams.get("page") ?? "1") - 1;
        filters.update({ page: pageNumber.toString() });
      }}>
    Anterior
    </button>
    <button
      class="btn"
      onclick={() => {
        pageNumber = parseInt(page.url.searchParams.get("page") ?? "1") + 1;
        filters.update({ page: pageNumber.toString() });
      }}>
      Próxima
    </button>
  </div>
</div>