import { defineConfig } from 'vite';
import kyeTutorialContentPlugin from './content-loader';

export default defineConfig({
  plugins: [
    kyeTutorialContentPlugin()
  ]
});