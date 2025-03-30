import { mountComponents } from '../core';
import { RefProps } from '../jsx';

// const modalData = { layerCount: 0 };
export const showModal = async ({
  title,
  children,
  contentMaxHeight,
  buttons,
  handleClicked,
}: {
  title: string;
  children: any;
  contentMaxHeight?: string;
  buttons?: string[];
  handleClicked: (index: number, closeHandler: () => void) => void;
}) => {
  const close = () => {
    const modal = document.querySelector('.modal-body.animation');
    if (modal) {
      modal.classList.remove('animation');
      setTimeout(() => {
        base.remove();
      }, 300);
    } else {
      base.remove();
    }
  };
  const update = (index: number) => {
    handleClicked(index, close);
  };

  const newButtons = !buttons || buttons.length === 0 ? ['OK', 'Cancel'] : buttons;
  // const layer = modalData.layerCount++;
  const base = document.createElement('div');
  base.style.position = 'fixed';
  document.body.appendChild(base);
  await mountComponents(
    base,
    <Modal
      title={title}
      handleClose={close}
      buttons={newButtons}
      handleClicked={update}
      contentMaxHeight={contentMaxHeight}
    >
      {children}
    </Modal>
  );

  return { close };
};

export type ModalProps = {
  title: string;
  buttons: string[];
  children: any;
  contentMaxHeight?: string;
  handleClose: () => void;
  handleClicked: (index: number) => void;
  closeWhenClickOutside?: boolean;
};
// because it's over a mask, so modal can use primary colors
export const Modal = ({
  title,
  buttons,
  children,
  contentMaxHeight,
  handleClose,
  handleClicked,
  closeWhenClickOutside,
}: ModalProps) => {
  const cssContainer: any = {
    display: 'flex',
    position: 'fixed',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    zIndex: 'var(--layer-modal)',
    color: 'var(--primary-color)',
    backgroundColor: 'var(--cover-mask-bg-color)',
    '> .modal-body': {
      backgroundColor: 'var(--cover-bg-color)', //'#fefefe',
      margin: 'auto',
      transition: 'all 0.3s',
      transform: 'scale(0.1)',
      opacity: 0,
      border: 'var(--primary-border)', //'1px solid #888',
      borderRadius: '6px',
      minWidth: '50%',
      maxWidth: '80%',
      boxShadow: 'var(--cover-box-shadow)', //'#0000004c 0px 19px 38px, #00000038 0px 15px 12px',
      '.modal-title': {
        padding: '10px 15px 5px',
        borderBottom: 'var(--primary-border)',
        '.modal-close': {
          color: '#aaaaaa',
          float: 'right',
          fontSize: '26px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '-7px',
          marginRight: '-8px',
        },
        '.modal-close:hover': {
          transition: 'all 300ms ease',
          color: '#555555',
        },
      },
      '.modal-content': {
        padding: '15px',
        // maxHeight: contentMaxHeight,
        maxHeight: contentMaxHeight ? `min(${contentMaxHeight}, calc(100% - 100px))` : 'calc(100% - 100px)',
        overflowY: 'auto',
        // height: 'calc(100% - 200px)',
      },
      '.modal-bottom': {
        display: 'flex',
        padding: '5px 15px',
        borderTop: 'var(--primary-border)',
        justifyContent: 'end',
        '>button': {
          // cursor: 'pointer',
          // border: 'var(--primary-border)',
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
    },
    '> .modal-body.animation': {
      transform: 'scale(1)',
      opacity: 1,
    },
  };
  const onClickContainer = (event: any) => {
    if (closeWhenClickOutside !== false && event.target.className === 'modal-box') {
      handleClose();
    }
  };
  const onClickButtons = (index: number) => {
    handleClicked(index);
  };
  let ref: RefProps = {
    id: '',
    onLoad: async () => {
      ref.$('> .modal-body').classList.add('animation');
    },
  };
  return (
    <div ref={ref} css={cssContainer} class='modal-box' onClick={onClickContainer}>
      <div class='modal-body'>
        <div class='modal-title'>
          {title}
          <span class='modal-close' onClick={handleClose}>
            ×
          </span>
        </div>
        <div class='modal-content'>{children}</div>
        <div class='modal-bottom'>
          {buttons.map((i, index) => (
            <button
              class='button-base button-s'
              onClick={() => {
                onClickButtons(index);
              }}
            >
              {i}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
