import React, { useEffect, useState } from "react";
import { TrashItem } from "./TrashItem";
import classes from "../notes/Notes.module.scss";
import empty from "../../img/trash.svg";
import { AnimatePresence } from "framer-motion";
import { MainButton } from "../ui/MainButton";
import { Link } from "react-router-dom";
import { Heading } from "../ui/Heading";
import {
  readNotes,
  deleteNotes,
  trashedNote,
  deleteNote,
} from "../../apis/notes";

export const Trash = () => {
  const [notes, setNotes] = useState({ results: [], total_count: 0 });
  const ReadNotes = () => {
    readNotes(0, true)
      .then((res) => {
        setNotes(res.data);
      })
      .catch((err) => console.log(err.response.data));
  };

  useEffect(() => {
    ReadNotes();
  }, []);

  const clearTrash = () => {
    deleteNotes()
      .then((res) => ReadNotes())
      .catch((err) => console.log(err.response));
  };

  const undoNoteHandler = (id: string) => {
    trashedNote(id, false).then((res) => {
      ReadNotes();
    });
  };

  const noteDelete = (id: string) => {
    deleteNote(id)
      .then((res) => ReadNotes())
      .catch((err) => console.log(err.response));
  };

  const emptyContent = (
    <div className={classes.emptyWrapper}>
      <img src={empty} alt="empty" />
      <h3 className={classes.empty}>Trash is empty</h3>
      <div className={classes.buttons}>
        {notes.results.length ? (
          <Link to="/trash">
            <MainButton title="Check trash" />
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
        <Heading title="Trash">
          <span className={classes.trash}>{notes.total_count}</span>
        </Heading>
        {notes.results.length ? (
          <div className={classes.buttons}>
            <MainButton title="Delete all" onClick={clearTrash} />
          </div>
        ) : null}
      </div>
      <ul className={classes.list}>
        <AnimatePresence>
          {notes.results.map((note: any, index: number) => {
            return (
              <TrashItem
                key={index}
                id={note.noteid}
                title={note.title}
                description={note.text}
                noteDelete={noteDelete}
                undoNoteHandler={undoNoteHandler}
              />
            );
          })}
        </AnimatePresence>
      </ul>
      {!notes.results.length && emptyContent}
    </div>
  );
};
