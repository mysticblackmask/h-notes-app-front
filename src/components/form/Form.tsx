import React, { useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ErrorOutline } from "@mui/icons-material";
import { FormControlLabel, Checkbox, FormControl } from "@mui/material";
import { Heading } from "../ui/Heading";
import classes from "./Form.module.scss";
import formImg from "../../img/form.svg";
import { errorMessage, successMessage } from "../../constants/notify";
import { createNote } from "../../apis/notes";

type Inputs = {
  readonly title: string;
  readonly description: string;
};

export const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [isFavourite, setIsFavourite] = useState(true);

  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      successMessage("Microphone access granted.");

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setAudioBlob(audioBlob);
        audioChunksRef.current = [];
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error: any) {
      console.error("Error accessing microphone:", error);
      if (error.name === "NotAllowedError") {
        errorMessage(
          "Microphone access denied. Please enable it in your browser settings."
        );
      } else if (error.name === "NotFoundError") {
        errorMessage(
          "No microphone found. Please connect a microphone and try again."
        );
      } else {
        errorMessage("An unexpected error occurred. Please try again.");
      }
    }
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

  const onSubmitForm: SubmitHandler<Inputs> = async (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key as keyof Inputs] as string);
    });
    if (audioBlob) {
      formData.append("audio", audioBlob, "recording.wav");
    }

    try {
      createNote(formData)
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err.response));
    } catch (error) {
      console.error("Error during submission:", error);
      errorMessage("An unexpected error occurred. Please try again.");
    }
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
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setIsFavourite(e.target.checked)
                }
              />
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
