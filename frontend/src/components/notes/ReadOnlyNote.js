import styles from './Note.module.css';

const ReadOnlyNote = (props) => {
  return (
    <div className={styles.note}>
      <h1>{props.title}</h1>
      <p>{props.content}</p>
    </div>
  );
};

export default ReadOnlyNote;
