import {
  Post,
  Body,
  Controller,
  Res,
  Param,
  Delete,
  Get,
  Query,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CreateUserDto } from 'src/common/dtos/CreateUser';
import { Response } from 'express';
import { User } from '@prisma/client';
import { EditUserDto } from 'src/common/dtos/EditUser';
import { AbstractUserRepository } from '../repositories';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from 'src/common/services/image.service';
import axios from 'axios';

@Controller('api/user')
export class UserController {
  constructor(
    private userRepository: AbstractUserRepository,
    private readonly imageService: ImageService,
  ) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  async createUser(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: CreateUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    const { email, password, name } = body;
    if (image) {
      const imageUrl = await this.imageService.uploadImage(image);
      await this.userRepository.createUser(email, password, name, imageUrl);
      return res.status(201).send({ imageUrl });
    }

    await this.userRepository.createUser(email, password, name);

    return res.status(201).send();
  }

  @Get()
  async getUsers(
    @Query('id') id?: string,
    @Query('name') name?: string,
    @Query('email') email?: string,
  ): Promise<User | User[]> {
    if (id) {
      return this.userRepository.findById(id);
    } else if (name) {
      return this.userRepository.findByName(name);
    } else if (email) {
      return this.userRepository.findByEmail(email);
    }
    return this.userRepository.getAllUsers();
  }

  @Put('update/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: EditUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    const { email, password, name } = body;
    if (!email && !password && !name) {
      return res.status(400).json({ message: 'No data provided' });
    }

    await this.userRepository.updateUser(id, { email, password, name });
    return res.status(200).send();
  }

  @Delete('delete/:id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.userRepository.deleteUser(id);
  }

  @Post('login/facial')
  @UseInterceptors(FileInterceptor('image'))
  async loginFacial(
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ) {
    const temporaryImageUrl = await this.imageService.uploadImage(image, true);
    const response = await axios.post('http://localhost:8000/user/recognize/', {
      imageUrl: temporaryImageUrl,
    });

    console.log(response.data);

    if (!response.data.status) return res.sendStatus(500);

    switch (response.data.data) {
      case 0:
        return res.status(401).json({ message: 'No Face Detected' });
      case 1:
        await axios.get('http://192.168.15.164:80/closed');
        return res.status(401).json({ message: 'Face Not Recognized' });
      case 2:
        await axios.get('http://192.168.15.164:80/open');
        return res.status(200).json({ message: 'Face Recognized' });
    }
  }
}
