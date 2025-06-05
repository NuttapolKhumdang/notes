export interface INote {
    id?: number;
    title?: string;
    body: string;

    created?: Date;
    updated?: Date;
    label?: string[];

    status?: undefined | "pinned" | "archive";
}