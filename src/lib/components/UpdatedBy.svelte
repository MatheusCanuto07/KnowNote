<script lang="ts">
  import { Info } from '@lucide/svelte';

  interface Props {
    createdAt: string;
    updatedAt: string;
  }

  let { createdAt, updatedAt }: Props = $props();
</script>


<div class="tooltip tooltip-left">
  <div class="tooltip-content">
    <p>Criado em: {createdAt}</p>
    <p>Atualizado em: {updatedAt}</p>
  </div>
  <Info />
</div>