<template>
  <div class="enhanced-vote-container">
    <button
      data-test="vote"
      :class="[
        'enhanced-vote-button',
        // loading state
        loading && 'loading',
        // voted state
        isVoted && 'voted',
        // disabled state
        disabled && 'disabled'
      ]"
      @click="changeVote"
      type="button"
      :aria-disabled="disabled ? 'true' : undefined"
      :disabled="disabled ? 'true' : undefined"
    >
      <div class="vote-content">
        <arrow-icon
          data-test="vote-arrow"
          :class="[
            'vote-arrow',
            isVoted ? 'voted-arrow' : 'default-arrow'
          ]"
        />
        
        <div class="vote-count-container">
          <span 
            data-test="vote-count" 
            :class="[
              'vote-count',
              votesCount > 0 && 'has-votes'
            ]"
          >
            {{ votesCount }}
          </span>
          
          <!-- Vote feedback tooltip -->
          <div v-if="showTooltip" class="vote-tooltip">
            {{ isVoted ? 'Click to remove vote' : 'Click to vote' }}
          </div>
        </div>
      </div>
      
      <!-- Vote animation particles -->
      <div v-if="showVoteAnimation" class="vote-animation">
        <div class="particle particle-1"></div>
        <div class="particle particle-2"></div>
        <div class="particle particle-3"></div>
      </div>
    </button>
    
    <!-- Vote explanation -->
    <div v-if="showExplanation" class="vote-explanation">
      <span v-if="votesCount === 0" class="text-gray-500 text-sm">
        Be the first to vote for this feature
      </span>
      <span v-else-if="votesCount === 1" class="text-gray-600 text-sm">
        1 person wants this feature
      </span>
      <span v-else class="text-gray-600 text-sm">
        {{ votesCount }} people want this feature
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { IPostVote } from "@logchimp/types";

// modules
import { addVote, deleteVote } from "../../modules/votes";
import { useUserStore } from "../../store/user";

// components
import ArrowIcon from "../icons/Arrow.vue";

// utils
import validateUUID from "../../utils/validateUUID";
import tokenError from "../../utils/tokenError";

interface Props {
  postId: {
    type: String;
    required: true;
    validator: validateUUID;
  };
  votesCount: {
    type: Number;
    default: 0;
  };
  isVoted: {
    type: Boolean;
    default: false;
  };
  showTooltip?: boolean;
  showExplanation?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showTooltip: true,
  showExplanation: false
});

const emit = defineEmits<(e: "update-voters", voters: IPostVote) => void>();

const loading = ref<boolean>(false);
const showVoteAnimation = ref<boolean>(false);
const userStore = useUserStore();

const disabled = computed(() => {
  if (!userStore.getUserId) return false;
  
  const checkPermission = userStore.permissions.includes("vote:create");
  return !checkPermission;
});

async function changeVote() {
  if (loading.value || disabled.value) return;
  
  // Show vote animation
  showVoteAnimation.value = true;
  setTimeout(() => {
    showVoteAnimation.value = false;
  }, 1000);
  
  loading.value = true;
  
  if (props.isVoted) {
    try {
      const response = await deleteVote(props.postId);
      emit("update-voters", response.data.voters);
      loading.value = false;
    } catch (error) {
      tokenError(error);
      loading.value = false;
    }
  } else {
    try {
      const response = await addVote(props.postId);
      emit("update-voters", response.data.voters);
      loading.value = false;
    } catch (error) {
      tokenError(error);
      loading.value = false;
    }
  }
}
</script>

<style scoped>
.enhanced-vote-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.enhanced-vote-button {
  @apply relative group flex flex-col items-center select-none rounded-xl p-3;
  @apply border-2 border-gray-200 hover:border-blue-300 cursor-pointer;
  @apply transition-all duration-300 ease-in-out;
  @apply hover:shadow-lg hover:scale-105;
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  
  min-width: 60px;
  min-height: 60px;
}

.enhanced-vote-button:hover:not(.disabled) {
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
  border-color: #93c5fd;
}

.enhanced-vote-button.loading {
  @apply opacity-80 cursor-wait;
  animation: pulse 1.5s ease-in-out infinite;
}

.enhanced-vote-button.voted {
  @apply border-blue-400 bg-blue-50;
  background: linear-gradient(145deg, #dbeafe, #bfdbfe);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
}

.enhanced-vote-button.disabled {
  @apply bg-gray-100 border-gray-200 cursor-default;
  @apply opacity-70;
}

.vote-content {
  @apply flex flex-col items-center;
  z-index: 2;
}

.vote-arrow {
  @apply mb-1 transition-all duration-300;
  width: 20px;
  height: 20px;
}

.default-arrow {
  @apply fill-gray-400;
}

.voted-arrow {
  @apply fill-blue-500;
  transform: scale(1.1);
}

.vote-count-container {
  @apply relative;
}

.vote-count {
  @apply text-lg font-bold transition-all duration-300;
  @apply text-gray-600;
  min-width: 24px;
  text-align: center;
}

.vote-count.has-votes {
  @apply text-blue-600;
}

.vote-tooltip {
  @apply absolute bottom-full left-1/2 transform -translate-x-1/2;
  @apply bg-gray-800 text-white text-xs px-2 py-1 rounded;
  @apply opacity-0 group-hover:opacity-100 transition-opacity duration-200;
  @apply pointer-events-none whitespace-nowrap;
  margin-bottom: 8px;
}

.vote-tooltip::after {
  content: '';
  @apply absolute top-full left-1/2 transform -translate-x-1/2;
  border: 4px solid transparent;
  border-top-color: #1f2937;
}

.vote-explanation {
  @apply text-center;
  max-width: 150px;
}

.vote-animation {
  @apply absolute inset-0 pointer-events-none;
  z-index: 1;
}

.particle {
  @apply absolute w-2 h-2 bg-blue-400 rounded-full;
  animation: float-up 1s ease-out forwards;
}

.particle-1 {
  left: 20%;
  animation-delay: 0s;
}

.particle-2 {
  left: 50%;
  animation-delay: 0.1s;
}

.particle-3 {
  left: 80%;
  animation-delay: 0.2s;
}

@keyframes float-up {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-30px) scale(0.5);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>