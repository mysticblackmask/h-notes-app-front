import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import classes from "./NoteItem.module.scss";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { SingleNoteDetails } from "./SingleNoteDetails";
import { MainButton } from "../ui/MainButton";
import { SecondaryButton } from "../ui/SecondaryButton";
import { Heading } from "../ui/Heading";
import { detailNote } from "../../apis/notes";

export const SingleNoteItem = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState();
  const { noteId } = useParams();
  const [newTitle, setNewTitle] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newFavourite, setNewFavourite] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState("");
  useEffect(() => {
    if (noteId) {
      detailNote(noteId).then((res) => {
        setNote(res.data);
        setAudioUrl(
          `http://localhost:8000/media/notes/audio/recording_cmG9dZi.wav`
        );
      });
    }
  }, [noteId]);
  const navigate = useNavigate();
  if (!note) {
    return <div>Loading</div>;
  }
  const { title, text, user, is_pinned, create_date, update_date, audio } =
    note || {};

  const theSameData =
    newTitle === title && newDescription === text && newFavourite === is_pinned;

  const allInputsIsValid = newTitle && newDescription && !theSameData;

  const submitNewNoteDataHandler = (e: React.FormEvent) => {
    e.preventDefault();

    if (!allInputsIsValid) {
      return;
    }

    const NoteObj = {
      id: noteId,
      title: newTitle,
      description: newDescription,
      favourite: newFavourite,
    };

    try {
      setIsEditing(false);
    } catch (err) {
      console.log(err);
    }
  };
  console.log(audio);
  return (
    <div className={classes.detailPageWrapper}>
      <div>
        <Heading paddingBottom={true} title="Manage your note" />
        <li
          className={`${classes.note} ${
            newFavourite ? classes.favouriteNote : undefined
          }`}
        >
          {isEditing ? (
            <form className={classes.form}>
              <div className={classes.header}>
                <label htmlFor="title">Title</label>
                <input
                  defaultValue={title}
                  onChange={(e) => setNewTitle(e.target.value)}
                  autoComplete="off"
                  value={newTitle}
                  id="title"
                  placeholder="New Title"
                />
              </div>
              <div className={classes.content}>
                <div className={classes.contentParams}>
                  <label htmlFor="description">Description</label>
                  <textarea
                    defaultValue={text}
                    placeholder="Description"
                    id="description"
                    onChange={(e) => setNewDescription(e.target.value)}
                    value={newDescription}
                  />
                </div>
              </div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={is_pinned}
                    value={newFavourite}
                    onChange={(e) => setNewFavourite(e.target.checked)}
                  />
                }
                label={newFavourite ? "Is favourite" : "Not favourite"}
              />
              <div>
                <p>Recorded Audio:</p>
                {audioUrl && (
                  <audio controls>
                    <source
                      src="http://127.0.0.1:8000/media/notes/audio/recording_cmG9dZi.wav"
                      type="audio/mpeg"
                    />
                  </audio>
                )}
              </div>
              <div className={classes.buttons}>
                <SecondaryButton
                  type="button"
                  onClick={() => setIsEditing(false)}
                  title="Cancel"
                />

                <button
                  type="submit"
                  className={classes.saveButton}
                  disabled={!allInputsIsValid}
                  onClick={submitNewNoteDataHandler}
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className={classes.header}>
                <div className={classes.headerTitle}>
                  <p>Title</p>
                  <h2>{title}</h2>
                </div>
              </div>
              <div className={classes.content}>
                <div className={classes.contentParams}>
                  <p>Description</p>
                  <h3>{text}</h3>
                </div>
              </div>
              <div>
                <p>Recorded Audio:</p>
                {audioUrl && (
                  <audio controls>
                    <source
                      src="http://127.0.0.1:8000/media/notes/audio/recording_cmG9dZi.wav"
                      type="audio/mpeg"
                    />
                  </audio>
                )}
              </div>
              <div className={classes.buttons}>
                <MainButton
                  title="Back"
                  disabled={isEditing}
                  onClick={() => navigate(-1)}
                />

                <SecondaryButton
                  onClick={() => setIsEditing((prev) => !prev)}
                  title="Edit"
                />
              </div>
            </>
          )}
        </li>
      </div>
      <SingleNoteDetails
        id={noteId}
        user={user}
        update={update_date}
        create={create_date}
      />
    </div>
  );
};
