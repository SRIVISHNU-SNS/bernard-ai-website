# Bernard — Your AI, Everywhere

React / TypeScript landing page using the supplied managed Webdev project toolchain.

- `pnpm dev:static`: run the Bernard landing page on `PORT` (default 3000).
- `pnpm build:static`: build deployable website files into `dist/public/`.
- `pnpm check`: run TypeScript checks.

Bernard is an image-led landing page for a desktop AI assistant concept. The supplied balloon-and-mountain image is used as the hero artwork. The site includes an accessible avatar preview and a coming-soon install state.

The desktop application/installer and the Gemini 4 local model connection are **not included**. The avatar experience explicitly reports that the model is not connected, and the unavailable download button cannot start a nonexistent installer.

Project layout: `client/src/pages/Home.tsx` contains the page and dialogs; `client/src/index.css` contains responsive branding and reduced-motion support; `client/public/images/bernard-balloon-mountains.png` is the supplied reference artwork; `client/public/manus-routes.json` declares the page routes. `TODO.md` tracks delivery outcomes.

Use `pnpm check` and `pnpm build:static` for the site's checks and production build.

`server/_core/publicConfig.ts` exposes only named public runtime values. Private keys stay server-side. The platform serves managed `/manus-storage/` assets; the application does not register a second proxy.

Platform configuration is readable and editable through `webdev.config`. Default settings are initial values, not enforced constraints. The agent may modify the files, commands and configuration or follow the flexible guide for another stack.
