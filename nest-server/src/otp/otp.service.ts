import { Injectable } from '@nestjs/common';
import { CreateOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { Otp, OtpDocument } from './dto/model/otp';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
  ) {}
  create(createOtpDto: CreateOtpDto) {
    return this.otpModel.create(createOtpDto)
  }

  findAll() {
    return `This action returns all otp`;
  }

  async findOne(email:any):Promise<any> {
    return await this.otpModel.find({email}).sort({createdAt:-1}).limit(1)
  }

  update(id: number, updateOtpDto: UpdateOtpDto) {
    return `This action updates a #${id} otp`;
  }

  remove(id: number) {
    return `This action removes a #${id} otp`;
  }
}
