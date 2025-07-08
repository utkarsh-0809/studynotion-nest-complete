// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export type OtpDocument = Otp & Document;

// @Schema({
//   timestamps: true,
//   expires: 300,  // 5 minutes in seconds
// })
// export class Otp {
//   @Prop({ required: true })
//   email: string;

//   @Prop({ required: true })
//   otp: string;

//   @Prop({
//     type: Date,
//     default: Date.now,
//     expires: 300, // 5 minutes in seconds
//   })
//   createdAt: Date;
// }

// export const OtpSchema = SchemaFactory.createForClass(Otp);


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { MailService } from 'src/common/mailsender/sendmail';
import { emailVerification } from 'src/common/mailsender/templates/emailverification';

export type OtpDocument = Otp & Document;

@Schema({
  timestamps: true,
  // TTL index:
  expires: 60 * 5, // 5 minutes
})
export class Otp {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const OTPSchema = SchemaFactory.createForClass(Otp);

// add pre hook directly on the schema
OTPSchema.pre<OtpDocument>('save', async function (next) {
  const mailservice= new MailService();
  console.log('New OTP document about to be saved in MongoDB');

  if (this.isNew) {
    try {
      await mailservice.sendMail(
        this.email,
        'Verification Email',
        emailVerification(this.otp),
      );
      console.log('Verification email sent');
    } catch (err) {
      console.log('Error sending verification email:', err.message);
      throw err;
    }
  }
  next();
});

