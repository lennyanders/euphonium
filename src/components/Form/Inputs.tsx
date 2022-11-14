import { $, $$, Observable, useEffect } from 'voby';

type Props = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> &
  (
    | { type: 'hidden' | 'submit' }
    | { type: 'checkbox' | 'radio'; model: Observable<boolean> }
    | {
        type: 'email' | 'month' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url' | 'week';
        model: Observable<string>;
      }
    | { type: 'number' | 'range'; model: Observable<number> }
  );

export const Input = (props: Props) => {
  const ref$ = $<HTMLInputElement>();
  if (props.type === 'checkbox' || props.type === 'radio') {
    useEffect(() => {
      const el = $$(ref$);
      if (el) el.checked = props.model();
    });
    props.onChange = (event) => props.model((event.target as HTMLInputElement).checked);
  } else if (
    props.type === 'email' ||
    props.type === 'month' ||
    props.type === 'password' ||
    props.type === 'search' ||
    props.type === 'tel' ||
    props.type === 'text' ||
    props.type === 'time' ||
    props.type === 'url' ||
    props.type === 'week'
  ) {
    useEffect(() => {
      const el = $$(ref$);
      if (el) el.value = props.model();
    });
    props.onInput = (event) => props.model((event.target as HTMLInputElement).value);
  } else if (props.type === 'number' || props.type === 'range') {
    useEffect(() => {
      const el = $$(ref$);
      if (el) el.value = props.model().toString();
    });
    props.onInput = (event) => props.model(+(event.target as HTMLInputElement).value);
  }
  return <input ref={ref$} {...props} />;
};
