import type { ApiClient, AuthResponse, PermissionAction, PermissionResource, SignInDTO, SignUpDTO } from "runnie-common";
import { defineStore } from "pinia";
import { useLoadingStore } from "./loading";
import type { ResetPasswordDTO } from "runnie-common/dist/src/models/auth";

interface AuthState {
  authResponse: AuthResponse | null;
  isAuthenticated: boolean;
}

const DefaultState: AuthState = {
  authResponse: null,
  isAuthenticated: false
}

export const useAuthStore = defineStore("auth", {
  state: () => ({ ...DefaultState }),

  getters: {
    getFullName(): string {
      return this.authResponse?.fullName ?? "Guest";
    },
    getUserEmail(): string | undefined {
      return this.authResponse?.email;
    },
    getUserAvatar(): string | undefined {
      return this.authResponse?.avatar;
    },
    hasPermission(): (resource: PermissionResource, action: PermissionAction) => boolean {
      return (resource: PermissionResource, action: PermissionAction) => {
        return this.authResponse?.permissions[resource]?.some(permissionAction => permissionAction === action) ?? false;
      }
    },
  },

  actions: {
    resetState() {
      const defaultState = { ...DefaultState};
      this.authResponse = defaultState.authResponse;
      this.isAuthenticated = defaultState.isAuthenticated;
    },

    setAuthResponse(response: AuthResponse) {
      this.authResponse = response;
      this.isAuthenticated = true;
    },
    
    async signOut() {
      const loadingStore = useLoadingStore();

      try {
        loadingStore.setLoadingState("auth/sign-out", true);
        const apiClient = (this as any).apiClient as ApiClient;
        await apiClient.auth.signOut();
        
        this.resetState()
        return true;
      } catch (error) {
        console.error("Sign out failed:", error);
        return false;
      } finally {
        loadingStore.setLoadingState("auth/sign-out", false);
      }
    },

    async signIn(data: SignInDTO): Promise<boolean> {
      const loadingStore = useLoadingStore();

      try {
        loadingStore.setLoadingState("auth/sign-in", true);

        const apiClient = (this as any).apiClient as ApiClient;
        const response = await apiClient.auth.signIn(data);
        this.setAuthResponse(response.data);

        return true;
      } catch (error) {
        return false;
      } finally {
        loadingStore.setLoadingState("auth/sign-in", false);
      }
    },

    async refreshAuthTokens(): Promise<boolean> {
      const loadingStore = useLoadingStore();

      try {
        loadingStore.setLoadingState("auth/sign-in", true);

        const apiClient = (this as any).apiClient as ApiClient;
        const response = await apiClient.auth.refreshAuthTokens();
        this.setAuthResponse(response.data);

        return true;
      } catch (error) {
        return false;
      } finally {
        loadingStore.setLoadingState("auth/sign-in", false);
      }
    },

    async signUp(data: SignUpDTO): Promise<boolean> {
      const loadingStore = useLoadingStore();

      try {
        loadingStore.setLoadingState("auth/sign-up", true);

        const apiClient = (this as any).apiClient as ApiClient;
        await apiClient.auth.signUp(data);

        return true;
      } catch (error) {
        return false;
      } finally {
        loadingStore.setLoadingState("auth/sign-up", false);
      }
    },

    async verifyEmail(token: string): Promise<boolean> {
      const loadingStore = useLoadingStore();

      try {
        loadingStore.setLoadingState("auth/verify-email", true);

        const apiClient = (this as any).apiClient as ApiClient;
        await apiClient.auth.verifyEmail(token);

        return true;
      } catch (error) {
        return false;
      } finally {
        loadingStore.setLoadingState("auth/verify-email", false);
      }
    },

    async requestResetPassword(email: string): Promise<boolean> {
      const loadingStore = useLoadingStore();

      try {
        loadingStore.setLoadingState("auth/request-reset-password", true);

        const apiClient = (this as any).apiClient as ApiClient;
        await apiClient.auth.requestResetPassword(email);

        return true;
      } catch (error) {
        return false;
      } finally {
        loadingStore.setLoadingState("auth/request-reset-password", false);
      }
    },

    async resetPassword(token: string, password: string): Promise<boolean> {
      const loadingStore = useLoadingStore();

      try {
        loadingStore.setLoadingState("auth/reset-password", true);
        
        const body = { token, password } as ResetPasswordDTO;
        const apiClient = (this as any).apiClient as ApiClient;
        await apiClient.auth.resetPassword(body);

        return true;
      } catch (error) {
        return false;
      } finally {
        loadingStore.setLoadingState("auth/reset-password", false);
      }
    },

    async googleAuth() {
      try {
        const apiClient = (this as any).apiClient as ApiClient;
        await apiClient.auth.googleAuth();
      } catch (error) {
        console.error(error)
      } 
    },
  },
});