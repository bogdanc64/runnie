<script setup lang="ts">
  import { Button } from "@/components/ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { onMounted, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useAuthStore } from "@/store/auth";

  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();
  const isTokenValid = ref(false);

  function navigateToSignIn() {
    router.push({ name: "sign-in", replace: true });
  }

  onMounted(async () => {
    const token = (route.query.token as string) || null;
    if (!token) {
      return;
    }

    isTokenValid.value = await authStore.verifyEmail(token);
  });
</script>

<template>
  <Card class="w-[350px]">
    <CardHeader>
      <CardTitle class="text-center mb-2">Verify your account</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="flex justify-center flex-col">
        <template v-if="isTokenValid">
          <h3 class="text-center">Your account has been verified successfully.</h3>
          <div class="flex justify-center pt-[2rem]">
            <Button class="w-full" @click="navigateToSignIn">Navigate to login</Button>
          </div>
        </template>
        <template v-else>
          <h3 class="text-center">The token has expired or is invalid.</h3>
          <!--TODO: Add a resend email functionality-->
          <!-- <div class="flex justify-center mt-3">
            <Button class="w-full" @click="navigateToSignIn">Resend token</Button>
          </div> -->
        </template>
      </div>
    </CardContent>
  </Card>
</template>
