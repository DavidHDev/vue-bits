const TYPE_DEPENDENCIES: Record<string, string> = {
  three: '@types/three',
  'matter-js': '@types/matter-js'
};

export const INSTALL_COMMANDS = {
  pnpm: 'pnpm add',
  npm: 'npm install',
  yarn: 'yarn add',
  bun: 'bun add'
} as const;

export type InstallManager = keyof typeof INSTALL_COMMANDS;

export const getTypeDependencies = (dependencies: string[]) =>
  [
    ...new Set(
      dependencies
        .map(dependency => {
          const specifier = dependency.replace(/@[^/@]+$/, '');
          const name = specifier
            .split('/')
            .slice(0, specifier.startsWith('@') ? 2 : 1)
            .join('/');
          return TYPE_DEPENDENCIES[name];
        })
        .filter(Boolean)
    )
  ].sort();

export const normalizeDependencies = (dependencies: string | string[] = '') => [
  ...new Set(
    (typeof dependencies === 'string' ? dependencies.split(/\s+/) : dependencies).map(d => d.trim()).filter(Boolean)
  )
];

export const generateDependencyCommands = (
  dependencies: string | string[] = '',
  withTypes = true
): Record<InstallManager, string> | null => {
  const list = normalizeDependencies(dependencies);
  if (!list.length) return null;
  const depsString = list.join(' ');
  const typeDependencies = withTypes ? getTypeDependencies(list) : [];

  return Object.fromEntries(
    Object.entries(INSTALL_COMMANDS).map(([manager, command]) => [
      manager,
      `${command} ${depsString}${typeDependencies.length ? ` && ${command} -D ${typeDependencies.join(' ')}` : ''}`
    ])
  ) as Record<InstallManager, string>;
};
