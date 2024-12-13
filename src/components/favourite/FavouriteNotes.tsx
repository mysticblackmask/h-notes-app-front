import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import classes from "../notes/Notes.module.scss";
import { Link } from "react-router-dom";
import { MainButton } from "../ui/MainButton";
import empty from "../../img/favourite.svg";
import { FavouriteNoteItem } from "./FavouriteNoteItem";
import { Heading } from "../ui/Heading";
import { pinNote, pinNotes } from "../../apis/notes";

export const FavouriteNotes = () => {
  const [notes, setNotes] = useState({ results: [], total_count: 0 });

  const readNotes = () => {
    pinNotes(0, true)
      .then((res) => setNotes(res.data))
      .catch((err) => console.log(err.response));
  };

  useEffect(() => {
    readNotes();
  }, []);

  const notePinned = (id: string) => {
    pinNote(id, false)
      .then((res) => readNotes())
      .catch((err) => console.log(err.response));
  };

  const emptyContent = (
    <div className={classes.emptyWrapper}>
      <img src={empty} alt="empty" />
      <h3 className={classes.empty}>Trash is empty</h3>

      <div className={classes.buttons}>
        {notes.results.length ? (
          <Link to="/notes">
            <MainButton title="Check notes" />
          </Link>
        ) : null}
        <Link to="/create">
          <MainButton title="Create new" />
        </Link>
      </div>
    </div>
  );
  return (
    <div className={classes.notesModules}>
      <div className={classes.header}>
        <Heading title="Favourite notes">
          <span className={classes.favorite}>{notes.results.length}</span>
        </Heading>
      </div>

      <ul className={classes.list}>
        <AnimatePresence>
          {notes.results.map((note: any, index: number) => {
            return (
              <FavouriteNoteItem
                key={index}
                id={note.noteid}
                title={note.title}
                description={note.text}
                notePinned={notePinned}
                favourite={note.is_pinned}
              />
            );
          })}
        </AnimatePresence>
      </ul>

      {!notes.results.length && emptyContent}
    </div>
  );
};
