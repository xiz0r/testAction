import { ReferenceObject } from "libs/models/reference-object";

export const isAnObjectReference = (value: Object): value is ReferenceObject => {
    return 'reference' in value && 'localKey' in value
}