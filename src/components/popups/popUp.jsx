// src/components/Popup.jsx
import React from 'react';
import styles from './popUp.module.css';

const popUp = ({ message, onClose }) => {
const lines = message.split('\n');
  return (
    <div className={styles.popupoverlay}>
      <div className={styles.popup}>
      {lines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default popUp;
