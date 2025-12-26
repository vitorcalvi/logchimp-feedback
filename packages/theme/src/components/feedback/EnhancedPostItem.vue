<template>
  <div class="enhanced-post-item">
    <!-- Enhanced voting section -->
    <div class="vote-section">
      <enhanced-vote
        :post-id="postData.postId"
        :votes-count="postData.voters.votesCount"
        :is-voted="isVoted"
        :show-explanation="showVoteExplanation"
        @update-voters="updateVoters"
      />
    </div>
    
    <!-- Main content section -->
    <div class="content-section">
      <!-- Header with title and badges -->
      <div class="post-header">
        <router-link
          data-test="post-link"
          :to="`${dashboardUrl}/posts/${postData.slug}`"
          class="post-title-link"
        >
          <h3
            data-testid="title"
            class="post-title"
          >
            {{ postData.title }}
          </h3>
        </router-link>
        
        <!-- Badges section -->
        <div class="badges-container">
          <!-- Status badge -->
          <status-badge
            :variant="getStatusVariant()"
            size="sm"
          />
          
          <!-- Priority badge -->
          <priority-badge
            v-if="showPriority"
            :priority="getPriority()"
            size="sm"
          />
          
          <!-- Roadmap badge -->
          <div
            v-if="postData.roadmap?.id"
            class="roadmap-badge"
            :style="{ color: `#${postData.roadmap.color}` }"
          >
            <roadmap-icon class="w-3 h-3" />
            {{ postData.roadmap.name }}
          </div>
        </div>
      </div>
      
      <!-- Description -->
      <p
        v-if="postData.contentMarkdown"
        data-test="post-description"
        class="post-description"
      >
        {{ useTrim(postData.contentMarkdown, descriptionLimit) }}
      </p>
      
      <!-- Post metadata -->
      <div class="post-meta">
        <!-- Author info -->
        <div class="author-info">
          <avatar
            :src="postData.author.avatar || undefined"
            :name="postAuthorName"
            size="sm"
          />
          <span class="author-name">{{ postAuthorName }}</span>
        </div>
        
        <!-- Divider -->
        <div class="meta-divider"></div>
        
        <!-- Time -->
        <time
          :title="dayjs(postData.createdAt).format('dddd, DD MMMM YYYY hh:mm')"
          class="post-time"
        >
          {{ dayjs(postData.createdAt).fromNow() }}
        </time>
        
        <!-- Board badge -->
        <board-badge
          v-if="postData.board?.boardId && showBoard"
          class="meta-board-badge"
          :show-board="showBoard"
          :name="postData.board.name"
          :color="postData.board.color"
          :url="postData.board.url"
        />
        
        <!-- More options -->
        <post-view-more-options
          v-if="postAuthor"
          :post="postData"
          class="meta-options"
        />
      </div>
      
      <!-- Tags or category indicators -->
      <div v-if="showTags && hasTags" class="post-tags">
        <div
          v-for="tag in getTags()"
          :key="tag"
          class="post-tag"
        >
          #{{ tag }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { IPostVote, IPost } from "@logchimp/types";

import { useTrim } from "../../hooks";

// components
import EnhancedVote from "./EnhancedVote.vue";
import StatusBadge from "./StatusBadge.vue";
import PriorityBadge from "./PriorityBadge.vue";
import BoardBadge from "../board/BoardBadge.vue";
import { Avatar } from "../ui/Avatar";
import PostViewMoreOptions from "../post/PostViewMoreOptions.vue";
import { Roadmap as RoadmapIcon } from "lucide-vue";

interface Props {
  post: IPost;
  dashboard?: boolean;
  showBoard?: boolean;
  showPriority?: boolean;
  showTags?: boolean;
  descriptionLimit?: number;
  showVoteExplanation?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  dashboard: false,
  showBoard: true,
  showPriority: false,
  showTags: false,
  descriptionLimit: 150,
  showVoteExplanation: false
});

