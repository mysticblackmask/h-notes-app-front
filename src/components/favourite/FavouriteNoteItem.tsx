import classes from "../notes/NoteItem.module.scss";
import { motion } from "framer-motion";
import { MainButton } from "../ui/MainButton";

type FavouriteNoteItemProps = {
  id: string;
  readonly favourite: boolean;
  readonly title: string;
  readonly description: string;
  notePinned: (id: string) => void;
};

export const FavouriteNoteItem = ({
  id,
  title,
  favourite,
  notePinned,
  description,
}: FavouriteNoteItemProps) => {
  return (
    <motion.li
      layout
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 30, opacity: 0 }}
      className={`${classes.note} ${
        favourite ? classes.favouriteNote : undefined
      }`}
    >
      {favourite && <div className={classes.favouriteWrapper} />}
      <div className={classes.header}>
        <h2>{title}</h2>
      </div>
      <div className={classes.content}>
        <p>{description}</p>
      </div>
      <div className={classes.buttons}>
        <MainButton
          onClick={() => notePinned(id)}
          type="button"
          title="Unfavourite"
        />
      </div>
    </motion.li>
  );
};
