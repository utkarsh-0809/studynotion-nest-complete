import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './model/User';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel:Model<UserDocument>){}
  async create(createUserDto: CreateUserDto) {
    return  await this.userModel.create(createUserDto)
  }
  

  async findAll() {
    return await this.userModel.find();
  }

  async findOne(obj:any) {
  return await this.userModel.findOne(obj);
}


  async update(id: any, values:any,options?:any) {
    return await this.userModel.findByIdAndUpdate(id,values,options?options:{new:false})
  }

  remove(id: any) {
    return this.userModel.findByIdAndDelete(id)
  }

  async updatePass(email:string,password:string){
    console.log(email,password);
    return await this.userModel.findOneAndUpdate(
      {email},
      {password},
      { new: true }
    )
  }
  

}
