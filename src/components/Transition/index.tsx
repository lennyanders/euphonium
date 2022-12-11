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

export const Transition = <T extends any, U extends keyof JSX.IntrinsicElements>({
  when,
  enterClass,
  leaveClass,
  el,
  children,
  class: css,
  ref,
  ...props
}: JSX.IntrinsicElements[U] & {
  when: FunctionMaybe<T>;
  enterClass?: JSX.Class;
  leaveClass?: JSX.Class;
  el?: U;
  children?: JSX.Child;
}) => {
  const show$ = $(!!untrack(when));
  const el$ = $() as Observable<JSX.IntrinsicElementsMap[U]>;

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
        component={el || 'div'}
        props={{
          ...props,
          ref: [el$, ref],
          class: [css, () => $$(showEnterClass$) && enterClass, () => !$$(when) && leaveClass],
        }}
        children={children}
      />
    </If>
  );
};
