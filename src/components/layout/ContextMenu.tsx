import { computePosition, flip, offset, shift } from '@floating-ui/dom';
import { $, For, useEffect, useEventListener, $$, store } from 'voby';

import { Transition } from '../Transition';

export type ContextMenuItem = 'spacer' | { title: string; action: () => void };

const items$ = $<ContextMenuItem[]>([]);
const visible$ = $(false);
const mousePos = store({ x: 0, y: 0 });

export const showContextMenu = (event: MouseEvent, items: ContextMenuItem[]) => {
  if (!items.length) return;
  event.preventDefault();
  event.stopPropagation();
  Object.assign(mousePos, { x: event.x, y: event.y });
  items$(items);
  visible$(true);
};

export const ContextMenu = () => {
  useEventListener(window, 'mousedown', () => visible$(false));

  const menuPos = store({ x: 0, y: 0 });
  const ul$ = $<HTMLUListElement>();

  useEffect(() => {
    const ul = $$(ul$);
    if (!ul) return;

    const rect = {
      width: 0,
      height: 0,
      x: mousePos.x,
      y: mousePos.y,
      left: mousePos.x,
      right: mousePos.x,
      top: mousePos.y,
      bottom: mousePos.y,
    };
    computePosition({ getBoundingClientRect: () => rect }, ul, {
      placement: 'right-start',
      middleware: [offset(5), flip(), shift()],
    }).then(({ x, y }) => Object.assign(menuPos, { x, y }));
  });

  return (
    <Transition
      el='ul'
      when={visible$}
      class='absolute top-0 left-0 min-w-40 text-sm p-1 rd-2 bg-black:75 backdrop-blur-2 grid'
      enterFromClass='opacity-0'
      enterActiveClass='transition-opacity'
      enterToClass='transition-transform'
      leaveActiveClass='transition-opacity'
      leaveToClass='opacity-0'
      style={{ transform: () => `translateX(${menuPos.x}px) translateY(${menuPos.y}px)` }}
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
