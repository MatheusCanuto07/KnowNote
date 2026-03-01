<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<div class="w-full flex flex-wrap mt-10">
  <div class="w-full md:w-10/12 pr-5">
    <input 
    placeholder="Pesquisar categoria ou texto"
    type="text"
    id="searchTexto"
    name="searchTexto"
    class="input input-bordered w-full">
  </div>

  <div class="w-full md:w-2/12 pr-5 flex align-top">
    <div class="dropdown dropdown-end w-full">
      <div tabindex="0" role="button" class="btn w-full m-1">Adicionar</div>
      <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
        <li><a href="home/categoria">Categoria</a></li>
        <li><a href="home/texto">Texto</a></li>
      </ul>
    </div>
  </div>
</div>