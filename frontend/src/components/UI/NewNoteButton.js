import styles from './NewNoteButton.module.css';

const ActionBar = (props) => {
  const clickHandler = () => {
    props.onClick();
  };

  return (
    <button
      id='plus'
      className={`${styles.new} ${
        props.active ? styles.inactive : styles.active
      }`}
      onClick={clickHandler}
    >
      {props.active ? '×' : '+'}
    </button>
  );
};

export default ActionBar;
