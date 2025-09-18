import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subscription } from '@nestjs/graphql';
import { Model } from 'mongoose';
import { SubscriptionDocument } from './model/subscription.schema';
import { User } from 'src/user/model/User';

@Injectable()
export class SubscriptionService {
  
      constructor(
          @InjectModel(Subscription.name)
          private readonly subscriptionModel: Model<SubscriptionDocument>,
         
        ) {}
  
 async create(createSubscriptionDto: any) {
     await this.subscriptionModel.create(createSubscriptionDto);
     return {
      success: true,
      message: "Subscription created successfully",
     }
  }

  async findAll() {
    const data=await this.subscriptionModel.find();
    return {
      success: true,  
      data:data 
    }
}

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }

async   update(id: number, updateSubscriptionDto: any) {
      await this.subscriptionModel.findByIdAndUpdate(id,updateSubscriptionDto);
      return {
        success: true,
        message: "Subscription updated successfully"
      }
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
