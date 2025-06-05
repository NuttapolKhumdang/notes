import { createStore } from "solid-js/store";

export interface INote {
    id?: number;
    title?: string;
    body: string;

    created?: Date;
    updated?: Date;
    label?: string[];

    status?: undefined | "pinned" | "archive" | "delete";
}

export const NoteSyncLocal = () => {
    localStorage.setItem("notes", JSON.stringify(Notes.Notes));
};

export const NoteGetLocal = (): INote[] => {
    return JSON.parse(localStorage.getItem("notes") ?? '[]');
};

export const [Notes, setNotes] =
    createStore<{ Notes: INote[] }>({ Notes: NoteGetLocal() });
//  createSignal<INote[]>(NoteGetLocal());