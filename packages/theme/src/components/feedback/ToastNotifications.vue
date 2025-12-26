<template>
  <div class="toast-container">
    <div 
      v-for="toast in toasts" 
      :key="toast.id"
      class="toast"
      :class="[`toast-${toast.type}`, { show: toast.visible }]"
    >
      <div class="toast-icon">
        <component :is="getIcon(toast.type)" />
      </div>
      <div class="toast-content">
        <div class="toast-title">{{ toast.title }}</div>
        <div class="toast-message">{{ toast.message }}</div>
      </div>
      <button class="toast-close" @click="removeToast(toast.id)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  CheckCircle as SuccessIcon,
  AlertTriangle as WarningIcon,
  XCircle as ErrorIcon,
  Info as InfoIcon
} from 'lucide-vue';

interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  visible: boolean;
}

const toasts = ref<Toast[]>([]);
let toastId = 0;

function showToast(type: Toast['type'], title: string, message: string, duration = 3000) {
  const id = toastId++;
  const toast: Toast = {
    id,
    type,
    title,
    message,
    visible: true
  };
  
  toasts.value.push(toast);
  
  setTimeout(() => {
    removeToast(id);
  }, duration);
}

function removeToast(id: number) {
  const index = toasts.value.findIndex(t => t.id === id);
  if (index !== -1) {
    toasts.value[index].visible = false;
    setTimeout(() => {
      toasts.value.splice(index, 1);
    }, 300);
  }
}

function getIcon(type: Toast['type']) {
  switch(type) {
    case 'success': return SuccessIcon;
    case 'error': return ErrorIcon;
    case 'warning': return WarningIcon;
    default: return InfoIcon;
  }
}

// Expose the showToast function globally
defineExpose({ showToast });
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toast {
  background: var(--text-main);
  color: white;
  padding: 14px 24px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 12px;
  transform: translateX(120%);
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  min-width: 300px;
  opacity: 0;
}

.toast.show {
  transform: translateX(0);
  opacity: 1;
}

.toast-success {
  border-left: 4px solid var(--success-green);
}

.toast-error {
  border-left: 4px solid var(--error-red);
}

.toast-warning {
  border-left: 4px solid var(--warning-yellow);
}

.toast-info {
  border-left: 4px solid var(--info-purple);
}

.toast-icon {
  display: flex;
  align-items: center;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.toast-message {
  font-size: 0.9rem;
  opacity: 0.9;
}

.toast-close {
  background: none;
  border: none;
  color: white;
  opacity: 0.7;
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;
}

.toast-close:hover {
  opacity: 1;
}
</style>