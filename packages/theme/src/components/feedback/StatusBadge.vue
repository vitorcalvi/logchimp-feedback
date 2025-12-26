<template>
  <div :class="statusClasses" class="status-badge">
    <component :is="iconComponent" :class="iconClasses" class="status-icon" />
    <span class="status-text">{{ displayText }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { 
  Lightbulb, 
  Bug, 
  Zap, 
  MessageSquare, 
  Settings, 
  Star,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-vue";

interface Props {
  status: string;
  variant?: 'feature' | 'bug' | 'enhancement' | 'general' | 'planned' | 'in-progress' | 'completed' | 'declined';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'general',
  size: 'md',
  showIcon: true
});

const statusConfig = computed(() => {
  const configs = {
    feature: {
      icon: Lightbulb,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      text: 'Feature Request'
    },
    bug: {
      icon: Bug,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      text: 'Bug Report'
    },
    enhancement: {
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      text: 'Enhancement'
    },
    general: {
      icon: MessageSquare,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      text: 'General'
    },
    planned: {
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      text: 'Planned'
    },
    'in-progress': {
      icon: Settings,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      text: 'In Progress'
    },
    completed: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      text: 'Completed'
    },
    declined: {
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      text: 'Declined'
    }
  };
  
  return configs[props.variant] || configs.general;
});

const iconComponent = computed(() => statusConfig.value.icon);
const displayText = computed(() => statusConfig.value.text);

const statusClasses = computed(() => [
  'inline-flex items-center gap-1.5 rounded-full border font-medium transition-all duration-200',
  statusConfig.value.bgColor,
  statusConfig.value.borderColor,
  {
    'px-2 py-0.5 text-xs': props.size === 'sm',
    'px-3 py-1 text-sm': props.size === 'md',
    'px-4 py-1.5 text-base': props.size === 'lg'
  }
]);

const iconClasses = computed(() => [
  statusConfig.value.color,
  {
    'w-3 h-3': props.size === 'sm',
    'w-4 h-4': props.size === 'md',
    'w-5 h-5': props.size === 'lg'
  }
]);
</script>

<style scoped>
.status-badge {
  backdrop-filter: blur(8px);
}

.status-icon {
  flex-shrink: 0;
}

.status-text {
  white-space: nowrap;
  font-weight: 500;
}
</style>