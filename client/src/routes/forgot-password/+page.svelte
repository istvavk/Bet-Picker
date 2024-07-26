<script lang="ts">
  import {Button, Card, Checkbox, Input, Label} from "flowbite-svelte";
  import {writable} from "svelte/store";
  import {auth, functions} from "$lib/firebase";

  let form = {
    email: ''
  };

  async function sendResetLink() {
    if (!form.email) {
      return;
    }

    await auth.sendPasswordResetEmail(form.email);
  }
</script>

<svelte:head>
    <title>Bet Picker</title>
</svelte:head>

<div class="flex justify-center items-center">
    <div class="login-form w-96 my-24 border-solid border-2 border-gray-200">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0 flex justify-center items-center">Bet Picker</h3>
            <form class="flex flex-col space-y-6">
                <div>
                    <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Reset password</h3>
                    <Label class="space-y-2 mt-3.5">
                        <span>Email</span>
                        <Input type="email" name="Password" required bind:value={form.email} />
                    </Label>
                    <Button class="w-full mt-3.5 bg-white text-black" href="/sign-in">Back</Button>
                    <Button type="submit" class="w-full mt-3.5" on:click={sendResetLink}>Send reset link</Button>
                </div>
            </form>
        </div>
    </div>
</div>