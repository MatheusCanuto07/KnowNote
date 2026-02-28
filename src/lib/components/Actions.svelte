<script lang="ts">
  interface Action {
    href: string;
    label: string;
    class?: string;
  }

  let { actions = [] }: { actions: Action[] } = $props();
</script>

<div class="flex flex-wrap justify-end">
  {#each actions as action}
    <div class="w-full mt-3 lg:w-2/12 lg:pl-3 lg:mt-0">
      <div class="dropdown dropdown-end w-full">
        <a href={action.href} class="btn w-full {action.class ?? 'btn-success'}">
          {action.label}
        </a>
      </div>
    </div>
  {/each}
</div>