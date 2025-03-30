import { mountComponents } from '../core';
import { CssProps, RefProps } from '../jsx';
import { stopPropagation } from '../lib';

export type FloatWindowReturnProps = { close: () => void; base: HTMLElement };
export type FloatWindowShowProps = {
  title: string;
  children: any;
  buttons?: string[];
  noMoving?: boolean;
  handleClicked: (index: number, sender: FloatWindowReturnProps) => void;
};

export class FloatWindow {
  static hostNode: HTMLElement;

  private static initialized = false;
  private static pressed = false;
  private static startX = 0;
  private static startY = 0;
  private static startTop = 0;
  private static startLeft = 0;

  static init() {
    window.addEventListener('mousemove', FloatWindow.onMousemove.bind(FloatWindow), false);
    document.documentElement.addEventListener('mouseup', FloatWindow.onMouseup.bind(FloatWindow), false);
  }

  static async show({
    title,
    children,
    buttons,
    noMoving = false,
    handleClicked,
  }: FloatWindowShowProps): Promise<FloatWindowReturnProps> {
    const cssContainer: CssProps = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) scale(0.1)',
      color: 'var(--primary-color)',
      backgroundColor: 'var(--cover-bg-color)', //'#fefefe',
      border: 'var(--primary-border)', //'1px solid #888',
      borderRadius: '6px',
      maxWidth: '90%',
      boxShadow: 'var(--cover-box-shadow)', //'#0000004c 0px 19px 38px, #00000038 0px 15px 12px',
      opacity: 0,
      zIndex: 'var(--layer-float-window)',
      '&.transition': {
        transition: 'all 0.3s',
      },
      '&.animation': {
        transform: 'translate(-50%, -50%) scale(1)',
        opacity: 1,
      },
      '&.animation-close': {
        transition: 'all 0.3s',
        transform: 'translate(-50%, -50%) scale(0)',
        opacity: 0,
      },
      '.fwin-title': {
        padding: '10px 15px 5px',
        borderBottom: 'var(--primary-border)', //'1px solid #e9ecef',
        '.fwin-close': {
          color: '#aaaaaa',
          float: 'right',
          fontSize: '26px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '-8px',
          marginRight: '-10px',
        },
        '.fwin-close:hover': {
          transition: 'all 300ms ease',
          color: '#555555',
        },
      },
      '.fwin-content': {
        padding: '15px',
      },
      '.fwin-bottom': {
        display: 'flex',
        padding: '5px 15px',
        borderTop: 'var(--primary-border)', //'1px solid #e9ecef',
        justifyContent: 'end',
        '>div': {
          // cursor: 'pointer',
          // border: '1px solid #aaaaaa',
          // paddingLeft: '10px',
          // borderRadius: '5px',
          // padding: '3px 15px',
          marginLeft: '5px',
        },
        // '>div:hover': {
        //   backgroundColor: '#eeeeee',
        //   transition: 'all 300ms ease',
        // },
      },
    };

    const ref: RefProps = {
      onLoad: async () => {
        ref.current.classList.add('transition', 'animation');
        setTimeout(() => {
          // don't need transition for moving
          ref.current.classList.remove('transition');
        }, 300);
      },
    };

    const handleClose = () => {
      ref.current.classList.add('transition');
      ref.current.classList.remove('animation');
      setTimeout(() => {
        base.remove();
      }, 300);
    };

    const base = document.createElement('div');
    const sender = { close: handleClose, base };

    const onMousedown = (event: any) => {
      if (!this.initialized) {
        this.initialized = true;
        this.init();
      }

      FloatWindow.hostNode = document.querySelector(`.fwin-box[${ref.id}]`)!;
      !noMoving && FloatWindow.onMousedown.bind(FloatWindow)(event);
    };

    const newButtons = !buttons || buttons.length === 0 ? ['OK', 'Cancel'] : buttons;
    const onClickButtons = (index: number) => {
      handleClicked(index, sender);
    };
    const component = (
      <div ref={ref} class='fwin-box' css={cssContainer} onMouseDown={onMousedown}>
        <div class='fwin-title'>
          {title}
          <span class='fwin-close' onClick={handleClose}>
            ×
          </span>
        </div>
        <div class='fwin-content'>{children}</div>
        <div class='fwin-bottom'>
          {newButtons.map((i, index) => (
            <div
              class='button-base button-s'
              onClick={() => {
                onClickButtons(index);
              }}
            >
              {i}
            </div>
          ))}
        </div>
      </div>
    );
    base.style.position = 'fixed';
    document.body.appendChild(base);
    await mountComponents(base, <div>{component}</div>);

    return sender;
  }

  static onMousedown(event: any) {
    if (event.buttons !== 1 || event.button !== 0) return;
    if (event.srcElement.className !== 'fwin-title') return;

    this.pressed = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    const nodeStyle = document.defaultView!.getComputedStyle(this.hostNode);
    this.startTop = parseInt(nodeStyle['top'], 10);
    this.startLeft = parseInt(nodeStyle['left'], 10);
  }

  static onMousemove(event: any) {
    if (!this.pressed || event.buttons !== 1 || event.button !== 0) {
      return;
    }

    // prevent text/element selection when drag
    stopPropagation(event);
    if (
      event.clientX < 0 ||
      event.clientY < 0 ||
      event.clientX > window.innerWidth ||
      event.clientY > window.innerHeight
    ) {
      return;
    }

    let movedX = this.startLeft + (event.clientX - this.startX);
    let movedY = this.startTop + (event.clientY - this.startY);
    if (movedY <= 0) movedY = 0;
    if (movedX <= 0) movedX = 0;

    this.hostNode.style.top = movedY + 'px';
    this.hostNode.style.left = movedX + 'px';
  }

  static onMouseup() {
    if (this.pressed) this.pressed = false;
  }
}
