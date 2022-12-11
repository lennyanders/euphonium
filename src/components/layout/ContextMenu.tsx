import { computePosition, flip, offset, shift } from '@floating-ui/dom';
import { ternary } from 'oby';
import { $, For, batch, useEffect, useEventListener, $$ } from 'voby';

import { Transition } from '../Transition';

export type ContextMenuItem = 'spacer' | { title: string; action: () => void };

const items$ = $<ContextMenuItem[]>([]);
const visible$ = $(false);
const mousePosX$ = $(0);
const mousePosY$ = $(0);

export const showContextMenu = (event: MouseEvent, items: ContextMenuItem[]) => {
  if (!items.length) return;
  event.preventDefault();
  event.stopPropagation();
  batch(() => {
    mousePosX$(event.x);
    mousePosY$(event.y);
    items$(items);
    visible$(true);
  });
};

export const ContextMenu = () => {
  useEventListener(window, 'mousedown', () => visible$(false));

  const menuPosX$ = $(0);
  const menuPosY$ = $(0);
  const transformTransition$ = $(false);
  const ul$ = $<HTMLUListElement>();
  useEffect(() => {
    if ($$(ul$)) transformTransition$(false);
  });
  useEffect(() => {
    const ul = $$(ul$);
    if (!ul) return;

    const mouseX = $$(mousePosX$);
    const mouseY = $$(mousePosY$);
    const virtualEl = {
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        x: mouseX,
        y: mouseY,
        left: mouseX,
        right: mouseX,
        top: mouseY,
        bottom: mouseY,
      }),
    };
    computePosition(virtualEl, ul, {
      placement: 'right-start',
      middleware: [offset(5), flip(), shift()],
    }).then(({ x, y }) => {
      batch(() => {
        menuPosX$(x);
        menuPosY$(y);
      });
      requestAnimationFrame(() => transformTransition$(true));
    });
  });

  return (
    <Transition
      el='ul'
      when={visible$}
      class={[
        'absolute top-0 left-0 min-w-40 text-sm p-1 rd-2 bg-black:75 backdrop-blur-2 grid',
        ternary(transformTransition$, 'transition', 'transition-opacity'),
      ]}
      enterClass='opacity-0'
      leaveClass='opacity-0'
      style={{ transform: () => `translateX(${$$(menuPosX$)}px) translateY(${$$(menuPosY$)}px)` }}
      ref={ul$}
      onMouseDown={(event) => event.stopPropagation()}
      onContextMenu={(event) => event.preventDefault()}
    >
      <For values={items$}>
        {(item) => {
          if (item === 'spacer') {
            return (
              <li>
                <hr class='m-y-1 m-x-.5 op-25' />
              </li>
            );
          }
          return (
            <li>
              <button
                class='w-100% p-y-.5 p-x-1 rd-1 hover:bg-white:25'
                onClick={() => (item.action(), visible$(false))}
              >
                {item.title}
              </button>
            </li>
          );
        }}
      </For>
    </Transition>
  );
};
