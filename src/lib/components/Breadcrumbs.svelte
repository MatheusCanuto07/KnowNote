<script lang="ts">
  interface BreadcrumbItem {
    href: string;
    label: string;
  }

  let { items = [] }: { items: BreadcrumbItem[] } = $props();
</script>

<div class="breadcrumbs text-sm">
  <ul>
    {#each items as item}
      <li><a href={item.href}>{item.label}</a></li>
    {/each}
  </ul>
</div>