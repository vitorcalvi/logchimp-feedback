<template>
  <div v-if="showOnboarding" class="onboarding-overlay" @click="handleOverlayClick">
    <div class="onboarding-card" @click.stop>
      <div class="onboarding-header">
        <div class="onboarding-icon">
          <lightbulb-icon class="w-6 h-6" />
        </div>
        <h3 class="onboarding-title">Welcome to Feedback Board!</h3>
        <button @click="closeOnboarding" class="close-button">
          <x-icon class="w-4 h-4" />
        </button>
      </div>
      
      <div class="onboarding-content">
        <p class="onboarding-description">
          Here's how you can engage with feature requests and help shape our product:
        </p>
        
        <div class="onboarding-steps">
          <div class="step">
            <div class="step-icon">
              <thumbs-up-icon class="w-5 h-5" />
            </div>
            <div class="step-content">
              <h4 class="step-title">Vote on Features</h4>
              <p class="step-description">
                Click the vote button to show support for features you want to see implemented.
              </p>
            </div>
          </div>
          
          <div class="step">
            <div class="step-icon">
              <message-square-icon class="w-5 h-5" />
            </div>
            <div class="step-content">
              <h4 class="step-title">Submit Your Ideas</h4>
              <p class="step-description">
                Have a great idea? Click "Submit Feedback" to share your feature requests or report bugs.
              </p>
            </div>
          </div>
          
          <div class="step">
            <div class="step-icon">
              <eye-icon class="w-5 h-5" />
            </div>
            <div class="step-content">
              <h4 class="step-title">Track Progress</h4>
              <p class="step-description">
                Watch the status badges to see if features are planned, in progress, or completed.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="onboarding-footer">
        <button @click="closeOnboarding" class="get-started-button">
          Got it! Let's start
        </button>
        <button @click="dontShowAgain" class="skip-button">
          Don't show again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { 
  Lightbulb as LightbulbIcon, 
  X as XIcon,
  ThumbsUp as ThumbsUpIcon,
  MessageSquare as MessageSquareIcon,
  Eye as EyeIcon
} from "lucide-vue";

interface Props {
  showOnFirstVisit?: boolean;
  delay?: number;
}

const props = withDefaults(defineProps<Props>(), {
  showOnFirstVisit: true,
  delay: 2000
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'dontShowAgain'): void;
}>();

const showOnboarding = ref(false);
const onboardingShown = ref(false);

onMounted(() => {
  if (props.showOnFirstVisit && !hasSeenOnboarding()) {
    setTimeout(() => {
      showOnboarding.value = true;
      onboardingShown.value = true;
    }, props.delay);
  }
});

function hasSeenOnboarding(): boolean {
  return localStorage.getItem('feedback-onboarding-seen') === 'true';
}

function closeOnboarding() {
  showOnboarding.value = false;
  emit('close');
  
  if (onboardingShown.value) {
    localStorage.setItem('feedback-onboarding-seen', 'true');
  }
}

function dontShowAgain() {
  localStorage.setItem('feedback-onboarding-seen', 'true');
  closeOnboarding();
  emit('dontShowAgain');
}

function handleOverlayClick() {
  // Allow closing by clicking overlay
  closeOnboarding();
}
</script>

<style scoped>
.onboarding-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center;
  @apply z-50 p-4;
  backdrop-filter: blur(4px);
}

.onboarding-card {
  @apply bg-white rounded-2xl shadow-2xl max-w-md w-full;
  @apply border border-gray-200 overflow-hidden;
  animation: slide-up 0.3s ease-out;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.onboarding-header {
  @apply bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white;
  @apply relative;
}

.onboarding-icon {
  @apply w-12 h-12 bg-white bg-opacity-20 rounded-full;
  @apply flex items-center justify-center mb-4;
}

.onboarding-title {
  @apply text-xl font-bold mb-2;
}

.close-button {
  @apply absolute top-4 right-4 w-8 h-8 rounded-full;
  @apply bg-white bg-opacity-20 hover:bg-opacity-30;
  @apply flex items-center justify-center transition-all duration-200;
}

.onboarding-content {
  @apply p-6;
}

.onboarding-description {
  @apply text-gray-600 mb-6 leading-relaxed;
}

.onboarding-steps {
  @apply space-y-4;
}

.step {
  @apply flex gap-3;
}

.step-icon {
  @apply w-10 h-10 rounded-full bg-blue-100 text-blue-600;
  @apply flex items-center justify-center flex-shrink-0;
}

.step-content {
  @apply flex-1;
}

.step-title {
  @apply font-semibold text-gray-900 mb-1;
}

.step-description {
  @apply text-sm text-gray-600 leading-relaxed;
}

.onboarding-footer {
  @apply bg-gray-50 p-6 flex flex-col gap-3;
}

.get-started-button {
  @apply w-full bg-blue-600 hover:bg-blue-700 text-white font-medium;
  @apply py-3 px-4 rounded-lg transition-colors duration-200;
}

.skip-button {
  @apply w-full text-gray-600 hover:text-gray-800 font-medium;
  @apply py-2 transition-colors duration-200;
}

/* Responsive */
@media (max-width: 640px) {
  .onboarding-card {
    @apply mx-2;
  }
  
  .onboarding-content {
    @apply p-4;
  }
  
  .onboarding-footer {
    @apply p-4;
  }
}
</style>