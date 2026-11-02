# Dockshift

**A dock that opens into a drawer.** Dockshift keeps a compact, useful dock on
screen and expands that same surface into a full navigation drawer when pressed
or dragged from anywhere on the dock or drawer surface.

It is a React component with touch and mouse dragging, a controlled state API,
keyboard support, reduced-motion styles, and CSS that can be themed without
bringing in a design system.

## Install

```sh
npm install dockshift react react-dom
```

Import the default stylesheet once in your application:

```tsx
import { Dockshift } from 'dockshift';
import 'dockshift/styles.css';
```

## Use

```tsx
import { useState } from 'react';
import { Dockshift } from 'dockshift';
import 'dockshift/styles.css';

export function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <Dockshift
      open={open}
      onOpenChange={setOpen}
      title="Navigation"
      description="Choose a destination."
      handleLabel="Open navigation"
      dockLabel="Quick navigation"
      dock={
        <div className="my-dock-items">
          <button type="button">Home</button>
          <button type="button">Search</button>
          <button type="button">Profile</button>
        </div>
      }
    >
      <nav aria-label="All destinations" className="my-drawer-content">
        <a href="/projects">Projects</a>
        <a href="/activity">Activity</a>
        <a href="/settings">Settings</a>
      </nav>
    </Dockshift>
  );
}
```

The `dock` prop is the compact resting state. `children` are the expanded
drawer. The component owns the handle, overlay, drag gesture, and accessibility
semantics; the application owns navigation and content.

Vertical dragging can start anywhere on the dock or drawer, while taps continue
to activate controls. Scrollable drawer content and form controls keep their
normal interactions. Add `data-dockshift-no-drag` to another custom control if
its own pointer gesture should not move the sheet.

## Sizing and theming

```tsx
<Dockshift
  open={open}
  onOpenChange={setOpen}
  collapsedHeight="6.25rem"
  expandedHeight="min(90dvh, 50rem)"
  dockHeight="4rem"
  handleHeight="2.25rem"
  maxWidth="30rem"
  title="Navigation"
  handleLabel="Open navigation"
  dockLabel="Quick navigation"
  dock={<div className="my-dock-items"><button type="button">Home</button></div>}
  style={{
    '--dockshift-surface': '#fcfbf8',
    '--dockshift-text': '#273128',
    '--dockshift-border': 'rgba(42, 54, 43, 0.1)',
    '--dockshift-handle-color': '#b4b8b0',
    '--dockshift-backdrop-color': 'rgba(27, 35, 29, 0.28)',
    '--dockshift-focus': '#527d64',
  }}
>
  <nav aria-label="All destinations" className="my-drawer-content">
    <a href="/projects">Projects</a>
    <a href="/activity">Activity</a>
    <a href="/settings">Settings</a>
  </nav>
</Dockshift>
```

Available CSS variables include `--dockshift-surface`, `--dockshift-text`,
`--dockshift-border`, `--dockshift-shadow`, `--dockshift-radius`,
`--dockshift-handle-color`, `--dockshift-backdrop-color`,
`--dockshift-backdrop-blur`, `--dockshift-focus`, and `--dockshift-z-index`.

Use `classNames` to add classes to the sheet, backdrop, handle zone, handle,
content, or dock without replacing the built-in behavior.

## Development

```sh
npm ci
npm run dev        # interactive demo
npm run typecheck
npm run build      # package JavaScript and TypeScript declarations
npm run build:demo
```

For a real phone on the same Wi-Fi, start Vite with
`npm run dev -- --host 0.0.0.0` and open the Mac's LAN address on the phone.

The demo is a responsive mobile app preview: it fills a phone viewport, and on
wide screens it sits inside a phone frame beside a short introduction, running
at a real phone width so it can be tried with a pointer. It is a static Vite
site, and its relative asset paths work at a GitHub Pages
project URL such as `https://username.github.io/repository/`. The included
`.github/workflows/pages.yml` builds and deploys it when this folder is the root
of its own GitHub repository. In that repository, set **Settings → Pages →
Build and deployment → Source** to **GitHub Actions**.

The package is currently version `0.1.0`. The project uses the repository's
MPL-2.0 license and Radix Dialog for dialog semantics and overlay behavior.
