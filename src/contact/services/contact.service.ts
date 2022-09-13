import { BadRequestException, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ContactDto, UpdateContactDto } from '../dto/contact-dto';
import { Contact } from '../entities/contact.entity';

@Injectable()
export class ContactService {

    constructor(
        @InjectRepository(Contact)
        private contactRepository: Repository<Contact>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createContact(contactDto: ContactDto): Promise<Contact> {
        try {
            delete contactDto.id

            await this.userRepository.findOneByOrFail({ id: contactDto.user.id })

            const createdContact = this.contactRepository.create(contactDto)

            return await this.contactRepository.save(createdContact)
        } catch (error) {
            throw new NotAcceptableException(`Specified user {id: ${contactDto.user.id}} does not exist`)
        }
    }

    async getAll(): Promise<Contact[]> {
        try {
            return await this.contactRepository.find()
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    async getContactById(contactId: number): Promise<Contact> {
        try {
            return await this.contactRepository.findOneByOrFail({ id: contactId })
        } catch (error) {
            throw new NotFoundException(error`Specified contact {id: ${contactId}} does not exist`)
        }
    }

    async getContactsByUserId(userId: number): Promise<Contact[]> {
        try {
            const relatedUser = await this.userRepository.findOneByOrFail({ id: userId })
            return await this.contactRepository.findBy({
                user: relatedUser
            })
        } catch (error) {
            throw new NotFoundException(`Specified user {id: ${userId}} does not exist`)
        }
    }

    async updateContact(contactId: number, contactDto: UpdateContactDto): Promise<Contact> {
        delete contactDto.user

        const contactToUpdate = await this.contactRepository.findOneBy({ id: contactId })

        if (!contactToUpdate) {
            throw new NotFoundException(`Specified contact {id: ${contactId}} was not found`)
        }

        if (contactDto.id && contactDto.id !== contactId) {
            throw new BadRequestException(
                `The contact id sent through the request body must match with the contact id sent through the request path.`
            )
        }

        this.contactRepository.merge(contactToUpdate, contactDto)

        return await this.contactRepository.save(contactToUpdate)
    }

    async deleteContact(contactId: number): Promise<any> {
        try {
            await this.contactRepository.findOneByOrFail({ id: contactId })
            return await this.contactRepository.delete(contactId)
        } catch (error) {
            throw new NotFoundException(`Specified contact {id: ${contactId}} was not found`)
        }
    }


}
