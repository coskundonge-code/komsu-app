import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored / build artifacts — lint'lenmemeli (ör. postinstall'in kopyaladigi PDF.js worker):
    "public/**",
    "scripts/**",
  ]),
  // Bilerek kullanilmayan tanimlayicilar icin "_" onek konvansiyonunu onurlandir
  // (typescript-eslint'in resmi onerisi). Imza geregi tutulan parametreler ve
  // yakalanan-ama-kullanilmayan hatalar "_" ile susturulur; gercekten olu kod yine temizlenir.
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "all",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
]);

export default eslintConfig;
