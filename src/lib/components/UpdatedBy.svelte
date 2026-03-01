<script lang="ts">
  import { Info } from "lucide-svelte";

  interface Props {
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
  }

  let { createdBy, createdAt, updatedBy, updatedAt }: Props = $props();
</script>


<div class="tooltip tooltip-left">
  <div class="tooltip-content">
    <p>Criado por: {createdBy}</p>
    <p>Criado em: {createdAt}</p>
    <p>Atualizado por: {updatedBy}</p>
    <p>Atualizado em: {updatedAt}</p>
  </div>
  <Info />
</div>