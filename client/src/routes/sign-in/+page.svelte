<script lang="ts">
  import {Button, Input, Label} from "flowbite-svelte";
  import {auth, firebase} from "$lib/firebase";
  import toast, { Toaster } from 'svelte-french-toast';
  import {onMount} from "svelte";

  let form = {
    email: '',
    password: ''
  };

  async function signIn() {
    if (!form.email || !form.password) {
      return;
    }

    await auth.signInWithEmailAndPassword(form.email, form.password).then(() => {
      console.log('Signed in');
      toast.success("Signed in successfully");
    }).catch((error) => {
      console.error(error);
      toast.error("Wrong email or password")
    });
  }
</script>

<svelte:head>
    <title>Bet Picker</title>
</svelte:head>

<Toaster />

<div class="flex justify-center items-center">
    <div class="login-form w-96 my-24 border-solid border-2 border-gray-200">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0 flex justify-center items-center">Bet
                Picker</h3>
            <form class="flex flex-col space-y-6">
                <div>
                    <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Sign In</h3>
                    <Label class="space-y-2 mt-3.5">
                        <span>Your email</span>
                        <Input bind:value={form.email} name="email" placeholder="name@company.com" required
                               type="email"/>
                    </Label>
                    <Label class="space-y-2 mt-3.5">
                        <span>Your password</span>
                        <Input bind:value={form.password} name="password" placeholder="•••••" required type="password"/>
                    </Label>
                    <Button class="w-full mt-3.5" on:click={signIn}>Sign In</Button>
                    <p class="text-sm font-light text-gray-500 dark:text-gray-400 mt-3.5">
                        Don’t have an account yet? <a
                            class="font-medium text-primary-600 hover:underline dark:text-primary-500" href="/sign-up">Sign
                        up</a>
                    </p>
                    <hr class="mt-2">
                </div>
            </form>
        </div>
    </div>
</div>