import React, { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import type { Node } from 'react';
import Modal from 'react-polymorph/lib/components/Modal';
import Button from 'react-polymorph/lib/components/Button';
import SimpleButtonSkin from 'react-polymorph/lib/skins/simple/raw/ButtonSkin';
import SimpleModalSkin from '../wallet/skins/ModalSkin';
import styles from './Dialog.scss';

type Props = {
  title?: string,
  children?: Node,
  actions?: Node,
  closeButton?: Node,
  backButton?: Node,
  className?: string,
  onClose?: Function,
  closeOnOverlayClick?: boolean,
  shouldCloseOnEsc?: boolean,
  primaryButtonAutoFocus?: boolean,
};

export default class Dialog extends Component<Props> {

  render() {
    const {
      title,
      children,
      actions,
      closeOnOverlayClick,
      shouldCloseOnEsc,
      onClose,
      className,
      closeButton,
      backButton,
      primaryButtonAutoFocus,
    } = this.props;

    return (
      <Modal
        isOpen
        triggerCloseOnOverlayClick={closeOnOverlayClick}
        shouldCloseOnEsc={shouldCloseOnEsc}
        onClose={onClose}
        skin={<SimpleModalSkin />}
      >

        <div className={classnames([styles.dialogWrapper, className])}>
          {title &&
            <div className={styles.title}>
              <h1>{title}</h1>
            </div>
          }

          {children &&
            <div className={styles.content}>
              {children}
            </div>
          }

          {actions &&
            <div className={styles.actions}>
              {_.map(actions, (action, key) => {
                const buttonClasses = classnames([
                  action.className ? action.className : null,
                  action.primary ? 'primary' : 'flat',
                ]);
                return (
                  <Button
                    key={key}
                    className={buttonClasses}
                    label={action.label}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    skin={<SimpleButtonSkin />}
                    autoFocus={action.primary ? primaryButtonAutoFocus : false}
                  />
                );
              })}
            </div>
          }

          {closeButton ? React.cloneElement(closeButton, { onClose }) : null}
          {backButton}

        </div>
      </Modal>
    );
  }
}
