<script lang="ts">
  import { goto } from "$app/navigation";
  import type { PageProps } from "./$types";
  import { showToast } from "$lib/components/toast/toastStore";
  import Toast from "$lib/components/toast/Toast.svelte";
  import { authClient } from "$lib/auth/auth-client";

  let isLoading = $state(false);
  let isError = $state(false);
  let userEmail = $state("");
  let password = $state("");

  function validarEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  async function submitLogin() {
    event.preventDefault();
    isLoading = true;

    if (!validarEmail(userEmail)) {
      showToast("Email ou senha inválida", "error");
      isLoading = false;
      return;
    }
    if (password.length < 8) {
      isLoading = false;
      showToast("Email ou senha inválida", "error");
      return;
    }
    const { data, error } = await authClient.signIn.email({
      email :userEmail ,
      password,
      callbackURL: "/home",
    }, {
      //callbacks
    })

    isLoading = false;
    if (error) {
      showToast("Usuário ou senha inválida", "error");
      isError = true;
      return;
    }
    
    showToast("Login realizado!", "success");
    goto("/home");

  }

  let { data }: PageProps = $props();
</script>

<Toast />

<div class="h-screen flex flex-col items-center justify-center bg-base-200">
  <div class="w-full max-w-md border border-gray-300 p-8 rounded-xl shadow-md bg-base-100 mx-auto">
    <div class="text-center mb-6">
      <h1
        class="text-4xl font-bold tracking-wide
        bg-gradient-to-r from-red-600 via-gray-500 to-red-600
        bg-[length:200%_200%] bg-clip-text text-transparent
        gradient-animate"
      >
        RM LOGÍSTICA
      </h1>
      <h2 class="text-lg text-base-content opacity-70">Bem-vindo de volta!</h2>
    </div>
    <form class="flex flex-col gap-4" onsubmit={submitLogin}>
      <div>
        <label for="email" class="label">
          <span class="label-text">Email</span>
        </label>
        <input
          type="email"
          name="email"
          id="email"
          bind:value={userEmail}
          placeholder="Digite seu email"
          class="input input-bordered w-full {isError ? 'isErrorInput' : ''}"
          required
        />
      </div>

      <div>
        <label for="senha" class="label">
          <span class="label-text">Senha</span>
        </label>
        <input
          type="password"
          name="senha"
          id="senha"
          bind:value={password}
          placeholder="********"
          class="input input-bordered w-full {isError ? 'isErrorInput' : ''}"
          required
        />
      </div>

      <!-- <div>
        <a href="/esquecisenha" class="text-primary">Esqueceu sua senha?</a>
      </div> -->

      <div class="mt-4">
        <button class="btn btn-success w-full" disabled={isLoading}
          >Entrar
          {#if isLoading}
            {@html '<span class="loading loading-spinner loading-md"></span>'}
          {/if}
        </button>
      </div>
    </form>
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

  .isErrorInput{
    border-color: red;
  }
</style>
