import { Model } from "./model";
import { Step } from "./step";

export interface StartTestPayload {
    selectedTest: Test;
}

export interface Test extends Model {
    URL: string;
    steps: Step[];
}
