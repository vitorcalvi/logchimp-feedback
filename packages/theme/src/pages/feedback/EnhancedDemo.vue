<template>
  <div class="enhanced-demo">
    <!-- Onboarding -->
    <onboarding-card
      :show-on-first-visit="true"
      @close="handleOnboardingClose"
      @dont-show-again="handleOnboardingDontShow"
    />
    
    <!-- Page Header -->
    <div class="demo-header">
      <h1 class="demo-title">Enhanced Feedback Board</h1>
      <p class="demo-description">
        Experience our improved feedback system with better visual design, 
        user guidance, and enhanced understanding of feature requests.
      </p>
    </div>
    
    <!-- Statistics Card -->
    <feedback-stats
      :stats="sampleStats"
      @submit-feedback="handleSubmitFeedback"
      @view-roadmap="handleViewRoadmap"
      @export-data="handleExportData"
      class="demo-section"
    />
    
    <!-- Enhanced Feedback List -->
    <div class="demo-section">
      <div class="section-header">
        <h2 class="section-title">Latest Feedback</h2>
        <help-tooltip
          title="Understanding Feedback"
          content="Each feedback item shows its status, priority, and community votes. The badges help you quickly identify what type of feedback it is."
          :actions="[
            {
              label: 'Learn more',
              type: 'secondary',
              onClick: () => window.open('/help/feedback-types', '_blank')
            }
          ]"
        />
      </div>
      
      <div class="feedback-list">
        <enhanced-post-item
          v-for="post in samplePosts"
          :key="post.postId"
          :post="post"
          :show-priority="true"
          :show-vote-explanation="true"
          class="feedback-item"
        />
      </div>
    </div>
    
    <!-- Feature Showcase -->
    <div class="demo-section">
      <h2 class="section-title">Enhanced Features</h2>
      <div class="features-grid">
        <!-- Status Badges Demo -->
        <div class="feature-card">
          <h3 class="feature-title">Status Badges</h3>
          <p class="feature-description">Visual indicators for feedback type and status</p>
          <div class="badge-examples">
            <status-badge variant="feature" />
            <status-badge variant="bug" />
            <status-badge variant="enhancement" />
            <status-badge variant="planned" />
            <status-badge variant="in-progress" />
            <status-badge variant="completed" />
          </div>
        </div>
        
        <!-- Priority Badges Demo -->
        <div class="feature-card">
          <h3 class="feature-title">Priority Levels</h3>
          <p class="feature-description">Priority indicators based on community votes</p>
          <div class="badge-examples">
            <priority-badge priority="low" />
            <priority-badge priority="medium" />
            <priority-badge priority="high" />
            <priority-badge priority="critical" />
          </div>
        </div>
        
        <!-- Voting System Demo -->
        <div class="feature-card">
          <h3 class="feature-title">Enhanced Voting</h3>
          <p class="feature-description">Interactive voting with animations and feedback</p>
          <div class="voting-demo">
            <enhanced-vote
              post-id="demo-1"
              :votes-count="42"
              :is-voted="true"
              :show-explanation="true"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Help Section -->
    <div class="demo-section">
      <h2 class="section-title">Interactive Help</h2>
      <div class="help-examples">
        <help-tooltip
          title="How Voting Works"
          content="Click the vote button to show support for features you want to see implemented. Higher vote counts help prioritize development."
          :actions="[
            {
              label: 'See voting tips',
              type: 'primary',
              onClick: () => alert('Voting tips would open here!')
            }
          ]"
        />
        
        <help-tooltip
          title="Status Meanings"
          content="Feature: New functionality requests | Bug: Issues that need fixing | Enhancement: Improvements to existing features"
          placement="bottom"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useHead } from "@vueuse/head";

// Import enhanced components
import {
  OnboardingCard,
  FeedbackStats,
  EnhancedPostItem,
  StatusBadge,
  PriorityBadge,
  EnhancedVote,
  HelpTooltip
} from "../../components/feedback";

const sampleStats = ref({
  totalPosts: 247,
  totalVotes: 1834,
  featureRequests: 156,
  bugReports: 45,
  topContributors: 23,
  responseRate: 78
});

