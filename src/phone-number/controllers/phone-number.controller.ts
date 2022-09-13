import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { PhoneNumberDto, UpdatePhoneNumberDto } from '../dto/phone-number-dto';
import { PhoneNumberService } from '../services/phone-number.service';

@Controller('phone-number')
export class PhoneNumberController {

    constructor(private phoneNumberService: PhoneNumberService) { }

    @Post('save')
    async createPhoneNumber(@Body() phoneNumberDto: PhoneNumberDto, @Res({ passthrough: true }) response) {
        try {
            response.status(HttpStatus.CREATED)
            return await this.phoneNumberService.createPhoneNumber(phoneNumberDto)
        } catch (error) {
            response.status(HttpStatus.NOT_ACCEPTABLE)
            return { message: error.message, trace: error }
        }
    }

    @Get('all')
    async getAllPhoneNumbers(@Res({ passthrough: true }) response) {
        try {
            response.status(HttpStatus.OK)
            return await this.phoneNumberService.getAll()
        } catch (error) {
            response.status(HttpStatus.NO_CONTENT)
            return { message: error.message, trace: error }
        }
    }

    @Get('get/:id')
    async getPhoneNumberById(@Param('id') phoneNumberId: number, @Res({ passthrough: true }) response) {
        try {
            response.status(HttpStatus.FOUND)
            return await this.phoneNumberService.getPhoneNumberById(phoneNumberId)
        } catch (error) {
            response.status(HttpStatus.NOT_FOUND)
            return { message: error.message, trace: error }
        }
    }

    @Get('get/by-contact/:contactId')
    async getAllByContactId(@Param('contactId') contactId: number, @Res({ passthrough: true }) response) {
        try {
            response.status(HttpStatus.FOUND)
            return await this.phoneNumberService.getAllByContactId(contactId)
        } catch (error) {
            response.status(HttpStatus.NOT_FOUND)
            return { message: error.message, trace: error }
        }
    }

    @Put('update/:id')
    async updatePhoneNumber(@Param('id') id: number, @Body() phoneNumberDto: UpdatePhoneNumberDto, @Res({ passthrough: true }) response) {
        try {
            response.status(HttpStatus.ACCEPTED)
            return await this.phoneNumberService.updatePhoneNumber(id, phoneNumberDto)
        } catch (error) {
            response.status(HttpStatus.NOT_ACCEPTABLE)
            return { message: error.message, trace: error }
        }
    }

    @Delete('delete/:id')
    async deletePhoneNumber(@Param('id') phoneNumberId: number, @Res({ passthrough: true }) response) {
        try {
            response.status(HttpStatus.OK)
            return await this.phoneNumberService.deletePhoneNumber(phoneNumberId)
        } catch (error) {
            response.status(HttpStatus.BAD_REQUEST)
            return { message: error.message, trace: error }
        }
    }
}