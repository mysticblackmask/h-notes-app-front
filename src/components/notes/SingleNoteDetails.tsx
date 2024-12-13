import classes from "./NoteItem.module.scss";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Heading } from "../ui/Heading";

type noteDetailsType = {
  id: string | undefined;
  update: string;
  create: string;
  user: string;
};

export const SingleNoteDetails = ({
  id,
  create,
  update,
  user,
}: noteDetailsType) => {
  return (
    <div className={classes.details}>
      <Heading paddingBottom={true} title="Details" />
      <div className={classes.noteDetailsWrapper}>
        <div className={classes.detailsControls}>
          <h3>Last edit</h3>
          {create === update ? (
            <p>This note hasn't been edited</p>
          ) : (
            <ul className={classes.historyList}>
              <li className={classes.historyItem}>
                {update} <ArrowForwardIcon className={classes.icon} />
              </li>
            </ul>
          )}
        </div>

        <div className={classes.detailsControls}>
          <h3>Date of create</h3>
          <p>{create}</p>
        </div>

        <div className={classes.detailsControls}>
          <h3>Author</h3>
          <p>{user}</p>
        </div>
      </div>
    </div>
  );
};
