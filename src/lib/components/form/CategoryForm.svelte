<script lang="ts">
  import { applyAction, enhance } from '$app/forms';
  import { showToast } from '$lib/components/toast/toastStore';
  import { type NewCategoryType, type ThemeType } from '$lib/server/schema/schema';
  import { goto } from '$app/navigation';
  import UpdatedBy from '$lib/components/UpdatedBy.svelte';

  type FormErrors = Partial<Record<keyof NewCategoryType, string>>;

  let {
    entidade = null,
    themes = [],
    errors = $bindable({})
  }: {
    entidade: NewCategoryType | null;
    themes : Array<ThemeType>;
    errors?: FormErrors;
  } = $props();

  let isNew = entidade === null;
  let isLoading = $state(false);
</script>

<form
  method="POST"
  class="w-full flex flex-wrap p-6 rounded-xl shadow-md mb-10"
  use:enhance={({ cancel }) => {
    if (isLoading) {
      cancel();
      return;
    }
    isLoading = true;

    return async ({ result, update }) => {
      if (result.status === 200) {
        showToast(`${isNew ? "Categoria cadastrada" : "Categoria atualizada"} com sucesso!`, "success");
        goto("/home/categoria");
      } else {
        await applyAction(result);

        if (result.type === 'failure') {
          if (result.data?.errors) {
            errors = result.data.errors as FormErrors;
          }
          if (result.data?.exception) {
            showToast(result.data.exception as string, "error");
          } else {
            showToast("Ocorreu um erro!", "error");
          }
        }

        isLoading = false;
      }
    };
  }}
>
  <div class="w-full flex justify-between">
    <h1 class="text-2xl font-bold mb-1">{isNew ? "Adicionar" : "Editar"} Categoria</h1>
    {#if !isNew}
      <UpdatedBy
        createdAt={entidade?.createdAt ? new Date(entidade?.createdAt.getTime() / 1000).toLocaleString() : 'N/A'}
        updatedAt={entidade?.updatedAt ? new Date(entidade?.updatedAt).toLocaleString() : 'N/A'}
      />
    {/if}
  </div>
  <div class="w-full divider"></div>
  <input type="hidden" name="id" value={entidade?.id ?? ''} />

  <div class="w-full md:w-3/12 pr-5">
    <label for="name" class="label">
      <span class="label-text">Nome <span class="text-red-500">*</span></span>
    </label>
    <input
      placeholder="Nome da categoria"
      type="text"
      id="name"
      name="name"
      class="input input-bordered w-full {errors?.name ? 'input-error' : ''}"
      value={entidade?.name ?? ''}>
    {#if errors?.name}
      <span class="text-error text-sm">{errors.name}</span>
    {/if}
  </div>

  <div class="w-full md:w-4/12 pr-5">
    <label for="description" class="label">
      <span class="label-text">Descricao <span class="text-red-500">*</span></span>
    </label>
    <input
      placeholder="Descricao da categoria"
      type="text"
      id="description"
      name="description"
      class="input input-bordered w-full {errors?.description ? 'input-error' : ''}"
      value={entidade?.description ?? ''}>
    {#if errors?.description}
      <span class="text-error text-sm">{errors.description}</span>
    {/if}
  </div>

  <div class="w-full md:w-3/12 pr-5">
    <label for="idTheme">
      <span class="label-text">Tema <span class="text-red-500">*</span></span>
      <select 
        name="idTheme"
        id="idTheme"
        class="select select-bordered w-full {errors?.idTheme ? 'input-error' : ''}"
        value={entidade?.idTheme ?? ''}>
        <option value="">Selecione um tema</option>
        {#each themes as t}
          <option value="{t.id}">{t.name}</option>
        {/each}
      </select>
    </label>
  </div>

  <div class="w-full md:w-2/12">
    <label for="active" class="label">
      <span class="label-text">Ativo</span>
    </label>
    <select id="active" name="active" class="select select-bordered w-full {errors?.active ? 'input-error' : ''}">
      <option value="true" selected={entidade?.active === true}>Sim</option>
      <option value="false" selected={entidade?.active === false}>Nao</option>
    </select>
    {#if errors?.active}
      <span class="text-error text-sm">{errors.active}</span>
    {/if}
  </div>

  <div class="w-full flex justify-end mt-5 pr-5">
    <button type="submit" class="btn btn-success" disabled={isLoading}>
      {#if isLoading}
        <span class="loading loading-spinner"></span>
        Enviando...
      {:else}
        Enviar
      {/if}
    </button>
  </div>
</form>
