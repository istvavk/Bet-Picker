import {writable} from "svelte/store";
import { type User } from 'firebase/auth';

export const authUser = writable<User>(undefined);