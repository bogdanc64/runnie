<script setup lang="ts">
  import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
  import { Label } from "@/components/ui/label";
  import { computed, reactive } from "vue";
  import { useRouter } from "vue-router";
  import { useAuthStore } from "@/store/auth";
  import type { SignUpDTO } from "runnie-common";
  import { required, email, sameAs, minLength } from "@vuelidate/validators";
  import { createThresholdValidator } from "@/lib/validators";
  import { useLoadingStore } from "@/store/loading";
  import { notifySuccess } from "@/services/toast.service";
  import { useVuelidate } from "@vuelidate/core";
  import PasswordStrengthMeter from "@/components/shared/PasswordStrengthMeter.vue";
  import zxcvbn from "zxcvbn";

  const router = useRouter();
  const authStore = useAuthStore();
  const loadingStore = useLoadingStore();

  const passwordScore = computed(() => {
    if (!formData.password) {
      return 0;
    }

    return zxcvbn(formData.password, [formData.name, formData.email]).score + 1;
  });

  const formData = reactive({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    showError: false,
  });

  const rules = {
    name: { required, length: minLength(3) },
    email: { required, email },
    password: {
      required,
      validPassword: createThresholdValidator(5, "Password strength must be maximum (5/5)", passwordScore),
    },
    confirmPassword: {
      required,
      sameAsPassword: sameAs(computed(() => formData.password)),
    },
  };

  const validator = useVuelidate(rules, formData);

  async function onSubmit() {
    try {
      const resultValid = await validator.value.$validate();
      if (!resultValid) {
        return;
      }

      const result = await authStore.signUp(formData as SignUpDTO);
      if (!result) {
        formData.showError = true;
        return;
      }

      notifySuccess("Your account has been created successfully. Please verify your email to confirm your account.");
      navigateToSignIn();
    } catch (error) {
      formData.showError = true;
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
      <CardTitle class="text-center mb-2">Register</CardTitle>
      <CardDescription class="text-center">Please fill the form to create a new account.</CardDescription>
    </CardHeader>
    <CardContent>
      <template v-if="formData.showError">
        <Alert class="mb-6" variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Something happened during the sign-up process. Please try again.</AlertDescription>
        </Alert>
      </template>
      <form @submit.prevent="onSubmit">
        <div class="grid w-full items-center gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="name">Full name</Label>
            <Input
              @input="validator.name.$touch()"
              id="name"
              name="name"
              :class="{ 'border-destructive': validator.name.$errors.length }"
              v-model="formData.name"
            />
            <span v-if="validator.name.$error" class="text-destructive text-sm">
              {{ validator.name.$errors[0].$message }}
            </span>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="email">Email</Label>
            <Input
              @input="validator.email.$touch()"
              autocomplete="off"
              id="email"
              name="email"
              :class="{ 'border-destructive': validator.email.$errors.length }"
              v-model="formData.email"
            />
            <span v-if="validator.email.$error" class="text-destructive text-sm">
              {{ validator.email.$errors[0].$message }}
            </span>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="password">Password</Label>
            <Input
              @input="validator.password.$touch()"
              id="password"
              name="password"
              autocomplete="off"
              :class="{ 'border-destructive': validator.password.$errors.length }"
              type="password"
              v-model="formData.password"
            />
            <PasswordStrengthMeter v-if="validator.password.$dirty" :password-score="passwordScore" />
            <span v-if="validator.password.$error" class="text-destructive text-sm">
              {{ validator.password.$errors[0].$message }}
            </span>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="confirmPassword">Confirm password</Label>
            <Input
              @input="validator.confirmPassword.$touch()"
              id="confirmPassword"
              name="confirmPassword"
              autocomplete="off"
              :class="{
                'border-destructive': validator.confirmPassword.$errors.length,
              }"
              type="password"
              v-model="formData.confirmPassword"
            />
            <span v-if="validator.confirmPassword.$error" class="text-destructive text-sm">
              {{ validator.confirmPassword.$errors[0].$message }}
            </span>
          </div>
          <div class="flex justify-center mt-2">
            <Button
              :is-loading="loadingStore.isLoading('auth/sign-up')"
              :disabled="validator.$invalid || loadingStore.isLoading('auth/sign-up')"
              class="w-full"
              type="submit"
            >
              Register
            </Button>
          </div>
        </div>
      </form>
    </CardContent>
    <hr />
    <CardFooter class="flex justify-between mt-6">
      <Button class="w-full" variant="outline" @click="navigateToSignIn">Go back to login</Button>
    </CardFooter>
  </Card>
</template>
