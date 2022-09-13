import { BadRequestException, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throwIfEmpty } from 'rxjs';
import { Contact } from 'src/contact/entities/contact.entity';
import { Repository } from 'typeorm';
import { PhoneNumberDto, UpdatePhoneNumberDto } from '../dto/phone-number-dto';
import { PhoneNumber } from '../entities/phone-number.entity';

@Injectable()
export class PhoneNumberService {

    constructor(
        @InjectRepository(PhoneNumber)
        private phoneNumberRepository: Repository<PhoneNumber>,
        @InjectRepository(Contact)
        private contactRepository: Repository<Contact>,
    ) { }

    async createPhoneNumber(phoneNumberDto: PhoneNumberDto): Promise<PhoneNumber> {
        try {
            delete phoneNumberDto.id

            await this.contactRepository.findOneByOrFail({ id: phoneNumberDto.contact.id })

            const createdPhoneNumber = this.phoneNumberRepository.create(phoneNumberDto)

            return await this.phoneNumberRepository.save(createdPhoneNumber)
        } catch (error) {
            throw new NotAcceptableException(`Specified contact {id: ${phoneNumberDto.contact.id}} does not exist`)
        }
    }

    async getAll(): Promise<PhoneNumber[]> {
        try {
            return await this.phoneNumberRepository.find()
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    async getPhoneNumberById(phoneNumberId: number): Promise<PhoneNumber> {
        try {
            return await this.phoneNumberRepository.findOneByOrFail({ id: phoneNumberId })
        } catch (error) {
            throw new NotFoundException(`Specified phone number {id: ${phoneNumberId}} does not exist`)
        }
    }

    async getAllByContactId(contactId: number): Promise<PhoneNumber[]> {
        try {
            const relatedContact = await this.contactRepository.findOneByOrFail({ id: contactId })
            return await this.phoneNumberRepository.findBy({
                contact: relatedContact
            })
        } catch (error) {
            throw new NotFoundException(`Specified contact {id: ${contactId}} does not exist`)
        }
    }

    async updatePhoneNumber(phoneNumberId: number, phoneNumberDto: UpdatePhoneNumberDto): Promise<PhoneNumber> {
        delete phoneNumberDto.contact

        const phoneNumberToUpdate = await this.phoneNumberRepository.findOneByOrFail({ id: phoneNumberId })

        if (!phoneNumberToUpdate) {
            throw new NotFoundException(`Specified phone number {id: ${phoneNumberId}} was not found`)
        }

        if (phoneNumberDto.id && phoneNumberDto.id !== phoneNumberId) {
            throw new BadRequestException(
                `The phone number id sent through the request body must match with the phone number id sent through the request path.`
            )
        }

        this.phoneNumberRepository.merge(phoneNumberToUpdate, phoneNumberDto)

        return await this.phoneNumberRepository.save(phoneNumberToUpdate)
    }

    async deletePhoneNumber(phoneNumberId: number): Promise<any> {
        try {
            await this.phoneNumberRepository.findOneByOrFail({ id: phoneNumberId })
            return await this.phoneNumberRepository.delete(phoneNumberId)

        } catch (error) {
            throw new NotFoundException(`Specified phone number {id: ${phoneNumberId}} was not found`)
        }
    }
}
