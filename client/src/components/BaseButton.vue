<template>
  <button
    class="base-button"
    :class="variant"
    :type="type"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary'
  },
  disabled: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.base-button {
  width: 100%;
  min-height: 44px; /* accesibilitate touch */
  padding: clamp(0.75rem, 2vw, 1rem);
  font-size: clamp(0.95rem, 2.5vw, 1.1rem);
  font-weight: 600;
  border-radius: 0.75rem;
  border: 2px solid transparent;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  text-transform: uppercase;
  letter-spacing: 0.05em;

  transition: background-color 0.25s ease,
              transform 0.15s ease,
              box-shadow 0.25s ease;
}

/* VARIANTE */
.primary {
  background-color: var(--color-primary);
  color: var(--vt-c-white);
}

.accent {
  background-color: var(--color-accent);
  color: var(--vt-c-blue-dark);
}

/* Hover doar pe device-uri cu mouse */
@media (hover: hover) {
  .base-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
  }

  .accent:hover {
    background-color: var(--color-accent-hover); 
  }

  .primary:hover {
    background-color: var(--vt-c-blue-dark);
  }
}

/* Active (touch feedback) */
.base-button:active {
  transform: scale(0.96);
}

/* Disabled */
.base-button:disabled {
  background-color: var(--color-background-mute);
  color: var(--vt-c-text-light-2);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}
</style>
