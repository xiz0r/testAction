import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Schema as MSchema } from "mongoose";
import { DataSchema } from "./data.schema";

@Schema()
export class DatasetSchema {

    @Prop()
    name: string;

    @Prop()
    description: string;
    
    @Prop()
    creationDate: Date;

    @Prop()
    lastEditDate: Date;
    
    @Prop({type: MSchema.Types.ObjectId, ref: 'Data'})
    currentVersion: {type: MSchema.Types.ObjectId, ref: 'Data'}

    @Prop()
    versions: [{type: MSchema.Types.ObjectId, ref: 'Data'}]

    @Prop({type: MSchema.Types.ObjectId, ref: 'User'})
    owner: {type: MSchema.Types.ObjectId, ref: 'User'}

    @Prop()
    editors: [{type: MSchema.Types.ObjectId, ref: 'User'}]

    @Prop({type: DataSchema, ref: 'Data'})
    currentData: DataSchema

    @Prop()
    linkedDatasets: [{type: MSchema.Types.ObjectId, ref: 'Dataset'}]

    @Prop()
    isDriveFile: boolean

    @Prop()
    driveFileId: string

    @Prop()
    mimeType: string
}
export const DatasetModel = SchemaFactory.createForClass(DatasetSchema);