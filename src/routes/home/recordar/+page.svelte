<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import { showToast } from "$lib/components/toast/toastStore";

  let { data, form } = $props();
  let hasAnswered = $state(false);
  let isSubmitting = $state(false);

  let { card, dueCount, totalCount } = $derived(data);

  $effect(() => {
    card?.textId;
    hasAnswered = false;
  });

  $effect(() => {
    if (!form) return;

    if (
      "success" in form &&
      form.success &&
      "message" in form &&
      form.message
    ) {
      showToast(form.message as string, "success");
    }

    if ("success" in form && !form.success) {
      if ("error" in form && form.error) {
        showToast(form.error as string, "error");
      }
    }

  });

  function revealAnswer() {
    hasAnswered = true;
  }
</script>

<Breadcrumbs
  items={[
    { href: "/home", label: "Home" },
    { href: "/home/recordar", label: "Recordar" },
  ]}
/>

<div class="mt-5 rounded-xl border border-base-content/15 bg-base-100 p-4">
  <div class="flex items-center justify-between gap-3 flex-wrap">
    <h2 class="text-lg font-semibold">Sessão de Revisão (baralho de textos)</h2>
    <div class="badge badge-outline">
      Pendentes: {dueCount} / Total: {totalCount}
    </div>
  </div>

  {#if !card}
    <div class="mt-6 alert alert-info">
      <span
        >Nenhum texto pendente agora. Cadastre/ative textos para revisar depois.</span
      >
    </div>
  {:else}
    <div class="mt-6 rounded-xl border border-base-content/10 p-5 bg-base-200/30">
      <p class="text-sm opacity-70">{card.category}</p>
      <p class="text-3xl font-bold mt-1">{card.word}</p>

      {#key card.textId}
      <form
        method="POST"
        action="?/review"
        class="mt-5 space-y-4"
        use:enhance={({ cancel }) => {
          if (isSubmitting) {
            cancel();
            return;
          }

          isSubmitting = true;

          return async ({ result }) => {
            if (result.status === 200) {
              await applyAction(result);
              await invalidateAll();
            } else {
              await applyAction(result);
            }

            isSubmitting = false;
          };
        }}>
        <input type="hidden" name="textId" value={card.textId} />

        <div>
          <label class="label" for="typedMeaning">
            <span class="label-text"
              >Digite o significado com suas palavras</span
            >
          </label>
          <textarea
            id="typedMeaning"
            name="typedMeaning"
            class="textarea textarea-bordered w-full"
            rows="5"
            placeholder="Sua resposta..."
          ></textarea>
        </div>

        {#if !hasAnswered}
          <button type="button" class="btn btn-outline" onclick={revealAnswer} disabled={isSubmitting}
            >Revelar Gabarito</button
          >
        {/if}

        {#if hasAnswered}
          <div
            class="rounded-lg bg-base-100 border border-base-content/10 p-4 space-y-2"
          >
            <p class="text-sm opacity-70">
              Significado esperado
            </p>
            <p>{@html card.expectedMeaning}</p>

            {#if form?.actionType === "review" && "similarity" in form}
              <div class="mt-2">
                <span class="badge badge-neutral">Similaridade automática: {form.similarity}%</span>
                {#if "autoCorrect" in form}
                  <span
                    class="badge ml-2 {form.autoCorrect
                      ? 'badge-success'
                      : 'badge-warning'}"
                  >
                    {form.autoCorrect
                      ? "Auto-correção: compatível"
                      : "Auto-correção: abaixo de 70%"}
                  </span>
                {/if}
              </div>
            {/if}
          </div>

          <div>
            <p class="text-sm opacity-70 mb-2">
              Classifique seu nível de memorização
            </p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                class="btn btn-error"
                type="submit"
                name="grade"
                value="again"
                disabled={isSubmitting}>Again</button
              >
              <button
                class="btn btn-warning"
                type="submit"
                name="grade"
                value="hard"
                disabled={isSubmitting}>Hard</button
              >
              <button
                class="btn btn-info"
                type="submit"
                name="grade"
                value="good"
                disabled={isSubmitting}>Good</button
              >
              <button
                class="btn btn-success"
                type="submit"
                name="grade"
                value="easy"
                disabled={isSubmitting}>Easy</button
              >
            </div>
          </div>
        {/if}
      </form>
      {/key}
    </div>
  {/if}
</div>
