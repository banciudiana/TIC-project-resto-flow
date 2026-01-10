<template>
  <main class="home-container">
    <section class="content">
      <img src="../assets/logo.svg" alt="RestoFlow logo" class="home-logo" />

      <h1 class="brand-blue">RestoFlow</h1>
      <p class="subtitle">Restaurant Management System</p>

      <div class="button-group">
        <BaseButton variant="primary" @click="$router.push('/orders')">
          Orders
        </BaseButton>

        <BaseButton variant="accent" @click="$router.push('/products')">
          Menu
        </BaseButton>
      </div>
    </section>
  </main>
</template>

<script setup>
import BaseButton from '../components/BaseButton.vue';
</script>

<style scoped>
.home-container {
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: clamp(1rem, 4vw, 3rem);
  text-align: center;
}

.content {
  width: 100%;
  max-width: 32rem; /* ~512px */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.home-logo {
  width: clamp(100px, 25vw, 160px);
  height: auto;
  margin-bottom: clamp(1rem, 3vw, 2rem);
}

h1 {
  font-size: clamp(2.2rem, 6vw, 3.2rem);
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: clamp(1rem, 3vw, 1.3rem);
  margin-bottom: clamp(1.5rem, 4vw, 2.5rem);
  color: var(--color-text);
}

.button-group {
  width: 100%;
  display: flex;
  gap: clamp(0.75rem, 2vw, 1.25rem);
}

/* Mobile: butoane pe coloană */
@media (max-width: 640px) {
  .button-group {
    flex-direction: column;
  }
}

/* Landscape mic (ex: telefon rotit) */
@media (max-height: 500px) {
  .home-container {
    align-items: flex-start;
  }
}
</style>
