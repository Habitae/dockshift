# Dockshift demo

From the Dockshift project folder, run `npm ci` and `npm run dev`. Open the
local URL Vite prints to try the dock and drawer. For a phone on the same
Wi-Fi, run `npm run dev -- --host 0.0.0.0` and open the Mac's LAN address.

The page imports the package source directly through the local Vite alias.
`npm run build:demo` creates the static `demo-dist` site for GitHub Pages.
