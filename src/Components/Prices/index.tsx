import React from 'react';
import styles from './Price.module.scss';

export interface IProps {
  selectedIndex?: number;
  hasTrial: boolean;
  className?: string;
  country: string;
}

const Prices: React.FC<IProps> = props => {
  const {selectedIndex, hasTrial, className = "", country} = props;

  return (
    <div className={`${styles.Container} ${className}`}>

      {country !== 'Cyprus' ?
        <div className={styles.PriceCard + ' ' + (styles.PriceCardActive)}>
          <span className={styles.BigText}>14.99€</span>
          <div>
            <p className={styles.SmallText}>per month</p>
            {hasTrial && renderFree()}
          </div>
        </div> :
        <>
          <div className={styles.PriceCard + ' ' + (selectedIndex === 0 ? styles.PriceCardActive : '')}>
            <span className={styles.MediumText}>less then 50 tables</span>
            <span className={styles.BigText}>95€</span>
            <div>
              <p className={styles.SmallText}>per month</p>
              {hasTrial && renderFree()}
            </div>
          </div>

          <div className={styles.PriceCard + ' ' + (selectedIndex === 1 ? styles.PriceCardActive : '')}>
            <span className={styles.MediumText}>more then 50 tables</span>
            <span className={styles.BigText}>120€</span>
            <div>
              <p className={styles.SmallText}>per month</p>
              {hasTrial && renderFree()}
            </div>
          </div>
        </>
      }

    </div>
  );

  function renderFree() {
    return <p className={styles.MediumText}>1 month free</p>;
  }
}

export default Prices;