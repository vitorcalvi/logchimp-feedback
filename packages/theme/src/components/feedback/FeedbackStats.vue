<template>
  <div class="feedback-stats">
    <div class="stats-header">
      <h3 class="stats-title">
        <bar-chart-icon class="w-5 h-5" />
        Board Statistics
      </h3>
      <help-tooltip
        title="Understanding the Stats"
        content="These numbers help you understand the activity on this feedback board. Higher numbers indicate more community engagement."
        :actions="[
          {
            label: 'Learn more',
            type: 'secondary',
            onClick: () => window.open('/help/stats', '_blank')
          }
        ]"
      />
    </div>
    
    <div class="stats-grid">
      <!-- Total Posts -->
      <div class="stat-card">
        <div class="stat-icon posts">
          <file-text-icon class="w-5 h-5" />
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ formatNumber(stats.totalPosts) }}</div>
          <div class="stat-label">Total Feedback</div>
          <div class="stat-description">All submitted feedback</div>
        </div>
      </div>
      
      <!-- Votes -->
      <div class="stat-card">
        <div class="stat-icon votes">
          <thumbs-up-icon class="w-5 h-5" />
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ formatNumber(stats.totalVotes) }}</div>
          <div class="stat-label">Total Votes</div>
          <div class="stat-description">Community engagement</div>
        </div>
      </div>
      
      <!-- Feature Requests -->
      <div class="stat-card">
        <div class="stat-icon features">
          <lightbulb-icon class="w-5 h-5" />
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ formatNumber(stats.featureRequests) }}</div>
          <div class="stat-label">Feature Requests</div>
          <div class="stat-description">New features requested</div>
        </div>
      </div>
      
      <!-- Bug Reports -->
      <div class="stat-card">
        <div class="stat-icon bugs">
          <bug-icon class="w-5 h-5" />
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ formatNumber(stats.bugReports) }}</div>
          <div class="stat-label">Bug Reports</div>
          <div class="stat-description">Issues to fix</div>
        </div>
      </div>
      
      <!-- Top Contributors -->
      <div class="stat-card contributors">
        <div class="stat-icon top-contributors">
          <users-icon class="w-5 h-5" />
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.topContributors }}</div>
          <div class="stat-label">Active Users</div>
          <div class="stat-description">People helping improve</div>
        </div>
      </div>
      
      <!-- Response Rate -->
      <div class="stat-card">
        <div class="stat-icon response">
          <check-circle-icon class="w-5 h-5" />
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.responseRate }}%</div>
          <div class="stat-label">Response Rate</div>
          <div class="stat-description">Feedback addressed</div>
        </div>
      </div>
    </div>
    
    <!-- Quick Actions -->
    <div class="quick-actions">
      <h4 class="quick-actions-title">Quick Actions</h4>
      <div class="action-buttons">
        <button @click="handleSubmitFeedback" class="action-button primary">
          <plus-icon class="w-4 h-4" />
          Submit Feedback
        </button>
        <button @click="handleViewRoadmap" class="action-button secondary">
          <roadmap-icon class="w-4 h-4" />
          View Roadmap
        </button>
        <button @click="handleExportData" class="action-button secondary">
          <download-icon class="w-4 h-4" />
          Export Data
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { 
  BarChart as BarChartIcon,
  FileText as FileTextIcon,
  ThumbsUp as ThumbsUpIcon,
  Lightbulb as LightbulbIcon,
  Bug as BugIcon,
  Users as UsersIcon,
  CheckCircle as CheckCircleIcon,
  Plus as PlusIcon,
  Download as DownloadIcon
} from "lucide-vue";

interface Props {
  stats?: {
    totalPosts: number;
    totalVotes: number;
    featureRequests: number;
    bugReports: number;
    topContributors: number;
    responseRate: number;
  };
}

const props = withDefaults(defineProps<Props>(), {
  stats: () => ({
    totalPosts: 0,
    totalVotes: 0,
    featureRequests: 0,
    bugReports: 0,
    topContributors: 0,
    responseRate: 0
  })
});

const emit = defineEmits<{
  (e: 'submit-feedback'): void;
  (e: 'view-roadmap'): void;
  (e: 'export-data'): void;
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

function handleViewRoadmap() {
  emit('view-roadmap');
}

function handleExportData() {
  emit('export-data');
}
</script>

<style scoped>
.feedback-stats {
  @apply bg-white rounded-xl border border-gray-200 p-6;
  @apply shadow-sm;
}

.stats-header {
  @apply flex items-center justify-between mb-6;
}

.stats-title {
  @apply flex items-center gap-2 text-lg font-semibold text-gray-900;
}

.stats-grid {
  @apply grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6;
}

.stat-card {
  @apply flex items-center gap-3 p-4 bg-gray-50 rounded-lg;
  @apply hover:bg-gray-100 transition-colors duration-200;
}

.stat-card.contributors {
  @apply col-span-2 lg:col-span-1;
}

.stat-icon {
  @apply w-10 h-10 rounded-lg flex items-center justify-center;
  @apply flex-shrink-0;
}

.stat-icon.posts {
  @apply bg-blue-100 text-blue-600;
}

.stat-icon.votes {
  @apply bg-green-100 text-green-600;
}

.stat-icon.features {
  @apply bg-purple-100 text-purple-600;
}

.stat-icon.bugs {
  @apply bg-red-100 text-red-600;
}

.stat-icon.top-contributors {
  @apply bg-yellow-100 text-yellow-600;
}

.stat-icon.response {
  @apply bg-indigo-100 text-indigo-600;
}

.stat-content {
  @apply flex-1 min-w-0;
}

.stat-number {
  @apply text-2xl font-bold text-gray-900;
}

.stat-label {
  @apply text-sm font-medium text-gray-700;
}

.stat-description {
  @apply text-xs text-gray-500;
}

.quick-actions {
  @apply border-t border-gray-200 pt-6;
}

.quick-actions-title {
  @apply text-sm font-semibold text-gray-900 mb-4;
}

.action-buttons {
  @apply flex flex-wrap gap-3;
}

.action-button {
  @apply flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium;
  @apply transition-colors duration-200;
}

.action-button.primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.action-button.secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
}

/* Responsive */
@media (max-width: 640px) {
  .feedback-stats {
    @apply p-4;
  }
  
  .stats-grid {
    @apply grid-cols-1 gap-3;
  }
  
  .stat-card.contributors {
    @apply col-span-1;
  }
  
  .action-buttons {
    @apply flex-col;
  }
  
  .action-button {
    @apply w-full justify-center;
  }
}
</style>