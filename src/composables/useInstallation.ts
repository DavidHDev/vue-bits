import { ref, watch } from 'vue';

export type InstallMode = 'cli' | 'manual';
export type CliTool = 'shadcn' | 'jsrepo';
export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

const read = <T extends string>(key: string, fallback: T, allowed: readonly T[]): T => {
  try {
    const value = localStorage.getItem(key) as T | null;
    return value && allowed.includes(value) ? value : fallback;
  } catch {
    return fallback;
  }
};

const persist = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    return;
  }
};

const installMode = ref<InstallMode>(read<InstallMode>('vb_install_mode', 'manual', ['cli', 'manual']));
const cliTool = ref<CliTool>(read<CliTool>('vb_cli_tool', 'shadcn', ['shadcn', 'jsrepo']));
const packageManager = ref<PackageManager>(
  read<PackageManager>('vb_pkg_manager', 'npm', ['pnpm', 'npm', 'yarn', 'bun'])
);

watch(installMode, value => persist('vb_install_mode', value));
watch(cliTool, value => persist('vb_cli_tool', value));
watch(packageManager, value => persist('vb_pkg_manager', value));

export function useInstallation() {
  return {
    installMode,
    cliTool,
    packageManager,
    setInstallMode: (value: InstallMode) => (installMode.value = value),
    setCliTool: (value: CliTool) => (cliTool.value = value),
    setPackageManager: (value: PackageManager) => (packageManager.value = value)
  };
}
