import API from "./api";

export const readNotes = (page: number, is_trashed: boolean) => {
  return API.post<any>("/notesapp/notes/", {
    page,
    is_trashed,
  });
};
