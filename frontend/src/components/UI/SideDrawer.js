import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import Backdrop from './Backdrop';

import './SideDrawer.css';

const SideDrawer = (props) => {
  const content = (
    <>
      {props.show && <Backdrop className='backdrop' onClick={props.onClick} />}
      <CSSTransition
        in={props.show}
        timeout={500}
        classNames='slide-in-left'
        mountOnEnter
        unmountOnExit
      >
        <aside className='side-drawer' onClick={props.onClick}>
          {props.children}
        </aside>
      </CSSTransition>
    </>
  );

  return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
};

export default SideDrawer;
