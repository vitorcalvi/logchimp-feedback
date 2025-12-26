<template>
  <div class="modal-overlay" :class="{ active: showModal }" @click.self="closeModal">
    <div class="modal-content feedback-modal">
      <div class="feedback-modal-header">
        <h3>Add New Feedback</h3>
        <button @click="closeModal" class="close-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="feedback-modal-body">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label class="form-label">Feedback Type</label>
            <div class="type-selector">
              <div 
                v-for="type in feedbackTypes" 
                :key="type.value"
                class="type-option"
                :class="{ selected: selectedType === type.value }"
                @click="selectType(type.value)"
              >
                <component :is="type.icon" class="type-icon" />
                <span class="type-name">{{ type.label }}</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="fbTitle">Title</label>
            <input 
              v-model="formData.title"
              type="text" 
              id="fbTitle" 
              class="form-input" 
              placeholder="Short summary of your idea..."
              required
            >
            <div v-if="errors.title" class="error-msg">{{ errors.title }}</div>
          </div>

          <div class="form-group">
            <label class="form-label" for="fbDesc">Description</label>
            <textarea 
              v-model="formData.description"
              id="fbDesc" 
              class="form-input" 
              rows="4" 
              placeholder="Describe the details..."
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Attachments (Optional)</label>
            <div class="attachment-area">
              <label class="btn-secondary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Upload Image
                <input type="file" hidden @change="handleImageUpload">
              </label>
              
              <button type="button" class="btn-secondary" @click="takeScreenshot">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                Take Screenshot
              </button>
            </div>
            
            <div class="preview-container" :class="{ active: imagePreview }">
              <button class="remove-image-btn" @click="removeImage">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <img v-if="imagePreview" :src="imagePreview" class="preview-image" alt="Preview">
            </div>
          </div>
        </form>
      </div>
      
      <div class="feedback-modal-footer">
        <button type="button" class="btn-secondary" @click="closeModal">Cancel</button>
        <button type="submit" class="btn-primary" @click="submitForm">Submit Feedback</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  Lightbulb as FeatureIcon,
  Bug as BugIcon,
  PenTool as EnhancementIcon 
} from 'lucide-vue';

const emit = defineEmits(['submit', 'close']);

const showModal = ref(true);
const selectedType = ref('feature');
const imagePreview = ref<string | null>(null);
const formData = ref({
  title: '',
  description: '',
  attachment: null as File | null
});
const errors = ref({
  title: ''
});

const feedbackTypes = [
  { value: 'feature', label: 'Feature', icon: FeatureIcon },
  { value: 'bug', label: 'Bug', icon: BugIcon },
  { value: 'enhancement', label: 'Enhancement', icon: EnhancementIcon }
];

function selectType(type: string) {
  selectedType.value = type;
}

function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    formData.value.attachment = file;
    imagePreview.value = URL.createObjectURL(file);
  }
}

function takeScreenshot() {
  // Screenshot logic would go here
  console.log('Screenshot functionality would be implemented here');
  showToast('Screenshot captured!');
}

function removeImage() {
  imagePreview.value = null;
  formData.value.attachment = null;
}

function validateForm() {
  let isValid = true;
  errors.value.title = '';
  
  if (!formData.value.title.trim()) {
    errors.value.title = 'Title is required';
    isValid = false;
  }
  
  return isValid;
}

function submitForm() {
  if (!validateForm()) return;
  
  emit('submit', {
    type: selectedType.value,
    ...formData.value
  });
  
  closeModal();
}

function closeModal() {
  showModal.value = false;
  emit('close');
}

function showToast(message: string) {
  // Toast notification logic would go here
  console.log('Toast:', message);
}
</script>

<style scoped>
/* Styles match those in update.html */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.modal-overlay.active { 
  opacity: 1; 
  pointer-events: auto; 
}

.modal-content {
  background: white;
  width: 90%;
  max-width: 600px;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transform: scale(0.9) translateY(20px);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: none;
}

.modal-overlay.active .modal-content { 
  display: block; 
  transform: scale(1) translateY(0); 
}

.feedback-modal-header {
  padding: 24px 32px;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.feedback-modal-body { 
  padding: 32px; 
}

.form-group { 
  margin-bottom: 24px; 
}

.form-label { 
  display: block; 
  font-weight: 600; 
  margin-bottom: 8px; 
  color: var(--text-main); 
  font-size: 0.9rem; 
}

.type-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.type-option {
  border: 2px solid var(--border-light);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.type-option:hover { 
  border-color: #bfdbfe; 
  background: #f9fafb; 
}

.type-option.selected { 
  border-color: var(--primary-blue); 
  background: #eff6ff; 
}

.type-option.selected .type-icon { 
  color: var(--primary-blue); 
}

.type-icon { 
  display: block; 
  margin-bottom: 8px; 
  color: var(--text-secondary); 
}

.type-name { 
  font-weight: 600; 
  font-size: 0.9rem; 
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus { 
  border-color: var(--primary-blue); 
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); 
}

.form-input.error { 
  border-color: var(--error-red); 
}

.error-msg { 
  color: var(--error-red); 
  font-size: 0.85rem; 
  margin-top: 6px; 
  display: block; 
}

.attachment-area {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.preview-container {
  display: none;
  position: relative;
  margin-top: 16px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-light);
}

.preview-container.active { 
  display: block; 
}

.preview-image {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  background: #f3f4f6;
  display: block;
}

.remove-image-btn {
  position: absolute;
  top: 8px; right: 8px;
  background: rgba(0,0,0,0.6);
  color: white;
  border-radius: 50%;
  width: 28px; height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.remove-image-btn:hover { 
  background: var(--error-red); 
}

.feedback-modal-footer {
  padding: 24px 32px;
  background: #f9fafb;
  border-radius: 0 0 24px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
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
  border: none;
  cursor: pointer;
}

.btn-primary:hover { 
  background: var(--primary-dark); 
  transform: translateY(-1px); 
  box-shadow: 0 6px 8px -1px rgba(59, 130, 246, 0.4); 
}

.btn-primary:active { 
  transform: translateY(0); 
}

.btn-secondary {
  background: white;
  color: var(--text-main);
  border: 1px solid var(--border-light);
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn-secondary:hover { 
  background: #f9fafb; 
  border-color: #d1d5db; 
}

@media (max-width: 768px) {
  .type-selector { 
    grid-template-columns: 1fr; 
  }
  
  .feedback-modal-footer { 
    flex-direction: column-reverse; 
  }
  
  .btn-primary, .btn-secondary { 
    width: 100%; 
    justify-content: center; 
  }
  
  .attachment-area { 
    flex-direction: column; 
  }
}
</style>