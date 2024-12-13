import React, { useState, useContext, useId, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { ErrorOutline } from "@mui/icons-material";
import { FormControlLabel, Checkbox, FormControl } from "@mui/material";
import { Heading } from "../ui/Heading";
import classes from "./Form.module.scss";
import formImg from "../../img/form.svg";
import { Note } from "../../types/NoteType";
import { getFullDate } from "../../constants/fullDate";
import { NotesContext } from "../../context/NoteContext";
import { EditHistory } from "../../types/EditHistoryType";

type Inputs = {
  readonly title: string;
  readonly description: string;
  readonly category: string;
};

export const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [isFavourite, setIsFavourite] = useState(true);
  const [editHistory] = useState<EditHistory[]>([]);
  const { addNote } = useContext(NotesContext);
  const navigate = useNavigate();
  const id = useId();
  const { fullDate } = getFullDate();

  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      setAudioBlob(audioBlob);
      audioChunksRef.current = [];
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const remakeRecording = () => {
    if (recording) {
      stopRecording();
    }
    // Reset state for a new recording
    setAudioBlob(null);
    audioChunksRef.current = [];
  };

  const onSubmitForm: SubmitHandler<Inputs> = (data) => {
    const NoteObj: Note = {
      id: id,
      author: "Mateusz",
      title: data.title,
      category: data.category,
      description: data.description,
      favourite: isFavourite,
      date: fullDate,
      descLength: data.description.length,
      editHistory: editHistory,
    };

    addNote(NoteObj);
    navigate("/notes");
  };

  return (
    <div className={classes.formWrapper}>
      <form className={classes.form}>
        <Heading paddingBottom={true} title="Create new note" />
        <div className={classes.formControl}>
          <label htmlFor="title">Title</label>
          <input
            placeholder="Title"
            id="title"
            type="text"
            {...register("title", {
              required: true,
              minLength: 3,
              maxLength: 20,
            })}
          />
          {errors.title && (
            <span className={classes.errorMessage}>
              <ErrorOutline />
              Title is required
            </span>
          )}
        </div>

        <div className={classes.formControl}>
          <label htmlFor="description">Description</label>
          <textarea
            placeholder="Description"
            id="description"
            {...register("description", {
              required: true,
              minLength: 10,
              maxLength: 1000,
            })}
          />
          {errors.description && (
            <span className={classes.errorMessage}>
              <ErrorOutline /> Description is required
            </span>
          )}
        </div>

        <div className={classes.formControl}>
          <label htmlFor="category">Category</label>
          <select {...register("category")} id="category">
            <option value={"Shopping"}>Shopping</option>
            <option value={"Traveling"}>Traveling</option>
            <option value={"Business"}>Business</option>
            <option value={"Cooking"}>Cooking</option>
          </select>
        </div>

        <div className={classes.formControl}>
          <FormControlLabel
            control={
              <>
                <Checkbox
                  defaultChecked
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setIsFavourite(e.target.checked)
                  }
                />
              </>
            }
            label={isFavourite ? "Is favourite" : "Not favourite"}
          />
          <FormControl>
            <div className={classes.buttonGroup}>
              <button
                className={!recording ? classes.start : classes.end}
                onClick={(event) => {
                  event.preventDefault();
                  recording ? stopRecording() : startRecording();
                }}
              >
                {recording ? "Stop Recording" : "Start Recording"}
              </button>
              <button
                className={classes.start}
                onClick={(event) => {
                  event.preventDefault();
                  remakeRecording();
                }}
                disabled={!audioBlob}
              >
                Remake Recording
              </button>
            </div>
          </FormControl>
        </div>
        <div className={classes.formControl}>
          {audioBlob && (
            <audio controls>
              <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
            </audio>
          )}
        </div>

        <button type="submit" onClick={handleSubmit(onSubmitForm)}>
          Create new note
        </button>
      </form>

      <img src={formImg} alt="form" />
    </div>
  );
};
