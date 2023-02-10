import { User } from "@app/db/models/user.model";
import { UserDto } from "libs/models/user";

export const userAdapter = (user: User) : UserDto => ({
        _id: user._id,
        name: user.name,
        familyName: user.familyName,
        email: user.email
})