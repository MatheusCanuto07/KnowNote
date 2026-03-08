<script lang="ts">
  import { Palette, Tag, FileText, Settings, House } from '@lucide/svelte';
  import Toast from "$lib/components/toast/Toast.svelte"; 
	let { data, children } = $props();
  let isOpen = $state(false);

  let telas = [
    { label: "Home",          urlAtt: "/home",              Icon: House      },
    { label: "Tema",          urlAtt: "/home/tema",          Icon: Palette  },
    { label: "Categoria",     urlAtt: "/home/categoria",     Icon: Tag      },
    { label: "Texto",         urlAtt: "/home/texto",         Icon: FileText },
    { label: "Configurações", urlAtt: "/home/configuracoes", Icon: Settings },
  ];
</script>

<svelte:head>
	<title>KnowNote</title> 
  <link rel="icon" type="image/png" href="/favicon.png" />
</svelte:head>

<Toast />

<div class="bg-white h-screen">
  <div class="drawer lg:drawer-open">
  <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <nav class="navbar w-full bg-base-300">
      <label for="my-drawer-4" aria-label="open sidebar" class="btn btn-square btn-ghost">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor" class="my-1.5 inline-block size-4"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
      </label>
      <div class="px-4">KnowNote</div>
    </nav>
    <div class="px-4 sm:px-8 md:px-12 lg:px-14 xl:px-16 2xl:px-20 overflow-y-auto bg-base-100 h-screen">
      {@render children?.()}
    </div>
  </div>

  <div class="drawer-side is-drawer-close:overflow-visible">
    <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
    <div class="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
      <ul class="menu w-full grow">
        {#each telas as { urlAtt, label, Icon }}
          <li>
            <a href="{urlAtt}" class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip={label}>
              <Icon size="16"/>
              <span class="is-drawer-close:hidden">{label}</span>
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>
</div>

<style>
  @keyframes gradientMove {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .gradient-animate {
    animation: gradientMove 5s ease infinite;
    background-size: 200% 200%;
  }
</style>