const postData = ref(props.post);
const dayjs = dayjs;
dayjs.extend(relativeTime);

const dashboardUrl = computed(() => (props.dashboard ? "/dashboard" : ""));
const isVoted = computed<boolean>(() =>
  Boolean(props.post.voters?.viewerVote?.voteId),
);

const postAuthorName = computed(() => postData.value.author.name || postData.value.author.username);

const postAuthor = computed(() => {
  const checkPermission = true; // Simplified for now
  const authorId = postData.value.author.userId;
  const getUserId = "current-user-id"; // Simplified for now
  
  if (!checkPermission && getUserId !== authorId) return false;
  return true;
});

const hasTags = computed(() => {
  // This would depend on your post data structure
  return false; // Placeholder
});

function updateVoters(voters: IPostVote) {
  postData.value.voters.votesCount = voters.votesCount;
  postData.value.voters.viewerVote = voters.viewerVote;
}

function getStatusVariant() {
  // Determine status from post data or content
  const title = postData.value.title.toLowerCase();
  const content = postData.value.contentMarkdown?.toLowerCase() || '';
  
  if (title.includes('bug') || content.includes('error') || content.includes('broken')) {
    return 'bug';
  }
  if (title.includes('feature') || title.includes('add') || title.includes('implement')) {
    return 'feature';
  }
  if (title.includes('improve') || title.includes('enhance') || title.includes('better')) {
    return 'enhancement';
  }
  if (title.includes('plan') || content.includes('roadmap')) {
    return 'planned';
  }
  
  return 'general';
}

function getPriority() {
  // Determine priority from vote count and other factors
  const votes = postData.value.voters.votesCount;
  
  if (votes >= 50) return 'critical';
  if (votes >= 20) return 'high';
  if (votes >= 5) return 'medium';
  return 'low';
}

function getTags() {
  // Extract tags from post content or metadata
  return []; // Placeholder
}
</script>

<style scoped>
.enhanced-post-item {
  @apply flex items-start gap-4 p-6 mb-6 last:mb-0;
  @apply bg-white rounded-xl border border-gray-200;
  @apply hover:shadow-lg hover:border-gray-300 transition-all duration-300;
  background: linear-gradient(145deg, #ffffff, #fafafa);
}

.vote-section {
  @apply flex-shrink-0;
}

.content-section {
  @apply flex-1 min-w-0;
}

.post-header {
  @apply mb-3;
}

.post-title-link {
  @apply no-underline;
}

.post-title {
  @apply text-xl font-semibold text-gray-900 mb-2;
  @apply hover:text-blue-600 transition-colors duration-200;
  line-height: 1.3;
}

.badges-container {
  @apply flex flex-wrap gap-2;
}

.roadmap-badge {
  @apply inline-flex items-center gap-1 px-2 py-1 rounded-full;
  @apply bg-gray-100 text-gray-700 text-xs font-medium;
}

.post-description {
  @apply text-gray-600 leading-relaxed mb-4;
  line-height: 1.6;
}

.post-meta {
  @apply flex items-center gap-3 text-sm text-gray-500;
  @apply flex-wrap;
}

.author-info {
  @apply flex items-center gap-2;
}

.author-name {
  @apply font-medium text-gray-700;
}

.meta-divider {
  @apply w-px h-4 bg-gray-300;
}

.post-time {
  @apply text-gray-500;
}

.meta-board-badge {
  @apply ml-auto;
}

.meta-options {
  @apply ml-auto;
}

.post-tags {
  @apply flex flex-wrap gap-2 mt-3;
}

.post-tag {
  @apply px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full;
  @apply hover:bg-gray-200 transition-colors duration-200;
}

/* Responsive design */
@media (max-width: 640px) {
  .enhanced-post-item {
    @apply p-4;
  }
  
  .badges-container {
    @apply gap-1;
  }
  
  .post-meta {
    @apply gap-2 text-xs;
  }
  
  .author-info {
    @apply gap-1;
  }
}
</style>