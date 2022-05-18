import type { Props } from '../../utils';
import { progressClass, progressHandleClass, progressInputClass } from './index.css';

export const Progress = ({
  class: className,
  ...props
}: Props<HTMLInputElement, { value: number; max: number; step?: number }>) => {
  className = `${progressClass}${className ? ` ${className}` : ''}`;
  return (
    <div class={className} style={{ '--progress': `${(props.value / props.max) * 100}%` }}>
      <div class={progressHandleClass}></div>
      {/* <input class={progressInputClass} type={() => 'range'} min='0' {...props} /> */}
    </div>
  );
};
