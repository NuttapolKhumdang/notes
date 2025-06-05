export interface INote {
    id?: number;
    title?: string;
    body: string;

    created?: Date;
    updated?: Date;
    label?: string[];

    status?: undefined | "pinned" | "archive";
}

export const NoteSyncLocal = (n: INote[]) => {
    localStorage.setItem("notes", JSON.stringify(n));
};

export const NoteGetLocal = (): INote[] => {
    return JSON.parse(localStorage.getItem("notes") ?? '[]');
};