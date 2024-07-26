<script lang="ts">
  import {Button, Input, Label} from "flowbite-svelte";
  import {auth, functions} from "$lib/firebase";

  let form = {
    email: '',
    password: ''
  };

  async function signUp() {
    if (!form.email || !form.password) {
      return;
    }

    await functions.call('api-createUser', {
      email: form.email,
      password: form.password
    }).then(async (response) => {

      if (!response?.data?.id) {
        console.log('error');
        return;
      }

      await auth.signInWithEmailAndPassword(form.email, form.password);
    }).catch(() => {
      console.log('error');
    });
  }
</script>

<svelte:head>
    <title>Bet Picker</title>
</svelte:head>

<div class="flex justify-center items-center">
    <div class="login-form w-96 my-24 border-solid border-2 border-gray-200">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0 flex justify-center items-center">Bet
                Picker</h3>
            <form class="flex flex-col space-y-6">
                <div>
                    <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Sign Up</h3>
                    <Label class="space-y-2 mt-3.5">
                        <span>Your email</span>
                        <Input bind:value={form.email} name="email" placeholder="name@company.com" required
                               type="email"/>
                    </Label>
                    <Label class="space-y-2 mt-3.5">
                        <span>Your password</span>
                        <Input bind:value={form.password} name="password" placeholder="•••••" required type="password"/>
                    </Label>
                    <a class="flex items-start justify-start text-sm text-blue-700 hover:underline dark:text-blue-500 mt-3.5"
                       href="/forgot-password">Forgot password?</a>
                    <Button class="w-full mt-3.5" on:click={signUp}>Sign Up</Button>
                    <p class="text-sm font-light text-gray-500 dark:text-gray-400 mt-3.5">
                        Already have an account? <a
                            class="font-medium text-primary-600 hover:underline dark:text-primary-500" href="/sign-in">Sign
                        in</a>
                    </p>
                    <hr class="mt-2">
                    <div class="flex justify-center mt-3.5">
                        <Button class="bg-white text-black border-gray-300 shadow-md hover:bg-gray-100" type="button"
                                variant="outline">
                            <img alt="Google logo" class="mr-2 h-5" src="google.svg"/>
                            Sign up with Google
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>