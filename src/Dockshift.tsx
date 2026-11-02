'use client';

import {
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import * as Dialog from '@radix-ui/react-dialog';

export type DockshiftClassNames = {
  sheet: string;
  backdrop: string;
  handleZone: string;
  handle: string;
  content: string;
  dock: string;
};

export type DockshiftStyle = CSSProperties & {
  '--dockshift-collapsed-height'?: string | number;
  '--dockshift-expanded-height'?: string | number;
  '--dockshift-dock-height'?: string | number;
  '--dockshift-handle-height'?: string | number;
  '--dockshift-max-width'?: string | number;
};

export type DockshiftProps = {
  /** The expanded state. Keep this controlled so the owner can react to dock actions. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Accessible title and description for the expanded drawer. */
  title: string;
  description?: string;
  /** Accessible name for the drag handle and the collapsed dock. */
  handleLabel: string;
  dockLabel: string;
  /** Optional stable ID for the surface and its expanded content. */
  id?: string;
  expandedContentId?: string;
  /** Optional styling hooks for each public surface. */
  classNames?: Partial<DockshiftClassNames>;
  /** CSS variables can also be set here. Numeric size values are pixels. */
  style?: DockshiftStyle;
  collapsedHeight?: number | string;
  expandedHeight?: number | string;
  dockHeight?: number | string;
  handleHeight?: number | string;
  maxWidth?: number | string;
  /** Content shown in the drawer. */
  children: ReactNode;
  /** Persistent compact controls shown while the drawer is closed. */
  dock: ReactNode;
};

const joinClasses = (...classes: Array<string | undefined>) => classes.filter(Boolean).join(' ');
const touchGrabThresholdMs = 220;

type SheetGesture = {
  x: number;
  y: number;
  startHeight: number;
  collapsedHeight: number;
  expandedHeight: number;
  openAtStart: boolean;
  lastY: number;
  lastTime: number;
  heightVelocity: number;
  dragging: boolean;
};

const measureSnapHeights = (sheet: HTMLDivElement) => {
  const startHeight = sheet.getBoundingClientRect().height;
  const probe = sheet.cloneNode(true) as HTMLDivElement;
  probe.removeAttribute('id');
  probe.removeAttribute('data-state');
  probe.removeAttribute('data-dockshift-dragging');
  probe.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
  probe.setAttribute('aria-hidden', 'true');
  probe.inert = true;
  probe.style.position = 'fixed';
  probe.style.top = '0';
  probe.style.right = 'auto';
  probe.style.bottom = 'auto';
  probe.style.left = '-10000px';
  probe.style.margin = '0';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';
  probe.style.height = '';
  probe.style.willChange = 'auto';
  probe.style.removeProperty('--dockshift-drag-progress');
  probe.style.removeProperty('--dockshift-dock-opacity');
  for (const element of [probe, ...probe.querySelectorAll<HTMLElement>('*')]) {
    element.style.setProperty('transition', 'none', 'important');
    element.style.setProperty('animation', 'none', 'important');
  }

  document.body.appendChild(probe);
  try {
    probe.classList.add('is-collapsed');
    probe.classList.remove('is-expanded');
    const collapsedHeight = probe.getBoundingClientRect().height;
    probe.classList.remove('is-collapsed');
    probe.classList.add('is-expanded');
    const expandedHeight = probe.getBoundingClientRect().height;
    return { startHeight, collapsedHeight, expandedHeight };
  } finally {
    probe.remove();
  }
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const cssLength = (value: number | string) => typeof value === 'number' ? `${value}px` : value;
const findScrollableAncestor = (target: HTMLElement, boundary: HTMLElement) => {
  let element: HTMLElement | null = target;
  while (element && element !== boundary) {
    const overflowY = window.getComputedStyle(element).overflowY;
    if ((overflowY === 'auto' || overflowY === 'scroll') && element.scrollHeight > element.clientHeight) return element;
    element = element.parentElement;
  }
  return null;
};
const rubberBandScale = (overshoot: number, height: number) => {
  if (overshoot <= 0 || height <= 0) return 1;
  const resistedStretch = (0.55 * overshoot) / (1 + (0.55 * overshoot) / height);
  return 1 + Math.min(height * 0.05, resistedStretch) / height;
};

/**
 * A persistent dock that can be dragged from its surface or pressed to expand into a drawer.
 * Consumers provide their compact controls and expanded content.
 */
export function Dockshift({
  open,
  onOpenChange,
  title,
  description,
  handleLabel,
  dockLabel,
  id,
  expandedContentId,
  classNames,
  style,
  collapsedHeight,
  expandedHeight,
  dockHeight,
  handleHeight,
  maxWidth,
  children,
  dock,
}: DockshiftProps) {
  const generatedId = useId();
  const sheetId = id ?? `dockshift-${generatedId}`;
  const contentId = expandedContentId ?? `${sheetId}-content`;
  const titleId = `${sheetId}-title`;
  const descriptionId = `${sheetId}-description`;
  const sheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLElement>(null);
  const previousOpenRef = useRef(false);
  const gestureStartRef = useRef<SheetGesture | null>(null);
  const swipedRef = useRef(false);
  const touchTapRef = useRef(false);

  const rootStyle: DockshiftStyle = { ...style };
  if (collapsedHeight !== undefined) rootStyle['--dockshift-collapsed-height'] = cssLength(collapsedHeight);
  if (expandedHeight !== undefined) rootStyle['--dockshift-expanded-height'] = cssLength(expandedHeight);
  if (dockHeight !== undefined) rootStyle['--dockshift-dock-height'] = cssLength(dockHeight);
  if (handleHeight !== undefined) rootStyle['--dockshift-handle-height'] = cssLength(handleHeight);
  if (maxWidth !== undefined) rootStyle['--dockshift-max-width'] = cssLength(maxWidth);

  useEffect(() => {
    contentRef.current?.toggleAttribute('inert', !open);
    dockRef.current?.toggleAttribute('inert', open);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    root.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previousRootOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (open || previousOpenRef.current) handleRef.current?.focus({ preventScroll: true });
    previousOpenRef.current = open;
  }, [open]);

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    touchTapRef.current = false;
    const startsOnHandle = handleRef.current?.contains(event.target as Node) ?? false;
    const target = event.target as HTMLElement;
    if (target.closest('input, textarea, select, [contenteditable="true"], [data-dockshift-no-drag]')) return;
    const sheet = sheetRef.current;
    if (!sheet) return;
    if (open && event.pointerType === 'touch' && findScrollableAncestor(target, sheet)) return;

    const { collapsedHeight: collapsed, expandedHeight: expanded, startHeight } = measureSnapHeights(sheet);
    if (expanded <= collapsed) {
      sheet.style.removeProperty('height');
      return;
    }

    touchTapRef.current = event.pointerType === 'touch' && startsOnHandle;
    sheet.dataset.dockshiftGesture = 'true';
    sheet.style.removeProperty('--dockshift-elastic-scale');
    if (event.pointerType !== 'touch' && startsOnHandle) handleRef.current?.setPointerCapture(event.pointerId);
    gestureStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      startHeight,
      collapsedHeight: collapsed,
      expandedHeight: expanded,
      openAtStart: open,
      lastY: event.clientY,
      lastTime: performance.now(),
      heightVelocity: 0,
      dragging: false,
    };
    swipedRef.current = false;
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const gesture = gestureStartRef.current;
    const sheet = sheetRef.current;
    if (!gesture || !sheet) return;

    const movementY = event.clientY - gesture.y;
    if (!gesture.dragging) {
      const distanceY = Math.abs(movementY);
      const distanceX = Math.abs(gesture.x - event.clientX);
      if (distanceY < 8) return;
      if (distanceY < distanceX * 1.15) {
        gestureStartRef.current = null;
        delete sheet.dataset.dockshiftGesture;
        sheet.style.removeProperty('height');
        return;
      }

      const startsInward = gesture.openAtStart ? movementY > 0 : movementY < 0;
      const pullsPastExpandedEdge = gesture.openAtStart && movementY < 0;
      if (!startsInward && !pullsPastExpandedEdge) {
        gestureStartRef.current = null;
        swipedRef.current = true;
        delete sheet.dataset.dockshiftGesture;
        sheet.style.removeProperty('height');
        return;
      }

      gesture.dragging = true;
      window.getSelection()?.removeAllRanges();
      sheet.dataset.dockshiftDragging = 'true';
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    event.preventDefault();
    event.stopPropagation();
    swipedRef.current = true;
    const height = clamp(gesture.startHeight - movementY, gesture.collapsedHeight, gesture.expandedHeight);
    const overshoot = Math.max(0, gesture.startHeight - movementY - gesture.expandedHeight);
    const progress = (height - gesture.collapsedHeight) / (gesture.expandedHeight - gesture.collapsedHeight);
    sheet.style.height = `${height.toFixed(1)}px`;
    sheet.style.setProperty('--dockshift-elastic-scale', rubberBandScale(overshoot, gesture.expandedHeight).toFixed(4));
    sheet.style.setProperty('--dockshift-drag-progress', progress.toFixed(3));
    sheet.style.setProperty('--dockshift-dock-opacity', (1 - progress).toFixed(3));
    if (backdropRef.current) {
      backdropRef.current.style.opacity = progress.toFixed(3);
      backdropRef.current.style.pointerEvents = progress > 0.02 ? 'auto' : 'none';
    }
    const now = performance.now();
    const elapsed = Math.max(now - gesture.lastTime, 1);
    gesture.heightVelocity = -(event.clientY - gesture.lastY) / elapsed;
    gesture.lastY = event.clientY;
    gesture.lastTime = now;
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    const gesture = gestureStartRef.current;
    gestureStartRef.current = null;
    const sheet = sheetRef.current;
    if (!gesture || !sheet) return;
    if (!gesture.dragging) {
      if (touchTapRef.current && performance.now() - gesture.lastTime >= touchGrabThresholdMs) {
        swipedRef.current = true;
        touchTapRef.current = false;
      }
      delete sheet.dataset.dockshiftGesture;
      sheet.style.removeProperty('height');
      return;
    }

    const rawHeight = gesture.startHeight - (event.clientY - gesture.y);
    const height = clamp(rawHeight, gesture.collapsedHeight, gesture.expandedHeight);
    const overshoot = Math.max(0, rawHeight - gesture.expandedHeight);
    const timeSinceLastMove = performance.now() - gesture.lastTime;
    const heightVelocity = timeSinceLastMove <= 100 ? gesture.heightVelocity : 0;
    const progress = (height - gesture.collapsedHeight) / (gesture.expandedHeight - gesture.collapsedHeight);
    const positionThreshold = gesture.openAtStart ? 0.82 : 0.18;
    const shouldOpen = Math.abs(heightVelocity) > 0.55 ? heightVelocity > 0 : progress >= positionThreshold;

    event.preventDefault();
    event.stopPropagation();
    sheet.style.height = `${height.toFixed(1)}px`;
    sheet.style.setProperty('--dockshift-elastic-scale', rubberBandScale(overshoot, gesture.expandedHeight).toFixed(4));
    delete sheet.dataset.dockshiftDragging;
    delete sheet.dataset.dockshiftGesture;
    sheet.style.removeProperty('--dockshift-elastic-scale');
    onOpenChange(shouldOpen);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      if (sheetRef.current !== sheet) return;
      sheet.style.removeProperty('height');
      sheet.style.removeProperty('--dockshift-drag-progress');
      sheet.style.removeProperty('--dockshift-dock-opacity');
      if (backdropRef.current) {
        backdropRef.current.style.removeProperty('opacity');
        backdropRef.current.style.removeProperty('pointer-events');
      }
    }));
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLElement>) => {
    if (swipedRef.current) {
      event.preventDefault();
      event.stopPropagation();
      swipedRef.current = false;
      touchTapRef.current = false;
      return;
    }
    if (touchTapRef.current && !handleRef.current?.contains(event.target as Node)) {
      event.preventDefault();
      event.stopPropagation();
      onOpenChange(!open);
    }
    touchTapRef.current = false;
  };

  const handlePointerCancel = () => {
    gestureStartRef.current = null;
    swipedRef.current = false;
    touchTapRef.current = false;
    const sheet = sheetRef.current;
    if (!sheet) return;
    delete sheet.dataset.dockshiftDragging;
    delete sheet.dataset.dockshiftGesture;
    sheet.style.removeProperty('--dockshift-elastic-scale');
    window.requestAnimationFrame(() => {
      sheet.style.removeProperty('height');
      sheet.style.removeProperty('--dockshift-drag-progress');
      sheet.style.removeProperty('--dockshift-dock-opacity');
      if (backdropRef.current) {
        backdropRef.current.style.removeProperty('opacity');
        backdropRef.current.style.removeProperty('pointer-events');
      }
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!open || event.key !== 'Tab') return;
    const sheet = sheetRef.current;
    if (!sheet) return;
    const focusable = Array.from(sheet.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )).filter(element => {
      if (element.closest('[inert], [aria-hidden="true"]')) return false;
      const computed = window.getComputedStyle(element);
      return computed.display !== 'none' && computed.visibility !== 'hidden' && element.getClientRects().length > 0;
    });

    if (focusable.length === 0) {
      event.preventDefault();
      sheet.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const focusIsInside = sheet.contains(document.activeElement);
    if (event.shiftKey && (!focusIsInside || document.activeElement === first)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (!focusIsInside || document.activeElement === last)) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal={false}>
      <Dialog.Portal forceMount>
        <Dialog.Overlay
          forceMount
          ref={backdropRef}
          className={joinClasses('dockshift-backdrop', classNames?.backdrop, open ? 'is-visible' : undefined)}
          aria-hidden={!open}
        />
        <Dialog.Content
          forceMount
          ref={sheetRef}
          id={sheetId}
          style={rootStyle}
          className={joinClasses('dockshift-sheet', classNames?.sheet, open ? 'is-expanded' : 'is-collapsed')}
          // Collapsed, the inner <nav> is the landmark; labelling the sheet too would duplicate it.
          role={open ? 'dialog' : undefined}
          aria-modal={open || undefined}
          aria-labelledby={open ? titleId : undefined}
          aria-describedby={open && description ? descriptionId : undefined}
          tabIndex={-1}
          onOpenAutoFocus={event => event.preventDefault()}
          onKeyDownCapture={handleKeyDown}
          onPointerDownCapture={handlePointerDown}
          onPointerMoveCapture={handlePointerMove}
          onPointerUpCapture={handlePointerUp}
          onPointerCancelCapture={handlePointerCancel}
          onClickCapture={handleClickCapture}
        >
          <Dialog.Title id={titleId} className="dockshift-sr-only" aria-hidden={!open}>{title}</Dialog.Title>
          {description && <Dialog.Description id={descriptionId} className="dockshift-sr-only" aria-hidden={!open}>{description}</Dialog.Description>}
          <Dialog.Trigger asChild>
            <button
              ref={handleRef}
              type="button"
              className={joinClasses('dockshift-handle-zone', classNames?.handleZone)}
              aria-label={handleLabel}
              aria-expanded={open}
              aria-controls={contentId}
            >
              <span className={joinClasses('dockshift-handle', classNames?.handle)} aria-hidden="true" />
            </button>
          </Dialog.Trigger>
          <div
            ref={contentRef}
            id={contentId}
            className={joinClasses('dockshift-content', classNames?.content)}
            aria-hidden={!open}
          >
            {children}
          </div>
          <nav
            ref={dockRef}
            className={joinClasses('dockshift-dock', classNames?.dock)}
            aria-label={dockLabel}
            aria-hidden={open || undefined}
          >
            {dock}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Dockshift;
