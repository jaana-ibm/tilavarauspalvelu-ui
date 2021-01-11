import { Button } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Modal.module.scss';

type Props = {
  handleClose: (ok: boolean) => void;
  show: boolean;
  children: React.ReactNode;
};

const Modal = ({ handleClose, show, children }: Props): JSX.Element | null => {
  const { t } = useTranslation();

  if (!show) {
    return null;
  }

  return (
    <>
      <div
        role="none"
        className={`${styles.overlay}`}
        onClick={() => handleClose(false)}
        onKeyDown={() => handleClose(false)}
      />
      <div className={`${styles.modal}`}>
        <section className={styles.mainContainer}>{children}</section>
        <div className={styles.buttonContainer}>
          <Button onClick={() => handleClose(false)}>
            {t('common.close')}
          </Button>
          <Button onClick={() => handleClose(true)}>{t('common.ok')}</Button>
        </div>
      </div>
    </>
  );
};

export default Modal;