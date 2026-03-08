<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<div class="w-full flex flex-wrap mt-10">
  <div class="w-full md:w-6/12 pr-5">
    <input 
      placeholder="Pesquisar categoria ou texto"
      type="text"
      id="searchTexto"
      name="searchTexto"
      class="input input-bordered w-full">
  </div>

  <div class="w-full md:w-2/12 pr-5">
    <select class="select select-bordered w-full">
      {#each data.themes as theme}
      <option value={theme.id}>
        {theme.name}
      </option>
      {/each}
    </select>
  </div>
  
  <div class="w-full md:w-2/12 pr-5">
    <select class="select select-bordered w-full">
      <option value="">Todas categorias</option>
      {#each data.categories as category}
      <option value={category.id}>
        {category.name}
      </option>
      {/each}
    </select>
  </div>  
</div>

<h1 class="text-2xl font-bold mt-7">{data.texts[0]?.themeName}</h1>

<div class="w-full flex flex-wrap mt-3">  
  {#each data.texts as text, i}
    {#if i === 0 || data.texts[i - 1].categoryName !== text.categoryName}
      <div class="w-full">
        <h2 class="text-xl font-bold mt-2 mb-2">{text.categoryName}</h2>
      </div>
    {/if}

    <div class="w-full md:w-6/12 pr-5 mb-5">
      <div class="card bg-base-300 shadow-sm">
        <div class="card-body">
          <h3 class="card-subtitle">{text.textName}</h3>
          <p>{@html text.textContent}</p>
        </div>
      </div>
    </div>

  {/each}
</div>