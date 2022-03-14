import styles from './NewNoteButton.module.css';

const ActionBar = (props) => {
  return (
    <button
      className={styles.new}
      onClick={props.onClick}
      style={{
        backgroundColor: props.active ? 'red' : 'dodgerblue',
      }}
    >
      {props.active ? '−' : '+'}
    </button>
  );
};

export default ActionBar;
