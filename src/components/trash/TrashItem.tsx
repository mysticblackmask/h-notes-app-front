import classes from "../notes/NoteItem.module.scss";
import { motion } from "framer-motion";
import { MainButton } from "../ui/MainButton";
import { SecondaryButton } from "../ui/SecondaryButton";

type TrashItemProps = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  undoNoteHandler: (id: string) => void;
  noteDelete: (id: string) => void;
};

export const TrashItem = ({
  id,
  title,
  description,
  undoNoteHandler,
  noteDelete,
}: TrashItemProps) => {
  return (
    <motion.li
      layout
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 30, opacity: 0 }}
      className={classes.note}
    >
      <div className={classes.header}>
        <h2>{title}</h2>
      </div>
      <div className={classes.content}>
        <p>{description}</p>
      </div>
      <div className={classes.buttons}>
        <MainButton
          onClick={() => noteDelete(id)}
          type="button"
          title="Delete"
        />

        <SecondaryButton
          onClick={() => undoNoteHandler(id)}
          type="button"
          title="Undo"
        />
      </div>
    </motion.li>
  );
};
