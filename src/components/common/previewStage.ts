import { inject, type InjectionKey, type Ref } from 'vue';

export type DemoMode = 'none' | 'landing' | 'mobile' | 'card';

export type PreviewStageContext = {
  controls: Ref<HTMLElement | null>;
  hasControls: Ref<boolean>;
  demo: {
    mode: Ref<DemoMode>;
    setMode: (mode: DemoMode) => void;
    setNarrow: (narrow: boolean) => void;
    setPresent: (present: boolean) => void;
  } | null;
};

export const PREVIEW_STAGE: InjectionKey<PreviewStageContext> = Symbol('preview-stage');

export const usePreviewStage = () => inject(PREVIEW_STAGE, null);
