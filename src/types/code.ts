export interface CodeObject {
  cli?: string;
  utility?: string;
  code?: string;
  usage?: string;
  installation?: string;
  dependencies?: string;
  [key: string]: string | undefined;
}

export interface CodeObjectInput {
  utility?: string;
  code?: string;
  usage?: string;
  installation?: string;
  dependencies?: string;
  [key: string]: string | undefined;
}

export function createCodeObject(code: string, path: string, data: CodeObjectInput): CodeObject {
  const [, componentName] = path.split('/');
  const { installation, usage, utility, dependencies, code: _ignored, ...extra } = data;
  void _ignored;
  return {
    cli: `npx jsrepo@latest add https://vue-bits.dev/r/${componentName}`,
    ...(installation && { installation }),
    ...(usage && { usage }),
    code,
    ...(utility && { utility }),
    ...(dependencies !== undefined
      ? { dependencies }
      : installation
        ? { dependencies: installation.replace(/^\s*(npm install|pnpm add|yarn add|bun add)\s+/, '').trim() }
        : {}),
    ...extra
  };
}
