<template>
  <div class="feedback-stats">
    <div class="stats-header">
      <h3 class="stats-title">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="4" width="20" height="16" rx="4" fill="#3b82f6" fill-opacity="0.15"/>
          <path d="M8 10H16M8 14H13" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        Feedback Analytics
      </h3>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <div class="stat-value">{{ formatNumber(stats.totalPosts) }}</div>
        <div class="stat-label">Total Feedback</div>
        <div class="stat-trend">+2 new today</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="color: #8b5cf6; background: #f5f3ff;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
        </div>
        <div class="stat-value">{{ formatNumber(stats.totalVotes) }}</div>
        <div class="stat-label">Community Votes</div>
        <div class="stat-trend">High engagement</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="color: #ef4444; background: #fef2f2;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <div class="stat-value">{{ stats.bugReports }}</div>
        <div class="stat-label">Open Bugs</div>
        <div class="stat-trend" :style="{ color: stats.bugReports > 0 ? '#ef4444' : '#10b981' }">
          {{ stats.bugReports > 0 ? 'Needs attention' : 'System Stable' }}
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="color: #f59e0b; background: #fffbeb;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </div>
        <div class="stat-value">{{ stats.featureRequests }}</div>
        <div class="stat-label">Planned Features</div>
        <div class="stat-trend">Next release</div>
      </div>
    </div>
    
    <div class="controls-bar">
      <button class="btn-primary" @click="handleSubmitFeedback">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        New Feedback
      </button>
      
      <div class="flex gap-2">
        <span>Sort by:</span>
        <select @change="handleSortChange" class="sort-select">
          <option value="votes">Most Votes</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  stats?: {
    totalPosts: number;
    totalVotes: number;
    featureRequests: number;
    bugReports: number;
  };
}

const props = withDefaults(defineProps<Props>(), {
  stats: () => ({
    totalPosts: 0,
    totalVotes: 0,
    featureRequests: 0,
    bugReports: 0
  })
});

const emit = defineEmits<{
  (e: 'submit-feedback'): void;
  (e: 'sort-change', value: string): void;
}>();

const stats = ref(props.stats);

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function handleSubmitFeedback() {
  emit('submit-feedback');
}

function handleSortChange(e: Event) {
  const target = e.target as HTMLSelectElement;
  emit('sort-change', target.value);
}
</script>

<style scoped>
.feedback-stats {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
  padding: 24px;
  margin-bottom: 24px;
}

.stats-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.stats-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: var(--bg-card);
  padding: 24px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-light);
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-blue);
}

.stat-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eff6ff;
  color: var(--primary-blue);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 8px 0;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
}

.stat-trend {
  font-size: 0.8rem;
  color: #10b981;
  font-weight: 500;
}

.controls-bar {
  background: var(--bg-card);
  padding: 16px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--border-light);
}

.btn-primary {
  background: var(--primary-blue);
  color: white;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 6px 8px -1px rgba(59, 130, 246, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}

.sort-select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid var(--border-light);
  font-weight: 500;
  color: var(--text-main);
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .controls-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .btn-primary {
    width: 100%;
    justify-content: center;
  }
}
</style>