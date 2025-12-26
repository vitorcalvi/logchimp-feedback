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

        <!-- Screenshot Upload -->
        <div class="screenshot-section">
          <label class="screenshot-label">Screenshots (optional)</label>
          <div class="screenshot-upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              multiple
              class="hidden-input"
              @change="handleFileSelect"
            />
            <div class="upload-placeholder">
              <CameraIcon class="upload-icon" />
              <span>Click or drag images here</span>
              <span class="upload-hint">Max 5 images, 5MB each</span>
            </div>
          </div>

          <!-- Screenshot Previews -->
          <div v-if="screenshots.length > 0" class="screenshot-previews">
            <div v-for="(screenshot, index) in screenshots" :key="index" class="screenshot-preview">
              <img :src="screenshot" alt="Screenshot preview" />
              <button type="button" class="remove-screenshot" @click="removeScreenshot(index)">
                <XIcon class="remove-icon" />
              </button>
            </div>
          </div>
        </div>

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
import { XCircle as ErrorIcon, Camera as CameraIcon, X as XIcon } from "lucide-vue";

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
const screenshots = ref<string[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

const MAX_SCREENSHOTS = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    processFiles(Array.from(target.files));
  }
}

function handleDrop(event: DragEvent) {
  if (event.dataTransfer?.files) {
    processFiles(Array.from(event.dataTransfer.files));
  }
}

async function processFiles(files: File[]) {
  const remainingSlots = MAX_SCREENSHOTS - screenshots.value.length;
  const filesToProcess = files.slice(0, remainingSlots);

  for (const file of filesToProcess) {
    if (!file.type.startsWith("image/")) {
      continue;
    }
    if (file.size > MAX_FILE_SIZE) {
      continue;
    }

    try {
      const base64 = await fileToBase64(file);
      screenshots.value.push(base64);
    } catch (err) {
      console.error("Failed to process file:", err);
    }
  }

  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = "";
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function removeScreenshot(index: number) {
  screenshots.value.splice(index, 1);
}

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
        screenshots: screenshots.value,
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

.screenshot-section {
  margin-top: 1rem;
}

.screenshot-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.screenshot-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
}

.screenshot-upload-area:hover {
  border-color: #484d7c;
  background-color: #f9fafb;
}

.hidden-input {
  display: none;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
}

.upload-icon {
  width: 2rem;
  height: 2rem;
  color: #9ca3af;
}

.upload-hint {
  font-size: 0.75rem;
  color: #9ca3af;
}

.screenshot-previews {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.screenshot-preview {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 0.375rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.screenshot-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-screenshot {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.remove-icon {
  width: 12px;
  height: 12px;
  color: white;
}
</style>
