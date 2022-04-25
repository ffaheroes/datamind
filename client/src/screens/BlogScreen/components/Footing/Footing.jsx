import React from 'react';
import styles from './Footing.module.scss';
import { LogoGithub,LogoMedium,LogoLinkedin } from 'react-ionicons'

const Footing = () => (
  <div className={styles.footing}>
    <div className={styles.inner}>
      <LogoLinkedin
        color={'#00000'} 
        height="35px"
        width="35px"
      />
      <LogoMedium
        color={'#00000'} 
        height="35px"
        width="35px"
      />
      <LogoGithub
        color={'#00000'}
        height="35px"
        width="35px"
      />
    </div>
</div>
);

export default Footing;
