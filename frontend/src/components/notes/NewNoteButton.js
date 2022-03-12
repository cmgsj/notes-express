import styles from './NewNoteButton.module.css';

const ActionBar = (props) => {
  return (
    <button
      className={styles.new}
      onClick={props.onClick}
      style={{
        backgroundColor: props.showActive ? 'red' : 'dodgerblue',
      }}
    >
      {props.showActive ? '−' : '+'}
    </button>
  );
};

export default ActionBar;
