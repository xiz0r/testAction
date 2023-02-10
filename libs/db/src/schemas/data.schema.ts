import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Schema as MSchema } from "mongoose";

@Schema()
export class DataSchema {
    @Prop({type: MSchema.Types.ObjectId, ref: 'Dataset'})
    datasetId: {type: MSchema.Types.ObjectId, ref: 'Dataset'};

    @Prop({type: []})
    data: any;

    @Prop()
    date: Date;

    @Prop({type: {}})
    schema: any;
}

export const DataModel = SchemaFactory.createForClass(DataSchema);