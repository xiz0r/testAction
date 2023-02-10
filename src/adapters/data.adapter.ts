import { Data } from "@app/db/models/data.model";
import { DataDto } from "libs/models/data";

export const dataAdapter = (data: Data): DataDto => ({
    _id: data._id,
    datasetId: data.datasetId,
    data: data.data,
    date: data.date,
    schema: data.schema
})