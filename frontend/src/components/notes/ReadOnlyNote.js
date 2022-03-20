import Card from '../UI/Card';
import styles from './SharedNote.module.css';

const ReadOnlyNote = (props) => {
  return (
    <div className={styles.container}>
      <Card className={styles.note}>
        <h1>{props.title}</h1>
        <p>{props.content}</p>
      </Card>
    </div>
  );
};

export default ReadOnlyNote;
