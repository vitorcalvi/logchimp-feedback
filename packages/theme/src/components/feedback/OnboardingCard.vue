<template>
  <div class="modal-overlay" :class="{ active: showOnboarding }" @click.self="closeOnboarding">
    <div class="modal-content onboarding-card">
      <div class="onboarding-header">
        <div class="onboarding-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3L6.91 6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
          </svg>
        </div>
        <h2>Welcome to LogChimp 2.0</h2>
        <p>We've completely redesigned our feedback system to be smarter and more interactive.</p>
      </div>

      <div class="onboarding-steps">
        <div class="step-item">
          <div class="step-circle">1</div>
          <div class="step-text">Submit</div>
        </div>
        <div class="step-item highlight">
          <div class="step-circle">2</div>
          <div class="step-text">Vote</div>
        </div>
        <div class="step-item">
          <div class="step-circle">3</div>
          <div class="step-text">Track</div>
        </div>
      </div>

      <div class="feature-highlight">
        <div class="feature-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </div>
        <div class="feature-content">
          <h3>Smart Auto-Prioritization</h3>
          <p>Badges now automatically update based on community votes. If an idea hits 50+ votes, it becomes <span class="critical">Critical</span>. Help us prioritize what matters most!</p>
        </div>
      </div>

      <button class="btn-primary" @click="closeOnboarding">
        Got it, let's explore!
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showOnboarding = ref(true);

function closeOnboarding() {
  showOnboarding.value = false;
  localStorage.setItem('logchimp_onboarded_v2', 'true');
}
</script>

<style scoped>
.onboarding-card {
  padding: 48px;
  text-align: center;
  max-width: 650px;
}

.onboarding-header {
  margin-bottom: 40px;
}

.onboarding-header h2 {
  font-size: 1.8rem;
  margin-bottom: 12px;
  color: var(--text-main);
}

.onboarding-header p {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 24px;
}

.onboarding-steps {
  display: flex;
  justify-content: space-between;
  margin: 40px 0;
  position: relative;
}

.onboarding-steps::before {
  content: '';
  position: absolute;
  top: 24px;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--border-light);
  z-index: 0;
}

.step-item {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 0 10px;
}

.step-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--bg-body);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--text-secondary);
  border: 3px solid white;
  box-shadow: var(--shadow-sm);
  font-size: 1.1rem;
}

.step-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.step-item.highlight .step-circle {
  background: var(--primary-blue);
  color: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.step-item.highlight .step-text {
  color: var(--primary-blue);
}

.feature-highlight {
  text-align: left;
  background: #f9fafb;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 32px;
  border: 1px dashed var(--border-light);
  display: flex;
  gap: 16px;
}

.feature-icon {
  min-width: 24px;
}

.feature-content h3 {
  margin-bottom: 6px;
  font-weight: 600;
}

.feature-content p {
  font-size: 0.95rem;
  color: #4b5563;
}

.critical {
  color: var(--error-red);
  font-weight: 600;
}

.btn-primary {
  background: var(--primary-blue);
  color: white;
  padding: 14px;
  width: 100%;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 6px 8px -1px rgba(59, 130, 246, 0.4);
}

@media (max-width: 768px) {
  .onboarding-card {
    padding: 30px 20px;
  }
  
  .feature-highlight {
    flex-direction: column;
    gap: 12px;
  }
}
</style>