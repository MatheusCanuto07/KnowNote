<script lang="ts">
  import { applyAction, enhance } from '$app/forms';
  import { showToast } from '$lib/components/toast/toastStore';
  import { type NewTextType, type CategoryType } from '$lib/server/schema/schema';
  import { goto } from '$app/navigation';
  import UpdatedBy from '$lib/components/UpdatedBy.svelte';

  import { onMount, onDestroy } from "svelte";
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import { TableKit } from '@tiptap/extension-table'
  import TableRow from "@tiptap/extension-table-row";
  import TableHeader from "@tiptap/extension-table-header";
  import TableCell from "@tiptap/extension-table-cell";

  type FormErrors = Partial<Record<keyof NewTextType, string>>;

  let {
    entidade = null,
    categories = [],
    errors = $bindable({})
  }: {
    entidade: NewTextType | null;
    categories : Array<CategoryType> | undefined;
    errors?: FormErrors;
  } = $props();

  let isNew = entidade === null;
  let isLoading = $state(false);

  let editorElement: HTMLElement;
  let editor: Editor;
  let content = $state(entidade?.content ?? "");

  onMount(() => {
    editor = new Editor({
      extensions: [
        StarterKit,
        TableKit.configure(
          {
            table: { resizable: true },
          }
        ),
        TableRow,
        TableHeader,
        TableCell,
      ],
      content: content,
      onUpdate({ editor: e }) {
        content = e.getHTML();
      }
    });
    editor.mount(editorElement);
  });

  onDestroy(() => {
    editor?.destroy();
  });
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

    return async ({ result }) => {
      if (result.status === 200) {
        showToast(`${isNew ? "Texto cadastrado" : "Texto atualizado"} com sucesso!`, "success");
        goto("/home/texto");
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
    <h1 class="text-2xl font-bold mb-1">{isNew ? "Adicionar" : "Editar"} Texto</h1>
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
    <label for="idCategory">
      <span class="label-text">Categoria <span class="text-red-500">*</span></span>
      <select 
        name="idCategory"
        id="idCategory"
        class="select select-bordered w-full {errors?.idCategory ? 'input-error' : ''}"
        value={entidade?.idCategory ?? ''}>
        <option value="">Selecione uma categoria</option>
        {#each categories as c}
          <option value="{c.id}">{c.name}</option>
        {/each}
      </select>
    </label>
  </div>

  <div class="w-full md:w-3/12 pr-5">
    <label for="name" class="label">
      <span class="label-text">Nome <span class="text-red-500">*</span></span>
    </label>
    <input
      placeholder="Nome do texto"
      type="text"
      id="name"
      name="name"
      class="input input-bordered w-full {errors?.name ? 'input-error' : ''}"
      value={entidade?.name ?? ''}>
    {#if errors?.name}
      <span class="text-error text-sm">{errors.name}</span>
    {/if}
  </div>

  <div class="w-full mt-3 pr-5">
    <div class="label">
      <span class="label-text">Conteúdo <span class="text-red-500">*</span></span>
    </div>

    <div class="rounded-lg p-2 mb-2 flex flex-wrap gap-2">
      <button type="button" class="btn btn-sm" onclick={() => editor.chain().focus().toggleBold().run()}>
        Bold
      </button>
      <button type="button" class="btn btn-sm" onclick={() => editor.chain().focus().toggleItalic().run()}>
        Italic
      </button>
      <button type="button" class="btn btn-sm" onclick={() => editor.chain().focus().toggleStrike().run()}>
        Strike
      </button>
      <button type="button" class="btn btn-sm" onclick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        H1
      </button>
      <button type="button" class="btn btn-sm" onclick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </button>
      <button type="button" class="btn btn-sm" onclick={() => editor.chain().focus().toggleBulletList().run()}>
        Lista
      </button>
      <button type="button" class="btn btn-sm" onclick={() => editor.chain().focus().toggleOrderedList().run()}>
        Lista Num
      </button>
      <div class="divider divider-horizontal mx-0"></div>
      <button type="button" class="btn btn-sm" onclick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
        Tabela
      </button>
      <button type="button" class="btn btn-sm" onclick={() => editor.chain().focus().addColumnAfter().run()}>
        + Coluna
      </button>
      <button type="button" class="btn btn-sm" onclick={() => editor.chain().focus().addRowAfter().run()}>
        + Linha
      </button>
      <button type="button" class="btn btn-sm" onclick={() => editor.chain().focus().deleteColumn().run()}>
        - Coluna
      </button>
      <button type="button" class="btn btn-sm" onclick={() => editor.chain().focus().deleteRow().run()}>
        - Linha
      </button>
      <button type="button" class="btn btn-sm" onclick={() => editor.chain().focus().deleteTable().run()}>
        Remover Tabela
      </button>
    </div>

    <div
      bind:this={editorElement}
      class="tiptap-editor border border-base-content/20 rounded-lg p-3 min-h-80 bg-base-300 [&_.ProseMirror]:min-h-72 [&_.ProseMirror]:outline-none [&_.ProseMirror]:h-full">
    </div>

    <input type="hidden" name="content" bind:value={content} />

    {#if errors?.content}
      <span class="text-error text-sm">{errors.content}</span>
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

<style>
  .tiptap-editor :global(ul) {
    list-style-type: disc;
    padding-left: 1.5rem;
  }

  .tiptap-editor :global(ol) {
    list-style-type: decimal;
    padding-left: 1.5rem;
  }

  .tiptap-editor :global(li) {
    margin-bottom: 0.25rem;
  }

  .tiptap-editor :global(h1) {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .tiptap-editor :global(h2) {
    font-size: 1.35rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .tiptap-editor :global(p) {
    margin-bottom: 0.25rem;
  }

  .tiptap-editor :global(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 0.5rem 0;
    overflow: hidden;
  }

  .tiptap-editor :global(td),
  .tiptap-editor :global(th) {
    border: 1px solid oklch(var(--bc) / 0.3);
    padding: 0.5rem;
    min-width: 80px;
    vertical-align: top;
  }

  .tiptap-editor :global(th) {
    font-weight: 700;
    background-color: oklch(var(--b2) / 1);
  }

  .tiptap-editor :global(.selectedCell) {
    background-color: oklch(var(--p) / 0.15);
  }

  .tiptap-editor :global(.column-resize-handle) {
    position: absolute;
    right: -2px;
    top: 0;
    bottom: -2px;
    width: 4px;
    background-color: oklch(var(--p) / 0.6);
    pointer-events: none;
  }
</style>