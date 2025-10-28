# ICON_CLEANUP — WigShop

This checklist is a safe, low-risk audit and cleanup guide for the icon assets (`assets/icon-*.svg`) in the theme. It does NOT delete files — it lists candidates and next steps so you can review and remove or consolidate icons intentionally.

## Summary

- Goal: find unused or duplicate icon SVGs, consolidate duplicates, and propose safe removals to reduce asset count and HTTP requests (or content weight when inlined).
- Scope: `assets/icon-*.svg` inside the theme.
- Safety: No files removed automatically. This document records findings and recommended actions with risk levels.

## Quick wins (low risk)

- Consolidate obvious duplicates (e.g., `icon-checkmark.svg` vs `icon-check-mark.svg`)
- Inline the most-used small icons in critical templates (search, cart, close, caret) and lazy-load or keep the rest as external assets.
- Remove any icons that are not referenced anywhere in the theme.

## How to detect usage (Windows / cmd.exe)

Run these commands from the workspace root (works in `cmd.exe`). They will list all icon files and then search the codebase for references.

1. List all icon assets:

  dir assets\icon-*.svg /b

1. Search for references (fast, reports files that contain the icon name):

  FOR /F "usebackq delims=" %f IN (`dir /b assets\icon-*.svg`) DO @echo %f & findstr /s /i /m "%~nf.svg" *.* || echo "NO_MATCH: %f"

Notes:

- `findstr` is case-insensitive with `/i` and returns filenames with `/m`.
- The command above prints the icon filename then either the files referencing it or `NO_MATCH` if none found.

PowerShell variant (recommended for richer output):

  Get-ChildItem assets\icon-*.svg -Name | ForEach-Object { $icon=$_; $matches = Select-String -Path "**\*.*" -Pattern [regex]::Escape($icon) -SimpleMatch -List; if ($matches) { $icon; $matches.Path | Get-Unique } else { "$icon - NO MATCH" } }

This will produce a per-icon report listing at least one referencing file path or `NO MATCH`.

## Example interpretation

- If Select-String returns no matches for `icon-foo.svg`, it's safe to consider removal (low risk) after manual verification in a staging environment.
- If there are 1-2 matches (only used in an optional section you don't plan to enable), consider deleting or consolidating into a single shared icon snippet.
- If an icon is referenced many times across templates (e.g., `icon-caret.svg`, `icon-close.svg`, `icon-search.svg`), keep it and optionally inline it in the most critical templates.

## Duplicate icons to consider consolidating (likely candidates — please verify)

- icon-checkmark.svg vs icon-check-mark.svg — recommended: keep one, update templates to use a single filename.
- icon-cart.svg vs icon-cart-empty.svg — these are both used but are semantically different; keep both.
- icon-close.svg vs icon-close-small.svg — keep both if both sizes are used, otherwise consolidate one.

## Thematic or product-specific icons (possible removal candidates if unused)

These are commonly added by merchants or theme designers but may not be used by your store. Use the detection commands above to verify:

- icon-banana.svg
- icon-carrot.svg
- icon-pepper.svg
- icon-serving-dish.svg
- icon-plant.svg
- icon-shoe.svg
- icon-pants.svg
- icon-lipstick.svg
- icon-perfume.svg

If any of the above report `NO MATCH` they are safe to remove (low risk), or move to `assets/legacy-icons/` for archival.

## Suggested process (step-by-step)

1. Run the PowerShell command above and save results to a file (e.g., `icon-usage.txt`).
2. Review all `NO MATCH` icons. For each, confirm it's not referenced by any remote app or inline HTML (search for the raw filename without Liquid wrappers).
3. Move candidates to `assets/legacy-icons/` (instead of permanently deleting) and re-publish to staging for site verification.
4. After 48–72 hours of QA on staging (click through pages and templates), permanently delete archived icons.
5. Consolidate duplicates by updating the Liquid templates to reference a single filename, then remove duplicate file(s).
6. Optionally build an SVG sprite for the most-used icons (medium risk) or inline the top 6 icons in `layout/theme.liquid` for critical rendering.

## Risk matrix

- Low risk: Removing icons with `NO MATCH` after verifying they are not referenced by apps or hardcoded HTML. (Action: move to `assets/legacy-icons/` first.)
- Medium risk: Consolidating duplicates (requires updating templates). (Action: run Theme Check + QA.)
- High risk: Replacing icon delivery pattern (sprite generation or aggressive inlining) — needs Lighthouse baseline and rollback plan.

## Output to add to `.Todos` after audit

- [ ] Create `assets/legacy-icons/` and move safe-to-delete icons there.
- [ ] Replace duplicate references (list files that need update) and remove duplicates.
- [ ] Consider sprite / inline for top 6 icons: search, cart, close, caret, arrow, account.

## Next steps for me (if you want me to continue)

- I can run an automated usage scan and produce a per-icon report (icon filename -> referencing files). I will then create a follow-up PR that moves `NO MATCH` icons to `assets/legacy-icons/` (staged, not deleted) and update the TODO list.
- I can also (optionally) consolidate the obvious duplicates and open a PR with template updates.

---
Generated by Copilot assistant on request. Review before deleting any files.
