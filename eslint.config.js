import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'dev-dist', 'node_modules', '.claude', '.claude-flow'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    // Werft game loop (FL-0069 refactor done): refs/purity/immutability findings are fixed.
    // What remains is setState inside two effects that genuinely sync external things — the
    // roadmap-progress → quest reconciliation and arming the day-tick interval. Both are the
    // documented sync-with-external pattern, so this rule stays warn-scoped here.
    files: ['src/features/buildgame/**/*.tsx'],
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
)
