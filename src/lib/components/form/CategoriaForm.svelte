<script lang="ts">
  import { applyAction, enhance } from '$app/forms';
  import { showToast } from '$lib/components/toast/toastStore';
  import { type NewCategoriaType } from '$lib/server/schema/schema';
  import { goto } from '$app/navigation';
  import UpdatedBy from '$lib/components/UpdatedBy.svelte';

  type FormErrors = Partial<Record<keyof NewCategoriaType, string>>;

  let {
    entidade = null,
    // Permite atualizar o valor da props dentro do componente
    errors = $bindable({})
  }: {
    entidade: NewCategoriaType | null;
    errors?: FormErrors;
  } = $props();

  let isNew = entidade === null;
  let isLoading = $state(false);
</script>

<form 
  method="POST" 
  class="w-full flex flex-wrap bg-white p-6 rounded-xl shadow-md mb-10"
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

        // result.data contém o retorno do action
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
        createdBy={entidade?.createdBy ?? 'N/A'}
        createdAt={entidade?.createdAt ? new Date(entidade?.createdAt.getTime() / 1000).toLocaleString() : 'N/A'}
        updatedBy={entidade?.updatedBy ?? 'N/A'}
        updatedAt={!entidade?.updatedBy ? 'N/A' : entidade?.updatedAt ? new Date(entidade?.updatedAt).toLocaleString() : 'N/A'}
      />
    {/if}
  </div>
  <div class="w-full divider"></div>
  <input type="hidden" name="id" value={entidade?.id ?? ''} />
  <div class="w-full md:w-5/12 pr-5">
    <label for="name" class="label">
      <span class="label-text">Nome <span class="text-red-500">*</span></span>
    </label>
    <input 
      placeholder="Nome da categoria"
      type="text"
      id="name"
      name="name"
      class="input input-bordered w-full {errors?.name ? 'input-error' : ''}"
      value={entidade?.name ?? ''}
    >
    {#if errors?.name}
      <span class="text-error text-sm">{errors.name}</span>
    {/if}
  </div>

  <div class="w-full md:w-2/12">
    <label for="active" class="label">
      <span class="label-text">Ativo</span>
    </label>
    <select id="active" name="active" class="select select-bordered w-full {errors?.active ? 'input-error' : ''}">
      <option value="true" selected={entidade?.active === true}>Sim</option>
      <option value="false" selected={entidade?.active === false}>Não</option>
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