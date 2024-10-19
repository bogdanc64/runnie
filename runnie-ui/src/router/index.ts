import { createRouter, createWebHistory } from "vue-router";
import { default as AuthLayout } from "@/layout/AuthLayout.vue";
import { default as MainLayout } from "@/layout/MainLayout.vue";
import { useAuthStore } from "@/store/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "layout",
      redirect: "/dashboard",
      component: MainLayout,
      children: [
        {
          path: "/dashboard",
          name: "dashboard",
          component: () => import("@/views/DashboardView.vue"),
          meta: {
            public: false,
          },
        },
      ],
    },
    {
      path: "/auth",
      name: "auth",
      component: AuthLayout,
      children: [
        {
          path: "sign-in",
          name: "sign-in",
          component: () => import("@/views/auth/SignInView.vue"),
          meta: {
            public: true,
            onlyWhenLoggedOut: true,
          },
        },
        {
          path: "register",
          name: "register",
          component: () => import("@/views/auth/RegisterView.vue"),
          meta: {
            public: true,
            onlyWhenLoggedOut: true,
          },
        },
        {
          path: "forgot-password",
          name: "forgot-password",
          component: () => import("@/views/auth/ForgotPasswordView.vue"),
          meta: {
            public: true,
            onlyWhenLoggedOut: true,
          },
        },
        {
          path: "reset-password",
          name: "reset-password",
          component: () => import("@/views/auth/ResetPasswordView.vue"),
          meta: {
            public: true,
            onlyWhenLoggedOut: true,
          },
        },
        {
          path: "verify-email",
          name: "verify-email",
          component: () => import("@/views/auth/VerifyEmailView.vue"),
          meta: {
            public: true,
            onlyWhenLoggedOut: true,
          },
        },
      ],
    },
  ],
});

router.beforeEach(async (to, _, next) => {
  const userStore = useAuthStore();
  const isPublic = to.matched.some((record) => record.meta.public);
  const onlyWhenLoggedOut = to.matched.some((record) => record.meta.onlyWhenLoggedOut);
  let loggedIn = userStore.isAuthenticated;

  if (!loggedIn && !to.path.includes("auth")) {
    loggedIn = await userStore.refreshAuthTokens();
  }

  if (!isPublic && !loggedIn) {
    return next({
      path: "/auth/sign-in",
      query: { redirect: to.fullPath },
    });
  }

  if (loggedIn && onlyWhenLoggedOut) {
    return next("/");
  }

  next();
});

export default router;
