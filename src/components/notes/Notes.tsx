import React, { useContext, useState, useEffect } from "react";
import { NoteItem } from "./NoteItem";
import { AnimatePresence } from "framer-motion";
import classes from "./Notes.module.scss";
import empty from "../../img/empty.svg";
import { NotesContext } from "../../context/NoteContext";
import { NotePagination } from "../pagination/Pagination";
import { Link } from "react-router-dom";
import { MainButton } from "../ui/MainButton";
import { Heading } from "../ui/Heading";
import { SecondaryButton } from "../ui/SecondaryButton";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { readNotes } from "../../apis/notes";
import { errorMessage } from "../../constants/notify";

interface noteType {
  title: string;
  text: string;
  noteid: number;
  is_pinned: boolean;
  is_trashed: boolean;
  audio: any;
  user_surname: string;
  user: string;
  update_date: string;
  create_date: string;
}

export interface noteDataType {
  results: noteType[];
  total_count: number;
}

export const Notes = () => {
  // const { notes, trashNotes, removeAll } = useContext(NotesContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [notesPerPage] = useState(4);
  const [notes, setNotes] = useState<noteDataType>({
    results: [],
    total_count: 0,
  });

  const paginate = (event: React.ChangeEvent<unknown>, pageNumber: number) =>
    setCurrentPage(pageNumber);
  useEffect(() => {
    console.log(currentPage);
    readNotes(currentPage, false)
      .then((res) => {
        console.log(res);
        setNotes({
          results: res.data.results,
          total_count: res.data.total_count,
        });
      })
      .catch((err) => errorMessage(err.response.data));
  }, [currentPage]);
  const emptyContent = (
    <div className={classes.emptyWrapper}>
      <img src={empty} alt="empty" />
      <h3 className={classes.empty}>Note list is empty</h3>

      <div className={classes.buttons}>
        <Link to="/create">
          <MainButton title="Create new" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className={classes.notesModules}>
      <div className={classes.header}>
        <Heading title="Notes">
          <span className={classes.notesLength}>{notes.total_count}</span>
        </Heading>
      </div>

      <AnimatePresence>
        <ul className={classes.list}>
          {notes.results.map((note: noteType) => {
            return (
              <NoteItem
                id={note.noteid}
                key={note.noteid}
                title={note.title}
                text={note.text}
                favourite={note.is_pinned}
              />
            );
          })}
        </ul>
      </AnimatePresence>

      {!notes.total_count && emptyContent}
      {notes.total_count && (
        <NotePagination
          notesPerPage={notesPerPage}
          totalNotes={notes.total_count}
          paginate={paginate}
        />
      )}
    </div>
  );
};
