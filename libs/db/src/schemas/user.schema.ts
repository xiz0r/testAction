import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"

@Schema()
export class UserDocument {
   @Prop()
   name: string;
   @Prop()
   familyName: string;
   @Prop()
   email: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);