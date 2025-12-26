<template>
  <div class="enhanced-post-item">
    <!-- Enhanced voting section -->
    <div class="vote-section">
      <enhanced-vote
        :post-id="postData.postId"
        :votes-count="postData.voters.votesCount"
        :is-voted="isVoted"
        @update-voters="updateVoters"
      />
    </div>
    
    <!-- Main content section -->
    <div class="content-section">
      <!-- Header with title and badges -->
      <div class="post-header">
        <router-link
          :to="`${dashboardUrl}/posts/${postData.slug}`"
          class="post-title-link"
        >
          <h3 class="post-title">
            {{ postData.title }}
          </h3>
        </router-link>
        
        <!-- Badges section -->
        <div class="badges-container">
          <status-badge :variant="getStatusVariant()" />
          <priority-badge :priority="getPriority()" />
        </div>
      </div>
      
      <!-- Description -->
      <p v-if="postData.contentMarkdown" class="post-description">
        {{ useTrim(postData.contentMarkdown, descriptionLimit) }}
      </p>
      
      <!-- Image attachment -->
      <div v-if="postData.image" class="card-image-container">
        <div class="expand-badge">Image Attached</div>
        <img
          :src="postData.image"
          class="card-image"
          alt="Attachment"
          @click="openImage(postData.image)"
        >
      </div>
      
      <!-- Post metadata -->
      <div class="post-meta">
        <div class="author-info">
          <avatar
            :src="postData.author.avatar || undefined"
            :name="postAuthorName"
            size="sm"
          />
          <span class="author-name">{{ postAuthorName }}</span>
        </div>
        
        <div class="meta-divider"></div>
        
        <time
          :title="dayjs(postData.createdAt).format('dddd, DD MMMM YYYY hh:mm')"
          class="post-time"
        >
          {{ dayjs(postData.createdAt).fromNow() }}
        </time>
        
        <post-view-more-options
          v-if="postAuthor"
          :post="postData"
          class="meta-options"
        />
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
import { Avatar } from "../ui/Avatar";
import PostViewMoreOptions from "../post/PostViewMoreOptions.vue";

interface Props {
  post: IPost;
  dashboard?: boolean;
  descriptionLimit?: number;
}

const props = withDefaults(defineProps<Props>(), {
  dashboard: false,
  descriptionLimit: 150
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
  const checkPermission = true;
  const authorId = postData.value.author.userId;
  const getUserId = "current-user-id";
  
  if (!checkPermission && getUserId !== authorId) return false;
  return true;
});

function updateVoters(voters: IPostVote) {
  postData.value.voters.votesCount = voters.votesCount;
  postData.value.voters.viewerVote = voters.viewerVote;
}

function getStatusVariant() {
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
  const votes = postData.value.voters.votesCount;
  
  if (votes >= 50) return 'critical';
  if (votes >= 20) return 'high';
  if (votes >= 5) return 'medium';
  return 'low';
}

function openImage(src: string) {
  const w = window.open("");
  w?.document.write(`<img src="${src}" style="max-width:100%">`);
}
</script>

<style scoped>
.enhanced-post-item {
  display: flex;
  gap: 16px;
  padding: 24px;
  margin-bottom: 24px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.enhanced-post-item:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
  border-color: #bfdbfe;
}

.vote-section {
  flex-shrink: 0;
}

.content-section {
  flex: 1;
  min-width: 0;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.post-title-link {
  text-decoration: none;
}

.post-title {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--text-main);
  margin-bottom: 4px;
}

.post-title:hover {
  color: var(--primary-blue);
}

.badges-container {
  display: flex;
  gap: 8px;
}

.post-description {
  color: #4b5563;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 12px;
}

.card-image-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 8px;
  border: 1px solid var(--border-light);
  position: relative;
  background: #f3f4f6;
}

.card-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s;
}

.card-image:hover {
  transform: scale(1.02);
}

.expand-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  backdrop-filter: blur(4px);
  pointer-events: none;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
}

.author-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.author-name {
  font-weight: 500;
  color: var(--text-main);
}

.meta-divider {
  width: 1px;
  height: 16px;
  background: var(--border-light);
}

.post-time {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.meta-options {
  margin-left: auto;
}

@media (max-width: 768px) {
  .enhanced-post-item {
    padding: 16px;
    flex-direction: column;
  }
  
  .post-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .badges-container {
    width: 100%;
  }
  
  .card-image {
    height: 140px;
  }
}
</style>