import { Model } from "./model";

export enum StepActions {
    LeftClick = "left-click"
}

export interface Step extends Model {
    action: StepActions;
    photo: string;
    identifier: string;
    description: string;
}