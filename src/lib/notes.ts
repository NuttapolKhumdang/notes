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
    localStorage.setItem("label", JSON.stringify(Notes.Label));
};

export const NoteGetLocal = (): INote[] => {
    return JSON.parse(localStorage.getItem("notes") ?? '[]');
};

export const LabelGetLocal = (): string[] => {
    return JSON.parse(localStorage.getItem("label") ?? '[]');
};

type runtime_t = {
    editorId?: number;
    filterLabel?: string;
    renderColumn?: number[];
}

type notes_t = {
    Notes: INote[];
    Label: string[];
    Runtime?: runtime_t;
}

export const [Notes, setNotes] = createStore<notes_t>({
    Notes: NoteGetLocal(),
    Label: LabelGetLocal(),
    Runtime: {
        renderColumn: window.innerWidth > 768 ? [0, 1, 2] : [0, 1]
    }
});

