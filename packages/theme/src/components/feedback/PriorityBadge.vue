<template>
  <div :class="priorityClasses" class="priority-badge">
    <component :is="iconComponent" :class="iconClasses" class="priority-icon" />
    <span class="priority-text">{{ displayText }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { 
  AlertTriangle, 
  TrendingUp, 
  Minus,
  ArrowUp
} from "lucide-vue";

interface Props {
  priority?: 'low' | 'medium' | 'high' | 'critical';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  priority: 'medium',
  size: 'md',
  showIcon: true
});

const priorityConfig = computed(() => {
  const configs = {
    low: {
      icon: Minus,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      text: 'Low Priority'
    },
    medium: {
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      text: 'Medium Priority'
    },
    high: {
      icon: ArrowUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      text: 'High Priority'
    },
    critical: {
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      text: 'Critical'
    }
  };
  
  return configs[props.priority];
});

const iconComponent = computed(() => priorityConfig.value.icon);
const displayText = computed(() => priorityConfig.value.text);

const priorityClasses = computed(() => [
  'inline-flex items-center gap-1.5 rounded-full border font-medium transition-all duration-200',
  priorityConfig.value.bgColor,
  priorityConfig.value.borderColor,
  {
    'px-2 py-0.5 text-xs': props.size === 'sm',
    'px-3 py-1 text-sm': props.size === 'md',
    'px-4 py-1.5 text-base': props.size === 'lg'
  }
]);

const iconClasses = computed(() => [
  priorityConfig.value.color,
  {
    'w-3 h-3': props.size === 'sm',
    'w-4 h-4': props.size === 'md',
    'w-5 h-5': props.size === 'lg'
  }
]);
</script>

<style scoped>
.priority-badge {
  backdrop-filter: blur(8px);
}

.priority-icon {
  flex-shrink: 0;
}

.priority-text {
  white-space: nowrap;
  font-weight: 500;
}
</style>