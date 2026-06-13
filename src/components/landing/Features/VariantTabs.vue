<script setup lang="ts">
// Visual: the three technologies powering vue-bits, shown as floating
// pills that drift gently and pulse their borders in sequence using each
// brand's own color (Vue green, TS blue, Tailwind cyan).
import iconLogo from '@/assets/logos/vue-bits-logo-small.svg';
</script>

<template>
  <div class="ln-feat-stack">
    <div class="ln-feat-stack-chip ln-feat-stack-chip--vue">
      <span class="ln-feat-stack-mark ln-feat-stack-mark--vue" aria-hidden="true">
        <img :src="iconLogo" alt="" />
      </span>
      <span class="ln-feat-stack-name">Vue&nbsp;3</span>
    </div>

    <div class="ln-feat-stack-chip ln-feat-stack-chip--ts">
      <span class="ln-feat-stack-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="18" height="18" fill="none">
          <rect width="32" height="32" rx="4" fill="#3178C6" />
          <path
            d="M9.5 17.5h3v8.4h2.6v-8.4h3v-2.3h-8.6v2.3zm9.4 6.7c.6 1.2 1.9 2 3.9 2 2.4 0 4-1.2 4-3.2 0-1.7-.9-2.6-3.1-3.1l-1-.2c-1-.2-1.4-.6-1.4-1.1 0-.6.5-1 1.3-1 .8 0 1.3.4 1.5 1l2.2-.7c-.5-1.4-1.7-2.1-3.7-2.1-2.2 0-3.7 1.2-3.7 3 0 1.7 1 2.6 3.1 3l1 .3c1.1.2 1.5.6 1.5 1.2 0 .6-.6 1.1-1.6 1.1-1 0-1.6-.5-2-1.3l-2 .8z"
            fill="#fff"
          />
        </svg>
      </span>
      <span class="ln-feat-stack-name">TypeScript</span>
    </div>

    <div class="ln-feat-stack-chip ln-feat-stack-chip--tw">
      <span class="ln-feat-stack-mark" aria-hidden="true">
        <svg viewBox="0 0 32 20" width="22" height="14" fill="none">
          <path
            d="M16 0C11.733 0 9.067 2.133 8 6.4 9.6 4.267 11.467 3.467 13.6 4c1.217.305 2.087 1.187 3.05 2.165C18.218 7.756 19.97 9.6 23.6 9.6c4.267 0 6.933-2.133 8-6.4-1.6 2.133-3.467 2.933-5.6 2.4-1.217-.305-2.087-1.187-3.05-2.165C21.382 1.844 19.63 0 16 0zM8 9.6c-4.267 0-6.933 2.133-8 6.4 1.6-2.133 3.467-2.933 5.6-2.4 1.217.305 2.087 1.187 3.05 2.165C10.218 17.356 11.97 19.2 15.6 19.2c4.267 0 6.933-2.133 8-6.4-1.6 2.133-3.467 2.933-5.6 2.4-1.217-.305-2.087-1.187-3.05-2.165C13.382 11.444 11.63 9.6 8 9.6z"
            fill="#38BDF8"
          />
        </svg>
      </span>
      <span class="ln-feat-stack-name">Tailwind</span>
    </div>
  </div>
</template>

<style>
.ln-feat-stack {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 200px;
  overflow: hidden;
  box-sizing: border-box;
}

/* Each chip is positioned absolutely and drifts on its own loop. */
.ln-feat-stack-chip {
  --chip-color: rgba(255, 255, 255, 0.12);
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1;
  white-space: nowrap;
}

/* ── Positions ── */

.ln-feat-stack-chip--vue {
  --chip-color: #7cff67;
  top: 22%;
  left: 14%;
  transform: rotate(-5deg);
  animation:
    driftA 7s ease-in-out infinite,
    pulseVue 6s ease-in-out infinite;
}

.ln-feat-stack-chip--ts {
  --chip-color: #3178c6;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  animation:
    driftB 8s ease-in-out infinite,
    pulseTs 6s ease-in-out infinite 2s;
}

.ln-feat-stack-chip--tw {
  --chip-color: #38bdf8;
  bottom: 20%;
  right: 12%;
  transform: rotate(4deg);
  animation:
    driftC 7.5s ease-in-out infinite,
    pulseTw 6s ease-in-out infinite 4s;
}

/* ── Drift animations (gentle floating) ── */

@keyframes driftA {
  0%,
  100% {
    transform: translate(0, 0) rotate(-5deg);
  }
  50% {
    transform: translate(6px, -8px) rotate(-3deg);
  }
}

@keyframes driftB {
  0%,
  100% {
    transform: translate(-50%, -50%);
  }
  50% {
    transform: translate(calc(-50% + 4px), calc(-50% - 6px));
  }
}

@keyframes driftC {
  0%,
  100% {
    transform: translate(0, 0) rotate(4deg);
  }
  50% {
    transform: translate(-7px, 5px) rotate(6deg);
  }
}

/* ── Border pulse: each chip glows briefly in its own brand color ── */

@keyframes pulseVue {
  0%,
  70%,
  100% {
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 0 transparent;
    background: rgba(255, 255, 255, 0.03);
  }
  15%,
  25% {
    border-color: #7cff67;
    box-shadow:
      0 0 0 1px rgba(0, 255, 8, 0.35),
      0 0 24px rgba(89, 255, 0, 0.32);
    background: rgba(106, 255, 0, 0.07);
  }
}

@keyframes pulseTs {
  0%,
  70%,
  100% {
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 0 transparent;
    background: rgba(255, 255, 255, 0.03);
  }
  15%,
  25% {
    border-color: #3178c6;
    box-shadow:
      0 0 0 1px rgba(49, 120, 198, 0.4),
      0 0 24px rgba(49, 120, 198, 0.32);
    background: rgba(49, 120, 198, 0.08);
  }
}

@keyframes pulseTw {
  0%,
  70%,
  100% {
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 0 transparent;
    background: rgba(255, 255, 255, 0.03);
  }
  15%,
  25% {
    border-color: #38bdf8;
    box-shadow:
      0 0 0 1px rgba(56, 189, 248, 0.4),
      0 0 24px rgba(56, 189, 248, 0.32);
    background: rgba(56, 189, 248, 0.08);
  }
}

/* ── Mark + label ── */

.ln-feat-stack-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.ln-feat-stack-mark--vue img {
  width: auto;
  height: 20px;
}

.ln-feat-stack-name {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.88);
  letter-spacing: -0.01em;
}

/* ── Connecting lines hint at composition (subtle) ── */

.ln-feat-stack::before,
.ln-feat-stack::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 1px;
  height: 70%;
  background: linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%);
  transform-origin: center;
  pointer-events: none;
  z-index: 0;
}

.ln-feat-stack::before {
  transform: translate(-50%, -50%) rotate(35deg);
}

.ln-feat-stack::after {
  transform: translate(-50%, -50%) rotate(-35deg);
}

@media (max-width: 1024px) {
  .ln-feat-stack-chip--vue {
    top: 18%;
    left: 8%;
  }
  .ln-feat-stack-chip--tw {
    bottom: 16%;
    right: 6%;
  }
}
</style>
