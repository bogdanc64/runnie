<script setup lang="ts">
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
  import { Label } from "@/components/ui/label";
  import { reactive } from "vue";
  import { useRouter } from "vue-router";
  import { email, required } from "@vuelidate/validators";
  import useVuelidate from "@vuelidate/core";
  import { useAuthStore } from "@/store/auth";
  import { notifySuccess } from "@/services/toast.service";
  import { useLoadingStore } from "@/store/loading";

  const router = useRouter();
  const authStore = useAuthStore();
  const loadingStore = useLoadingStore();

  const forgotPasswordData = reactive({
    email: "",
    showError: false,
  });

  const rules = {
    email: { required, email },
  };

  const validator = useVuelidate(rules, forgotPasswordData);

  async function onSubmit() {
    try {
      const resultValid = await validator.value.$validate();
      if (!resultValid) {
        return;
      }

      const result = await authStore.requestResetPassword(forgotPasswordData.email);

      if (!result) {
        forgotPasswordData.showError = true;
        return;
      }

      notifySuccess(
        "Your reset password request has been sent successfully. If you have an account linked with the provided email, you will receive an email for resetting your password."
      );
      navigateToSignIn();
    } catch (error) {
      forgotPasswordData.showError = true;
      console.error("Sign up error:", error);
    }
  }

  function navigateToSignIn() {
    router.push({ name: "sign-in", replace: true });
  }
</script>

<template>
  <Card class="md:w-full md:max-w-[28rem]">
    <CardHeader>
      <CardTitle class="text-center mb-2">Forgot password</CardTitle>
      <CardDescription class="text-center">Please insert your email and reset your password.</CardDescription>
    </CardHeader>
    <CardContent>
      <template v-if="forgotPasswordData.showError">
        <Alert class="mb-6" variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Something unexpected happened on our side. Please try again later.</AlertDescription>
        </Alert>
      </template>
      <form @submit.prevent="onSubmit">
        <div class="grid w-full items-center gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="name">Email</Label>
            <Input
              @input="validator.email.$touch()"
              autocomplete="off"
              id="email"
              name="email"
              :class="{ 'border-destructive': validator.email.$errors.length }"
              v-model="forgotPasswordData.email"
            />
            <span v-if="validator.email.$error" class="text-destructive text-sm">
              {{ validator.email.$errors[0].$message }}
            </span>
          </div>
          <div class="flex justify-center mt-3">
            <Button
              :is-loading="loadingStore.isLoading('auth/request-reset-password')"
              :disabled="validator.$invalid || loadingStore.isLoading('auth/request-reset-password')"
              class="w-full"
              type="submit"
            >
              Reset password
            </Button>
          </div>
        </div>
      </form>
    </CardContent>
    <hr />
    <CardFooter class="flex justify-center mt-6">
      <Button variant="outline" class="w-full" @click="navigateToSignIn">Go back to login</Button>
    </CardFooter>
  </Card>
</template>
