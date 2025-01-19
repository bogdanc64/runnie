import { createRouter, createWebHistory, type RouteLocationNormalized } from "vue-router";
import { default as AuthLayout } from "@/layout/AuthLayout.vue";
import { default as MainLayout } from "@/layout/MainLayout.vue";
import { useAuthStore } from "@/store/auth";
import { useAssetStore } from "@/store/asset";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "layout",
      redirect: "/assets",
      component: MainLayout,
      children: [
        {
          path: "/assets",
          name: "assets",
          component: () => import("@/views/AssetsView.vue"),
          meta: {
            public: false,
          },
        },
        {
          path: "/assets/:assetId",
          name: "asset",
          meta: {
            public: false,
            requiresAsset: true,
          },
          redirect: to => `/assets/${to.params.assetId}/dashboard`,
          children: [
            {
              path: "dashboard",
              name: "asset-dashboard",
              component: () => import("@/views/DashboardView.vue"),
            },
          ]
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
  const assetStore = useAssetStore();

  // Handle authentication
  const authResult = await handleAuthentication(to, userStore);
  if (authResult) return next(authResult);

  // Handle asset validation
  const assetResult = handleAssetValidation(to, assetStore);
  if (assetResult) return next(assetResult);

  return next();
});

async function handleAuthentication(to: RouteLocationNormalized, userStore: ReturnType<typeof useAuthStore>) {
  const isPublic = to.matched.some((record) => record.meta.public);
  const onlyWhenLoggedOut = to.matched.some((record) => record.meta.onlyWhenLoggedOut);
  let loggedIn = userStore.isAuthenticated;

  // Try to refresh tokens if not logged in
  if (!loggedIn && !to.path.includes("auth")) {
    loggedIn = await userStore.refreshAuthTokens();
  }

  // Redirect to login if not authenticated
  if (!isPublic && !loggedIn) {
    return {
      path: "/auth/sign-in",
      query: { redirect: to.fullPath },
    };
  }

  // Prevent accessing login page when logged in
  if (loggedIn && onlyWhenLoggedOut) {
    return "/";
  }

  return null;
}

function handleAssetValidation(to: RouteLocationNormalized, assetStore: ReturnType<typeof useAssetStore>) {
  const requiresAsset = to.matched.some((record) => record.meta.requiresAsset);
  
  if (!requiresAsset) return null;

  const assetId = to.params.assetId as string;
  const asset = assetStore.assets.find(asset => asset.id.toString() === assetId);
  
  if (!asset) {
    return '/assets';
  }

  assetStore.selectedAsset = asset;
  return null;
}

export default router;
