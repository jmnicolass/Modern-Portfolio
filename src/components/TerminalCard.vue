<template>
  <div class="rounded-card border border-border bg-background p-4 font-mono">
    <div class="mb-4 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
      <span>Availability</span>
      <span class="text-accent-mint">Open</span>
    </div>
    <div class="space-y-2 text-sm">
      <p>Available for work</p>
      <p>Open to new opportunities<span class="terminal-cursor"></span></p>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.terminal-cursor {
  display: inline-block;
  width: 8px;
  height: 1rem;
  margin-left: 4px;
  vertical-align: -2px;
  background: currentColor;
  animation: blink 1s steps(2, start) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .terminal-cursor {
    animation: none;
  }
}
</style>
