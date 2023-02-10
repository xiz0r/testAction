import { User } from '@app/db/models/user.model';
import { UserRepository } from '@app/db/repositories/user.repository';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from 'libs/models/user';
import { userAdapter } from 'src/adapters/user.adapter';

@Injectable()
export class UserService {
    constructor (
        private readonly userRepository: UserRepository
    ) { }

    async get (email: string): Promise<UserDto> {
        const user = await this.userRepository.findOne({email: email.toLowerCase()})
        if(!user) throw new NotFoundException(`Email not found`)
        return userAdapter(user)
    }

    async create (user: UserDto): Promise<User> {
        const lowerCaseEmail = user.email.toLowerCase()
        const existingUser = await this.userRepository.findOne({email: lowerCaseEmail})
        if(existingUser) throw new ConflictException(`User already exist`)
        return await this.userRepository.create({...user, email: lowerCaseEmail} as User);
    }
}
