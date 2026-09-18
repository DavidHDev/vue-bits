<template>
  <div class="customize-frame">
    <div class="customize-heading">
      <h2 class="demo-title-extra">Customize</h2>
    </div>
    <div class="preview-options">
      <slot />
    </div>
  </div>
</template>

<style>
.customize-frame {
  margin-top: 2rem;
  padding: 4px;
  border: 1px solid transparent;
  border-radius: 14px;
  background: var(--surface-ghost-track);
  box-shadow: var(--surface-ghost-highlight);
}

.customize-heading {
  display: flex;
  min-height: 46px;
  align-items: center;
  padding: 0.5rem 0.75rem 0.65rem 0.9rem;
}

.customize-heading .demo-title-extra {
  margin: 0;
  font-size: 0.9375rem;
}
</style>
