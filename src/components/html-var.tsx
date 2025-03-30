import { mountComponents } from '../core/mount-components';
import { RefProps, VNode } from '../jsx';

export const HtmlVar = (initial?: string | VNode<any>) => {
  const ref: RefProps = { id: '' };
  const FragmentRef = (props: any) => {
    return <>{props.children}</>;
  };

  return {
    set value(value: string | VNode<any>) {
      this.waitUpdate(value);
    },
    // for any cases that needs to wait for the update to complete
    waitUpdate: async (value: string | VNode<any>) => {
      if (typeof value === 'object' && value.type && value.props) {
        await mountComponents(ref.current, value);
      } else {
        ref.current.innerHTML = value;
      }
    },
    get value() {
      return ref.current.innerHTML;
    },
    get ref() {
      return ref;
    },
    // _fragment_ref is a special id to add ref to a fragment and it is processed in mount-components
    get node() {
      return <FragmentRef _fragment_ref={ref}>{initial}</FragmentRef>;
    },
  };
};
