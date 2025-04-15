import { useAuthCacheStore } from "~/store/auth"
import type { User } from "~/types/user"

export default async () => {
  const { $api } = useNuxtApp()
  const store = useAuthCacheStore()

  const email = makeid(8) + '@teamnoco.de'
  const password = makeid(12)
  const name = 'Autoregistered User ' + makeid(3)
  
  await $api<User>("/auth/register", {
    method: "POST",
    body: {
      email,
      password,
      name
    }
  })
  store.user = await $api<User>("/auth/sign-in", {
    method: "POST",
    body: {
      email,
      password
    }
  })
  navigateTo('/')
}

function makeid(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}