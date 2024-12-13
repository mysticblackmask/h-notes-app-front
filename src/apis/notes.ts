import API from "./api";

export const readNotes = (page: number, is_trashed: boolean) => {
  return API.post<any>("/notesapp/notes/", {
    page,
    is_trashed,
  });
};

export const pinNotes = (page: number, is_pinned: boolean) => {
  return API.post<any>("/notesapp/notes/", {
    page,
    is_pinned,
  });
};

export const detailNote = (id: string) => {
  return API.get<any>(`/notesapp/notes/${id}/`);
};

export const trashedNote = (id: string, is_trashed: boolean) => {
  return API.put<any>(`notesapp/notes/update/${id}/`, { is_trashed });
};

export const pinNote = (id: string, is_pinned: boolean) => {
  return API.put<any>(`notesapp/notes/update/${id}/`, { is_pinned });
};

export const trashedNotes = () => {
  return API.put<any>(`notesapp/notes/update/`);
};

export const deleteNotes = () => {
  return API.delete<any>(`notesapp/notes/delete/`);
};

export const deleteNote = (id: string) => {
  return API.delete<any>(`notesapp/notes/delete/${id}`);
};

export const createNote = (data: any) => {
  return API.post<any>("notesapp/notes/create/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
