<template>
  <card>
    <template #title>
      Submit Feedback
    </template>
    <template #label>
      Share your ideas, report bugs, or give us feedback
    </template>

    <div v-if="success" class="feedback-success">
      <p>Check your email for the feedback link!</p>
      <Button type="outline" @click="resetForm">
        Submit another
      </Button>
    </div>

    <form v-else @submit.prevent="sendMagicLink">
      <l-text
        v-model="email"
        label="Your Email"
        type="email"
        name="email"
        placeholder="your@email.com"
        :error="emailError"
        @hide-error="hideEmailError"
      />

      <div v-if="boards.length > 0" class="board-select">
        <label class="board-label">Select Category</label>
        <div class="board-options">
          <button
            v-for="board in boards"
            :key="board.boardId"
            type="button"
            :class="['board-option', { selected: selectedBoard === board.boardId }]"
            @click="selectedBoard = board.boardId"
          >
            <span
              class="board-dot"
              :style="{ backgroundColor: `#${board.color}` }"
            />
            {{ board.name }}
          </button>
        </div>
      </div>

      <div class="feedback-actions">
        <Button
          type="primary"
          :loading="loading"
          :full-width="true"
          :disabled="!selectedBoard"
          @click="sendMagicLink"
        >
          Get Feedback Link
        </Button>
      </div>
    </form>
  </card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { requestMagicLink } from "../../modules/auth";
import { getPublicBoards } from "../../ee/modules/boards";
import type { IBoard } from "@logchimp/types";

// components
import Card from "../ui/Card.vue";
import LText from "../ui/input/LText.vue";
import Button from "../ui/Button.vue";

const email = ref("");
const loading = ref(false);
const success = ref(false);
const boards = ref<IBoard[]>([]);
const selectedBoard = ref<string>("");
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

async function loadBoards() {
  try {
    const response = await getPublicBoards();
    boards.value = response.data.boards || [];
    if (boards.value.length > 0 && boards.value[0]) {
      selectedBoard.value = boards.value[0].boardId;
    }
  } catch (error) {
    console.error("Failed to load boards:", error);
  }
}

async function sendMagicLink() {
  if (!email.value) {
    emailError.show = true;
    emailError.message = "Email is required";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    emailError.show = true;
    emailError.message = "Please enter a valid email address";
    return;
  }

  if (!selectedBoard.value) {
    emailError.show = true;
    emailError.message = "Please select a category";
    return;
  }

  loading.value = true;
  try {
    await requestMagicLink({
      email: email.value,
      boardId: selectedBoard.value,
    });
    success.value = true;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    emailError.show = true;
    emailError.message =
      axiosError.response?.data?.message ||
      "Failed to send link. Please try again.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadBoards();
});
</script>

<style scoped>
.feedback-success {
  text-align: center;
}

.feedback-success p {
  margin-bottom: 1rem;
  color: #10b981;
  font-weight: 500;
}

.board-select {
  margin-top: 1rem;
}

.board-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.board-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.board-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.board-option:hover {
  border-color: #484d7c;
}

.board-option.selected {
  border-color: #484d7c;
  background: #f8f7ff;
}

.board-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
}

.feedback-actions {
  margin-top: 1.5rem;
}
</style>
