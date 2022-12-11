import {
  $,
  $$,
  batch,
  Dynamic,
  FunctionMaybe,
  If,
  Observable,
  useAnimationFrame,
  useEffect,
  useEventListener,
} from 'voby';
import { Disposer } from 'voby/dist/types';

import { useDebouncedMemo } from '../../utils';

export const Transition = <T extends any, U extends keyof JSX.IntrinsicElements>({
  when,
  enterFromClass,
  enterActiveClass,
  enterToClass,
  leaveFromClass,
  leaveActiveClass,
  leaveToClass,
  el,
  children,
  class: css,
  ref,
  ...props
}: JSX.IntrinsicElements[U] & {
  when: FunctionMaybe<T>;
  enterFromClass?: JSX.Class;
  enterActiveClass?: JSX.Class;
  enterToClass?: JSX.Class;
  leaveFromClass?: JSX.Class;
  leaveActiveClass?: JSX.Class;
  leaveToClass?: JSX.Class;
  el?: U;
  children?: JSX.Child;
}) => {
  const when$ = useDebouncedMemo(() => $$(when));
  const show$ = $(false);
  const el$ = $() as Observable<JSX.IntrinsicElementsMap[U]>;

  const enterFromClass$ = $<JSX.Class>();
  const enterActiveClass$ = $<JSX.Class>();
  const enterToClass$ = $<JSX.Class>();
  useEffect(() => {
    if (!$$(when$)) return;

    let transitionDisposer: Disposer;
    batch(() => {
      show$(true);
      enterFromClass$(enterFromClass);
      enterActiveClass$(enterActiveClass);
    });
    useAnimationFrame(() => {
      batch(() => {
        enterFromClass$(undefined);
        enterToClass$(enterToClass);
      });
      transitionDisposer = useEventListener(el$, 'transitionend', () => {
        transitionDisposer();
        enterActiveClass$(undefined);
      });
    });

    return () => {
      transitionDisposer?.();
      enterFromClass$(undefined);
      enterActiveClass$(undefined);
      enterToClass$(undefined);
    };
  });

  const leaveFromClass$ = $<JSX.Class>();
  const leaveActiveClass$ = $<JSX.Class>();
  const leaveToClass$ = $<JSX.Class>();
  useEffect(() => {
    if ($$(when$) || !$$(el$)) return;

    if (!leaveFromClass && !leaveActiveClass && !leaveToClass) {
      show$(false);
      return;
    }

    let transitionDisposer: Disposer;
    batch(() => {
      leaveFromClass$(leaveFromClass);
      leaveActiveClass$(leaveActiveClass);
    });
    useAnimationFrame(() => {
      batch(() => {
        leaveFromClass$(undefined);
        leaveToClass$(leaveToClass);
      });
      transitionDisposer = useEventListener(el$, 'transitionend', () => {
        transitionDisposer();
        batch(() => {
          show$(false);
          leaveToClass$(undefined);
          leaveActiveClass$(undefined);
        });
      });
    });

    return () => {
      transitionDisposer?.();
      leaveFromClass$(undefined);
      leaveActiveClass$(undefined);
      leaveToClass$(undefined);
    };
  });

  return (
    <If when={show$}>
      <Dynamic
        component={el || 'div'}
        props={{
          ...props,
          ref: [el$, ref],
          class: [
            css,
            enterFromClass$,
            enterActiveClass$,
            enterToClass$,
            leaveFromClass$,
            leaveActiveClass$,
            leaveToClass$,
          ],
        }}
        children={children}
      />
    </If>
  );
};
