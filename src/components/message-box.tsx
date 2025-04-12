import { FloatWindow, FloatWindowCloseProps, FloatWindowShowProps } from './float-window';

export enum MessageBoxButtonProps {
  YesNo = 'yesno',
  OkCancel = 'okcancel',
  Ok = 'ok',
}
export type MessageBoxProps = FloatWindowShowProps & {
  buttonType: MessageBoxButtonProps;
};

export const createSelectBox = (title: string, options: string[], onOptionChanged: (option: string) => void) => {
  return (
    <div>
      <div>{title}</div>
      <div>
        <select class='input-base' onChange={(e: any) => onOptionChanged(e?.target?.value)}>
          {options.map((option) => (
            <option>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export class MessageBox {
  static async show({
    title,
    children,
    contentMaxHeight,
    contentMinWidth,
    buttonType = MessageBoxButtonProps.OkCancel,
    noMoving = false,
    noModal = false,
    closeEvent,
    handleClicked,
    closeWhenClickOutside = false,
  }: MessageBoxProps): Promise<FloatWindowCloseProps> {
    const buttons =
      buttonType === MessageBoxButtonProps.OkCancel
        ? ['Cancel', 'OK']
        : buttonType === MessageBoxButtonProps.YesNo
        ? ['Yes', 'No']
        : ['OK'];
    return FloatWindow.show({
      title,
      children,
      contentMaxHeight,
      contentMinWidth,
      buttons,
      noMoving,
      noModal,
      closeEvent,
      handleClicked,
      closeWhenClickOutside,
    });
  }
}
