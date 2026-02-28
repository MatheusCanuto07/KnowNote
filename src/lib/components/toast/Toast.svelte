<script lang="ts">
  import { toasts } from './toastStore';
  import { fly } from 'svelte/transition';
</script>

<div class="fixed top-5 right-5 flex flex-col gap-2 z-50">
  {#each $toasts as toast (toast.id)}
    <div
      class="alert shadow-lg {toast.type === 'success' ? 'alert-success' : toast.type === 'error' ? 'alert-error' : 'alert-info'}"
      in:fly={{ y: -20, duration: 300 }}
      out:fly={{ y: -20, duration: 300 }}
    >
      <span>{toast.message}</span>
    </div>
  {/each}
</div>
