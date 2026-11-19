import { AppWindowMacIcon, DashboardSquare02Icon, RectangularIcon, SmartPhone01Icon } from '@hugeicons/core-free-icons';
import type { DemoMode } from './previewStage';

export const DEMO_MODES: { value: DemoMode; label: string; icon: typeof RectangularIcon }[] = [
  { value: 'none', label: 'Background only', icon: RectangularIcon },
  { value: 'landing', label: 'Landing page', icon: AppWindowMacIcon },
  { value: 'mobile', label: 'Mobile', icon: SmartPhone01Icon },
  { value: 'card', label: 'Card', icon: DashboardSquare02Icon }
];

export const DEMO_NARROW_WIDTH = 640;

export const demoView = (mode: DemoMode, narrow: boolean): DemoMode => (mode === 'landing' && narrow ? 'mobile' : mode);

export const demoModesFor = (narrow: boolean) =>
  narrow ? DEMO_MODES.filter(item => item.value !== 'landing') : DEMO_MODES;
