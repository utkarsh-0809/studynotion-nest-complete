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
    { returnDocument: 'after' } as any,
    ).exec();
    console.log("Created discussion:", data);
    return data;
    }catch(err){
      console.error("Error creating discussion:", err); }

  }

  async findAll() {
    try{
    console.log("here inside discuss findall");
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
    const Id= new Types.ObjectId(id);
    const discussion:any = await this.model.findById(Id);
    // const userObjId = new Types.ObjectId(userId);
    console.log("User ObjectId", userId);
    console.log("Discussion before upvote:", discussion);
    if (!discussion)
    return {data:null,message:"Discussion not found"};

    
    if (discussion.upvotes.includes(userId)) {
      discussion.upvotes = discussion.upvotes.filter(
        (uid:any) => uid.toString() !== userId,
      );
    } else {
      discussion.upvotes.push(userId);
    }
    console.log("Discussion after upvote:", discussion);
    // discussion.save();
    // return this.model.find().sort({ createdAt: -1 })
    return discussion.save();
  }

  async addComment(id: string, user: any, text: string) {
    const ID= new Types.ObjectId(id);
    // const user=req.user.userId;
    const discussion = await this.model.findById(ID);
    if (!discussion) return null;

    discussion.comments.push({
      user: new Types.ObjectId(user),
      body: text,
    } as any);
    // const discussion = await this.model.findByIdAndUpdate(
    //   ID,
    //   {
    //     $push: {
    //       comments: { user: new Types.ObjectId(user), body: text } as any,
    //     },
    //   }
    // ).populate('comments.user').populate('user');
    // if (!discussion) return {data:null,message:"Discussion not found"}; 
    // return{data:discussion,message:"Comment added successfully"};
    return discussion.save();
    // return this.model.find().sort({ createdAt: -1 })
  }
}
