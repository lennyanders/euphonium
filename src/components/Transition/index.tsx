import {
  $,
  $$,
  Dynamic,
  FunctionMaybe,
  If,
  Observable,
  untrack,
  useAnimationFrame,
  useEffect,
  useEventListener,
} from 'voby';

export const Transition = <T extends any>({
  when,
  class: css,
  enterClass,
  leaveClass,
  el = 'div',
  children,
}: {
  when: FunctionMaybe<T>;
  class?: JSX.Class;
  enterClass?: JSX.Class;
  leaveClass?: JSX.Class;
  el?: keyof JSX.IntrinsicElementsMap;
  children?: JSX.Child;
}) => {
  const show$ = $(!!untrack(when));
  const el$ = $() as Observable<JSX.IntrinsicElementsMap[typeof el]>;

  useEffect(() => {
    if ($$(when)) show$(true);
  });

  const showEnterClass$ = $(untrack(show$));
  if (typeof enterClass !== 'undefined') {
    useEffect(() => {
      if (!$$(when)) return;

      showEnterClass$(true);
      useAnimationFrame(() => showEnterClass$(false));
    });
  }

  if (typeof leaveClass !== 'undefined') {
    useEffect(() => {
      if ($$(el$) && !$$(when)) useEventListener(el$, 'transitionend', () => show$(false));
    });
  } else {
    useEffect(() => {
      if (!$$(when)) show$(false);
    });
  }

  return (
    <If when={show$}>
      <Dynamic
        component={el}
        props={{
          ref: el$,
          class: [css, () => $$(showEnterClass$) && enterClass, () => !$$(when) && leaveClass],
        }}
      >
        {children}
      </Dynamic>
    </If>
  );
};
