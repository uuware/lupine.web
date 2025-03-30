import { CssProps, RefProps } from 'lupine.js';

export enum ToggleSwitchSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export type ToggleSwitchUpdateProps = {
  setState?: (checked: boolean) => void;
};

export type ToggleSwitchProps = {
  size?: ToggleSwitchSize;
  checked?: boolean;
  onChanged?: (checked: boolean) => void;
  update?: ToggleSwitchUpdateProps;
};
export const ToggleSwitch = (props: ToggleSwitchProps) => {
  const refCheck: RefProps = {};
  if (props.update) {
    props.update.setState = (checked: boolean) => {
      refCheck.current.checked = checked;
    };
  }
  const css: CssProps = {
    // justifyContent: 'center',
    '.ts-switch': {
      position: 'relative',
      display: 'inline-block',
      width: '60px',
      height: '34px',
    },
    '&.small .ts-switch': {
      width: '40px',
      height: '24px',
    },
    '&.large .ts-switch': {
      width: '80px',
      height: '44px',
    },

    '.ts-switch .ts-checkbox': {
      opacity: 0,
      width: 0,
      height: 0,
    },

    '.ts-switch .ts-slider': {
      position: 'absolute',
      cursor: 'pointer',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: '#ccc',
      transition: '.4s',
      borderRadius: '34px',
    },

    '.ts-switch .ts-circle': {
      position: 'absolute',
      content: '',
      height: '26px',
      width: '26px',
      left: '4px',
      bottom: '4px',
      backgroundColor: 'white',
      transition: '.4s',
      borderRadius: '50%',
    },
    '&.small .ts-switch .ts-circle': {
      height: '20px',
      width: '20px',
      left: '3px',
      bottom: '2px',
    },
    '&.large .ts-switch .ts-circle': {
      height: '40px',
      width: '40px',
      left: '4px',
      bottom: '2px',
    },

    '.ts-checkbox:checked + .ts-slider': {
      backgroundColor: '#2196F3',
    },

    '.ts-checkbox:focus + .ts-slider': {
      boxShadow: '0 0 1px #2196F3',
    },

    '.ts-checkbox:checked + .ts-slider .ts-circle': {
      transform: 'translateX(26px)',
    },
    '&.small .ts-checkbox:checked + .ts-slider .ts-circle': {
      transform: 'translateX(14px)',
    },
    '&.large .ts-checkbox:checked + .ts-slider .ts-circle': {
      transform: 'translateX(31px)',
    },
  };
  const cssSize =
    props.size === ToggleSwitchSize.Small ? 'small' : props.size === ToggleSwitchSize.Large ? 'large' : '';
  return (
    <div css={css} class={`toggle-switch-box ${cssSize}`}>
      <label class='ts-switch'>
        <input
          ref={refCheck}
          class='ts-checkbox'
          type='checkbox'
          onChange={(e) => props.onChanged?.((e.target as any).checked)}
          checked={props.checked}
        />
        <span class='ts-slider'>
          <span class='ts-circle'></span>
        </span>
      </label>
    </div>
  );
};
