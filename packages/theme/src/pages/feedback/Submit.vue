<template>
  <auth-form>
    <AuthFormHeader />

    <!-- Loading -->
    <loader-container v-if="loading" class="mt-16" />

    <!-- Invalid Token -->
    <template v-else-if="!isValid">
      <div class="card text-center flex flex-col items-center space-y-4">
        <error-icon class="w-8 h-8" color="#DE544E" />

        <div>
          <p class="font-semibold mb-2">Invalid or Expired Link</p>
          <p class="text-gray-500">
            This magic link is no longer valid. Please request a new one.
          </p>
        </div>
      </div>

      <div class="mt-4 text-center">
        <Button type="primary" @click="goToBoards">
          Go to Boards
        </Button>
      </div>
    </template>

    <!-- Feedback Form -->
    <template v-else>
      <div class="card">
        <div class="feedback-header">
          <h2 class="text-lg font-semibold mb-2">Submit Feedback</h2>
          <p class="text-sm text-gray-500 mb-4">
            Submitting as: {{ email }}
          </p>
        </div>

        <l-text
          v-model="title.value"
          label="Title"
          type="text"
          name="Post title"
          placeholder="Name of the feature"
          :error="title.error"
          @keyup-enter="submitFeedback"
          @hide-error="hideTitleError"
        />
        <l-textarea
          v-model="description"
          label="Description"
          rows="4"
          name="Post description"
          placeholder="What would you use it for?"
        />
        <div style="display: flex; justify-content: center;">
          <Button
            type="primary"
            :loading="submitting"
            @click="submitFeedback"
          >
            Submit
          </Button>
        </div>
      </div>
    </template>
  </auth-form>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useHead } from "@vueuse/head";
import { XCircle as ErrorIcon } from "lucide-vue";

// modules
import { router } from "../../router";
import { useSettingStore } from "../../store/settings";
import {
  validateMagicLink,
  submitFeedbackWithMagicLink,
} from "../../modules/auth";

// components
import type { FormFieldErrorType } from "../../components/ui/input/formBaseProps";
import AuthForm from "../../layout/AuthForm.vue";
import AuthFormHeader from "../../components/auth/AuthFormHeader.vue";
import LoaderContainer from "../../components/ui/LoaderContainer.vue";
import LText from "../../components/ui/input/LText.vue";
import LTextarea from "../../components/ui/input/LTextarea.vue";
import Button from "../../components/ui/Button.vue";

const { get: siteSettings } = useSettingStore();

const loading = ref(true);
const isValid = ref(false);
const email = ref("");
const boardId = ref("");
const sessionToken = ref("");

const title = reactive({
  value: "",
  error: {
    show: false,
    message: "",
  },
});
const description = ref("");
const submitting = ref(false);

function hideTitleError(event: FormFieldErrorType) {
  title.error = event;
}

async function validateToken() {
  const route = router.currentRoute.value;
  const token = route.query.token as string;

  if (!token) {
    loading.value = false;
    isValid.value = false;
    return;
  }

  try {
    const response = await validateMagicLink(token);

    if (response.data.valid) {
      isValid.value = true;
      email.value = response.data.email;
      boardId.value = response.data.boardId;
      sessionToken.value = response.data.sessionToken;
    } else {
      isValid.value = false;
    }
  } catch {
    isValid.value = false;
  } finally {
    loading.value = false;
  }
}

async function submitFeedback() {
  if (!title.value) {
    title.error.show = true;
    title.error.message = "You forgot to enter a post title";
    return;
  }

  submitting.value = true;
  try {
    const response = await submitFeedbackWithMagicLink(
      {
        title: title.value,
        contentMarkdown: description.value,
        boardId: boardId.value,
      },
      sessionToken.value,
    );

    // redirect to the created post
    const post = response.data.post as { slug: string };
    router.push(`/posts/${post.slug}`);
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    title.error.show = true;
    title.error.message =
      axiosError.response?.data?.message || "Failed to submit feedback";
  } finally {
    submitting.value = false;
  }
}

function goToBoards() {
  router.push("/boards");
}

onMounted(() => validateToken());

useHead({
  title: "Submit Feedback",
  meta: [
    {
      name: "og:title",
      content: () => `Submit Feedback · ${siteSettings.title}`,
    },
  ],
});

defineOptions({
  name: "FeedbackSubmit",
});
</script>

<style scoped>
.feedback-header {
  text-align: center;
  margin-bottom: 1rem;
}
</style>
