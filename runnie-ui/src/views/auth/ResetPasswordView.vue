<script setup lang="ts">
  import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Label } from "@/components/ui/label";
  import { notify } from "@/services/toast.service";
  import { required, sameAs } from "@vuelidate/validators";
  import { createThresholdValidator } from "@/lib/validators";
  import { useAuthStore } from "@/store/auth";
  import { useLoadingStore } from "@/store/loading";
  import { computed, onMounted, reactive } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import useVuelidate from "@vuelidate/core";
  import zxcvbn from "zxcvbn";
  import PasswordStrengthMeter from "@/components/shared/PasswordStrengthMeter.vue";

  const router = useRouter();
  const authStore = useAuthStore();
  const loadingStore = useLoadingStore();
  const route = useRoute();

  const passwordScore = computed(() => {
    if (!formData.password) {
      return 0;
    }

    return zxcvbn(formData.password).score + 1;
  });

  const formData = reactive<{
    token: string | null;
    password: string;
    confirmPassword: string;
    isValidToken: boolean;
    showError: boolean;
  }>({
    token: null,
    password: "",
    confirmPassword: "",
    isValidToken: false,
    showError: false,
  });

  const rules = {
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
      if (!resultValid || !formData.token) return;

      const result = await authStore.resetPassword(formData.token, formData.password);
      if (!result) {
        formData.showError = true;
        return;
      }

      notify("Success", "The password has been resetted successfully.", "mdi:success-circle");

      navigateToSignIn();
    } catch (error) {
      formData.showError = true;
      console.error("Reset password error:", error);
    }
  }

  function navigateToSignIn() {
    router.push({ name: "sign-in", replace: true });
  }

  onMounted(() => {
    formData.token = (route.query.token as string) || null;
    if (!formData.token) {
      formData.isValidToken = false;
    }
  });
</script>

<template>
  <Card class="md:w-full md:max-w-[28rem]">
    <CardHeader>
      <CardTitle class="text-center mb-2">Reset password</CardTitle>
    </CardHeader>
    <CardContent>
      <template v-if="formData.showError">
        <Alert class="mb-6" variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Something unexpected happened on our side. Please try again later.</AlertDescription>
        </Alert>
      </template>
      <form @submit.prevent="onSubmit">
        <div class="grid w-full items-center gap-4">
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
              :is-loading="loadingStore.isLoading('auth/reset-password')"
              :disabled="validator.$invalid || loadingStore.isLoading('auth/reset-password')"
              class="w-full"
              type="submit"
            >
              Reset pasword
            </Button>
          </div>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
