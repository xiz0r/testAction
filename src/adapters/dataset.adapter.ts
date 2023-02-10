import { Dataset } from "@app/db/models/dataset.model";
import { DatasetDto } from "libs/models/dataset";

export const datasetAdapter = (dataset: Dataset): DatasetDto => ({
        _id : dataset._id,
        name: dataset.name,
        description: dataset.description,
        creationDate: dataset.creationDate,
        lastEditDate: dataset.lastEditDate,
        linkedDatasets: dataset.linkedDatasets,
        owner: dataset.owner.email,
        editors: dataset.editors,
        currentVersion: dataset.currentVersion,
        versions: dataset.versions,
        data: dataset.data,
        isDriveFile: dataset.isDriveFile,
        driveFileId: dataset.driveFileId,
        mimeType: dataset.mimeType
})