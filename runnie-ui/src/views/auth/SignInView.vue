<script setup lang="ts">
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
  import { Label } from "@/components/ui/label";
  import { Icon } from "@iconify/vue";
  import { reactive, ref } from "vue";
  import { useRouter } from "vue-router";
  import { PinInput, PinInputGroup, PinInputInput } from "@/components/ui/pin-input";
  import { useAuthStore } from "@/store/auth";
  import { useLoadingStore } from "@/store/loading";
  import type { SignInDTO } from "runnie-common";
  import { email, required } from "@vuelidate/validators";
  import useVuelidate from "@vuelidate/core";

  const router = useRouter();
  const authStore = useAuthStore();
  const loadingStore = useLoadingStore();

  const is2FAVisible = ref(false);
  const showError = ref(false);
  const loginData = reactive({
    email: "",
    password: "",
  });

  const rules = {
    email: { required, email },
    password: { required },
  };

  const validator = useVuelidate(rules, loginData);

  async function handleSubmit() {
    const response = await authStore.signIn(loginData as SignInDTO);

    showError.value = !response;
    if (!response) {
      return;
    }

    navigateToAssets();
  }

  function handleOTPSubmit() {
    navigateToAssets();
  }

  function navigateToAssets() {
    router.push({ name: "assets", replace: true });
  }

  function navigateToSignIn() {
    router.push({ name: "", replace: true });
    is2FAVisible.value = false;
  }

  function navigateToRegister() {
    router.push({ name: "register", replace: true });
  }

  function navigateToForgotPassword() {
    router.push({ name: "forgot-password", replace: true });
  }
</script>

<template>
  <template v-if="!is2FAVisible">
    <Card class="md:w-full md:max-w-[24rem]">
      <CardHeader>
        <CardTitle class="text-center mb-2">Login</CardTitle>
        <CardDescription class="text-center">
          Please login into your account using credentials or social account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <template v-if="showError">
          <Alert class="mb-6" variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Invalid credentials or invalid login type.</AlertDescription>
          </Alert>
        </template>
        <form @submit.prevent="handleSubmit">
          <div class="grid w-full items-center gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="name">Email</Label>
              <Input
                @input="validator.email.$touch()"
                autocomplete="off"
                id="email"
                name="email"
                :class="{ 'border-destructive': validator.email.$errors.length }"
                v-model="loginData.email"
              />
              <span v-if="validator.email.$error" class="text-destructive text-sm">
                {{ validator.email.$errors[0].$message }}
              </span>
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label for="name">Password</Label>
              <Input
                @input="validator.password.$touch()"
                id="password"
                name="password"
                autocomplete="off"
                :class="{ 'border-destructive': validator.password.$errors.length }"
                type="password"
                v-model="loginData.password"
              />
              <a class="text-sm text-muted-foreground cursor-pointer text-end" @click="navigateToForgotPassword">
                Forgot password?
              </a>
            </div>
          </div>
          <div class="flex justify-center mt-6">
            <Button
              class="w-full"
              type="submit"
              :is-loading="loadingStore.isLoading('auth/sign-in')"
              :disabled="validator.$invalid || loadingStore.isLoading('auth/sign-in')"
            >
              Login
            </Button>
          </div>
        </form>
        <div class="flex justify-center mt-6">
          <Button variant="outline" class="w-full" @click="navigateToRegister">Create an account</Button>
        </div>
      </CardContent>
      <hr />
      <CardFooter class="flex justify-center mt-6">
        <Button variant="outline" class="w-full" @click="authStore.googleAuth">
          <Icon icon="devicon:google" class="mr-2"></Icon>
          Login with Google account
        </Button>
      </CardFooter>
    </Card>
  </template>
  <template v-else>
    <Card class="max-w-[650px]">
      <CardHeader>
        <CardTitle class="text-center mb-2">Set 2FA</CardTitle>
        <CardDescription class="text-center">Please set the 2FA.</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex justify-content-center">
          <PinInput id="pin-input" placeholder="○" @complete="handleOTPSubmit">
            <PinInputGroup>
              <PinInputInput v-for="(id, index) in 6" :key="id" :index="index" />
            </PinInputGroup>
          </PinInput>
        </div>
        <div class="flex justify-center mt-6">
          <Button variant="outline" class="w-full" @click="navigateToSignIn">Go back to login</Button>
        </div>
      </CardContent>
    </Card>
  </template>
</template>
