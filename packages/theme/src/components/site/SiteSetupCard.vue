<template>
  <card>
    <template #title>
			Setup your feedback site
    </template>
    <template #label>
			Complete your site setup to access the dashboard.
    </template>

    <div :class="$style.cta">
      <Button type="primary" href="/setup/welcome">
        Create owner account
      </Button>
    </div>
  </card>
</template>

<script setup lang="ts">
// components
import Card from "../ui/Card.vue";
import Button from "../ui/Button.vue";
</script>

<style module>
.cta {
	margin-bottom: 1.5rem;
}
.image {
	max-width: 20rem;
	margin-left: auto;
	margin-right: auto;
}
.image img {
	width: 100%;
}
</style>
