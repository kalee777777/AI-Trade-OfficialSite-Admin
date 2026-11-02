import type { Config } from 'tailwindcss';

/**
 * 颜色全部映射到 globals.css 的 CSS 变量（design tokens）。
 * 学员换品牌 = 只改 globals.css 里 :root 的 4 个 --brand-* 变量，全站生效。
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--brand)',
          dark: 'var(--brand-dark)',
          light: 'var(--brand-light)',
          tint: 'var(--brand-tint)',
        },
        ink: 'var(--ink)',
        paper: 'var(--paper)',
        muted: 'var(--muted)',
        line: 'var(--line)',
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto',
          '"Helvetica Neue"', 'Arial', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
export default config;