const samplePosts = ref([
  {
    postId: "1",
    title: "Dark mode support for better nighttime usage",
    contentMarkdown: "Many users have requested a dark mode option to reduce eye strain during extended use. This would include theme switching and automatic detection based on system preferences.",
    slug: "dark-mode-support",
    createdAt: new Date("2024-12-20"),
    updatedAt: new Date("2024-12-20"),
    author: {
      name: "Sarah Johnson",
      username: "sarah_j",
      avatar: null,
      userId: "user-1"
    },
    board: {
      boardId: "board-1",
      name: "General Feedback",
      color: "3b82f6",
      url: "general"
    },
    roadmap: {
      id: "roadmap-1",
      name: "UI Improvements",
      color: "8b5cf6"
    },
    voters: {
      votesCount: 67,
      viewerVote: { voteId: "vote-1" },
      votes: []
    }
  },
  {
    postId: "2",
    title: "Mobile app crashes when uploading large files",
    contentMarkdown: "The mobile app consistently crashes when trying to upload files larger than 50MB. This needs to be fixed as it's affecting our productivity.",
    slug: "mobile-app-crash",
    createdAt: new Date("2024-12-18"),
    updatedAt: new Date("2024-12-19"),
    author: {
      name: "Mike Chen",
      username: "mike_c",
      avatar: null,
      userId: "user-2"
    },
    board: {
      boardId: "board-2",
      name: "Bug Reports",
      color: "ef4444",
      url: "bugs"
    },
    roadmap: null,
    voters: {
      votesCount: 23,
      viewerVote: undefined,
      votes: []
    }
  },
  {
    postId: "3",
    title: "Export reports to PDF format",
    contentMarkdown: "It would be great to have the ability to export generated reports directly to PDF format for sharing with stakeholders and clients.",
    slug: "pdf-export-feature",
    createdAt: new Date("2024-12-15"),
    updatedAt: new Date("2024-12-16"),
    author: {
      name: "Emma Wilson",
      username: "emma_w",
      avatar: null,
      userId: "user-3"
    },
    board: {
      boardId: "board-1",
      name: "General Feedback",
      color: "3b82f6",
      url: "general"
    },
    roadmap: {
      id: "roadmap-2",
      name: "Export Features",
      color: "10b981"
    },
    voters: {
      votesCount: 89,
      viewerVote: { voteId: "vote-3" },
      votes: []
    }
  }
]);

function handleOnboardingClose() {
  console.log('Onboarding closed');
}

function handleOnboardingDontShow() {
  console.log('Onboarding disabled');
}

function handleSubmitFeedback() {
  // Navigate to feedback submission
  window.location.href = '/feedback/submit';
}

function handleViewRoadmap() {
  // Navigate to roadmap
  window.location.href = '/roadmap';
}

function handleExportData() {
  // Export functionality
  console.log('Exporting data...');
}

useHead({
  title: "Enhanced Feedback Board Demo",
  meta: [
    {
      name: "description",
      content: "Experience our improved feedback system with enhanced UX and better user understanding."
    }
  ]
});
</script>

<style scoped>
.enhanced-demo {
  @apply max-w-6xl mx-auto p-6 space-y-8;
}

.demo-header {
  @apply text-center mb-8;
}

.demo-title {
  @apply text-4xl font-bold text-gray-900 mb-4;
}

.demo-description {
  @apply text-lg text-gray-600 max-w-3xl mx-auto;
}

.demo-section {
  @apply mb-8;
}

.section-header {
  @apply flex items-center justify-between mb-6;
}

.section-title {
  @apply text-2xl font-semibold text-gray-900;
}

.feedback-list {
  @apply space-y-4;
}

.features-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-6;
}

.feature-card {
  @apply bg-white rounded-xl border border-gray-200 p-6;
  @apply hover:shadow-lg transition-shadow duration-300;
}

.feature-title {
  @apply text-lg font-semibold text-gray-900 mb-2;
}

.feature-description {
  @apply text-gray-600 mb-4;
}

.badge-examples {
  @apply flex flex-wrap gap-2;
}

.voting-demo {
  @apply flex justify-center;
}

.help-examples {
  @apply flex flex-col md:flex-row gap-4;
}

@media (max-width: 768px) {
  .enhanced-demo {
    @apply p-4;
  }
  
  .demo-title {
    @apply text-3xl;
  }
  
  .features-grid {
    @apply grid-cols-1;
  }
  
  .help-examples {
    @apply flex-col;
  }
}
</style>