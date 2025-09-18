// import { Injectable } from '@nestjs/common';
// import { CreateDiscussDto } from './dto/create-discuss.dto';
// import { UpdateDiscussDto } from './dto/update-discuss.dto';

// @Injectable()
// export class DiscussService {
//   create(createDiscussDto: CreateDiscussDto) {
//     return 'This action adds a new discuss';
//   }

//   findAll() {
//     return `This action returns all discuss`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} discuss`;
//   }

//   update(id: number, updateDiscussDto: UpdateDiscussDto) {
//     return `This action updates a #${id} discuss`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} discuss`;
//   }
// }
// discussions.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Discussion } from './entities/discuss.entity';
import { User, UserDocument } from 'src/user/model/User';
// import { Discussion } from './discuss.schema';

@Injectable()
export class DiscussionsService {
  constructor(@InjectModel(Discussion.name) private model: Model<Discussion>,
      @InjectModel(User.name) private UserModel: Model<UserDocument>,
) {}

  async create(dto: any) {
    try{
    const data=await this.model.create(dto);
    this.UserModel.findOneAndUpdate(
      { email: dto.user },
      { $inc: { coin: 100 } },
      { new: true },
    ).exec();
    console.log("Created discussion:", data);
    return data;
    }catch(err){
      console.error("Error creating discussion:", err); }

  }

  async findAll() {
    try{
    return this.model.find().sort({ createdAt: -1 })
    }
    catch(err){
      console.error("Error fetching discussions:", err); }
    // .populate('user').populate('comments.user');
  }

  async findOne(id: string) {
    return this.model.findById(id).populate('user').populate('comments.user');
  }

  async upvote(id: string, userId: string) {
    const discussion = await this.model.findById(id);
    if (!discussion) return null;

    const userObjId = new Types.ObjectId(userId);

    if (discussion.upvotes.includes(userObjId)) {
      discussion.upvotes = discussion.upvotes.filter(
        (uid) => uid.toString() !== userId,
      );
    } else {
      discussion.upvotes.push(userObjId);
    }

    return discussion.save();
  }

  async addComment(id: string, userId: string, text: string) {
    const discussion = await this.model.findById(id);
    if (!discussion) return null;

    discussion.comments.push({
      user: new Types.ObjectId(userId),
      body: text,
    } as any);

    return discussion.save();
  }
}
