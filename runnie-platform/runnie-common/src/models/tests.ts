import { Model } from "./model";

export interface StartTestPayload {
    selectedTest: Test;
}

export interface Test extends Model {
    URL: string;
    steps: any[];
}
