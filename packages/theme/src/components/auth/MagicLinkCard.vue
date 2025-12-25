<template>
  <card>
    <template #title>
      Submit Feedback
    </template>
    <template #label>
      Enter your email to receive a link to submit feedback
    </template>

    <div v-if="success" class="magic-link-success">
      <p>Check your email for the feedback link!</p>
      <Button type="outline" @click="resetForm">
        Send another link
      </Button>
    </div>

    <form v-else @submit.prevent="sendMagicLink">
      <l-text
        v-model="email"
        label="Email Address"
        type="email"
        name="email"
        placeholder="your@email.com"
        :error="emailError"
        @hide-error="hideEmailError"
        @keyup-enter="sendMagicLink"
      />

      <div class="magic-link-actions">
        <Button
          type="primary"
          :loading="loading"
          :full-width="true"
          @click="sendMagicLink"
        >
          Send Magic Link
        </Button>
      </div>

      <div class="magic-link-divider">
        <span>or</span>
      </div>

      <Button type="outline" @click="loginRedirect" :full-width="true">
        Login with password
      </Button>
    </form>
  </card>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { router } from "../../router";
import { requestMagicLink } from "../../modules/auth";

// components
import Card from "../ui/Card.vue";
import LText from "../ui/input/LText.vue";
import Button from "../ui/Button.vue";

const props = defineProps<{
  boardId: string;
}>();

const email = ref("");
const loading = ref(false);
const success = ref(false);
const emailError = reactive({
  show: false,
  message: "",
});

function hideEmailError() {
  emailError.show = false;
  emailError.message = "";
}

function resetForm() {
  email.value = "";
  success.value = false;
  emailError.show = false;
  emailError.message = "";
}

async function sendMagicLink() {
  if (!email.value) {
    emailError.show = true;
    emailError.message = "Email is required";
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    emailError.show = true;
    emailError.message = "Please enter a valid email address";
    return;
  }

  loading.value = true;
  try {
    await requestMagicLink({
      email: email.value,
      boardId: props.boardId,
    });
    success.value = true;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    emailError.show = true;
    emailError.message =
      axiosError.response?.data?.message || "Failed to send magic link";
  } finally {
    loading.value = false;
  }
}

function loginRedirect() {
  const route = router.currentRoute.value;

  router.push({
    path: "/login",
    query: {
      redirect: route.fullPath,
    },
  });
}
</script>

<style scoped>
.magic-link-success {
  text-align: center;
}

.magic-link-success p {
  margin-bottom: 1rem;
  color: var(--color-success, #10b981);
}

.magic-link-actions {
  margin-top: 1rem;
}

.magic-link-divider {
  display: flex;
  align-items: center;
  margin: 1rem 0;
}

.magic-link-divider::before,
.magic-link-divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid var(--color-gray-300, #d1d5db);
}

.magic-link-divider span {
  padding: 0 0.5rem;
  color: var(--color-gray-500, #6b7280);
  font-size: 0.875rem;
}
</style>
