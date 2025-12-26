<template>
  <div class="help-tooltip-container">
    <button
      ref="triggerRef"
      :class="[
        'help-trigger',
        triggerClass
      ]"
      @click="toggleTooltip"
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
    >
      <help-circle-icon 
        :class="[
          'help-icon',
          { 'active': showTooltipContent }
        ]" 
      />
    </button>
    
    <!-- Tooltip content -->
    <div
      v-if="showTooltipContent"
      ref="tooltipRef"
      :class="[
        'tooltip-content',
        placement
      ]"
    >
      <div class="tooltip-header">
        <h4 class="tooltip-title">{{ title }}</h4>
        <button @click="closeTooltip" class="tooltip-close">
          <x-icon class="w-3 h-3" />
        </button>
      </div>
      
      <div class="tooltip-body">
        <p class="tooltip-text">{{ content }}</p>
        
        <!-- Additional actions -->
        <div v-if="actions && actions.length > 0" class="tooltip-actions">
          <button
            v-for="action in actions"
            :key="action.label"
            :class="[
              'tooltip-action',
              action.type === 'primary' ? 'action-primary' : 'action-secondary'
            ]"
            @click="handleAction(action)"
          >
            {{ action.label }}
          </button>
        </div>
      </div>
      
      <!-- Arrow -->
      <div :class="['tooltip-arrow', placement]"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { HelpCircle as HelpCircleIcon, X as XIcon } from "lucide-vue";

interface Action {
  label: string;
  type?: 'primary' | 'secondary';
  onClick: () => void;
}

interface Props {
  title: string;
  content: string;
  actions?: Action[];
  placement?: 'top' | 'bottom' | 'left' | 'right';
  triggerClass?: string;
  showOnClick?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'top',
  triggerClass: '',
  showOnClick: false
});

const emit = defineEmits<{
  (e: 'action', action: Action): void;
}>();

const triggerRef = ref<HTMLElement>();
const tooltipRef = ref<HTMLElement>();
const showTooltipContent = ref(false);
const hideTimeout = ref<NodeJS.Timeout>();

const toggleTooltip = () => {
  if (props.showOnClick) {
    showTooltipContent.value = !showTooltipContent.value;
  }
};

const showTooltip = () => {
  if (!props.showOnClick) {
    clearTimeout(hideTimeout.value);
    showTooltipContent.value = true;
  }
};

const hideTooltip = () => {
  if (!props.showOnClick) {
    hideTimeout.value = setTimeout(() => {
      showTooltipContent.value = false;
    }, 150);
  }
};

const closeTooltip = () => {
  showTooltipContent.value = false;
};

const handleAction = (action: Action) => {
  action.onClick();
  emit('action', action);
  closeTooltip();
};

// Close tooltip when clicking outside
const handleClickOutside = (event: Event) => {
  if (
    tooltipRef.value &&
    !tooltipRef.value.contains(event.target as Node) &&
    triggerRef.value &&
    !triggerRef.value.contains(event.target as Node)
  ) {
    closeTooltip();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  clearTimeout(hideTimeout.value);
});
</script>

<style scoped>
.help-tooltip-container {
  @apply relative inline-block;
}

.help-trigger {
  @apply w-5 h-5 rounded-full;
  @apply bg-gray-100 hover:bg-gray-200;
  @apply flex items-center justify-center;
  @apply transition-colors duration-200;
}

.help-icon {
  @apply w-3 h-3 text-gray-500;
  @apply transition-all duration-200;
}

.help-icon.active {
  @apply text-blue-600;
}

.tooltip-content {
  @apply absolute z-50 min-w-64 max-w-80;
  @apply bg-white rounded-lg shadow-xl border border-gray-200;
  @apply opacity-0 invisible transition-all duration-200;
  animation: tooltip-fade-in 0.2s ease-out forwards;
}

.tooltip-content.visible {
  @apply opacity-100 visible;
}

.tooltip-content.top {
  @apply bottom-full left-1/2 transform -translate-x-1/2;
  @apply mb-2;
}

.tooltip-content.bottom {
  @apply top-full left-1/2 transform -translate-x-1/2;
  @apply mt-2;
}

.tooltip-content.left {
  @apply right-full top-1/2 transform -translate-y-1/2;
  @apply mr-2;
}

.tooltip-content.right {
  @apply left-full top-1/2 transform -translate-y-1/2;
  @apply ml-2;
}

.tooltip-header {
  @apply flex items-center justify-between p-3 border-b border-gray-100;
}

.tooltip-title {
  @apply text-sm font-semibold text-gray-900;
}

.tooltip-close {
  @apply w-5 h-5 rounded-full hover:bg-gray-100;
  @apply flex items-center justify-center;
  @apply transition-colors duration-200;
}

.tooltip-body {
  @apply p-3;
}

.tooltip-text {
  @apply text-sm text-gray-600 leading-relaxed;
}

.tooltip-actions {
  @apply flex gap-2 mt-3;
}

.tooltip-action {
  @apply px-3 py-1 text-xs rounded-md font-medium;
  @apply transition-colors duration-200;
}

.action-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.action-secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
}

.tooltip-arrow {
  @apply absolute w-2 h-2 bg-white border border-gray-200;
  @apply transform rotate-45;
}

.tooltip-arrow.top {
  @apply bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2;
}

.tooltip-arrow.bottom {
  @apply top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
}

.tooltip-arrow.left {
  @apply right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2;
}

.tooltip-arrow.right {
  @apply left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2;
}

@keyframes tooltip-fade-in {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>