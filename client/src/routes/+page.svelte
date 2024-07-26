<script lang="ts">
  import {Alert, Button} from 'flowbite-svelte';
  import {goto} from "$app/navigation";
  import {auth} from "$lib/firebase";
</script>

<Button on:click={() => goto('/sign-in')}>Login</Button>
<Button on:click={() => auth.signOut()}>Logout</Button>