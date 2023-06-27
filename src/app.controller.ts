import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, CurrentUser } from './user.entity';

class UserPreferencesDto { //Data that the user can save (DTO)
  @IsBoolean()
  @IsNotEmpty()
  termsAndConditionAccepted: boolean;

  @IsNotEmpty()
  languagePreferences: string;

  @IsBoolean()
  @IsNotEmpty()
  showLanguagesPreferences: boolean;

  @IsBoolean()
  @IsNotEmpty()
  showProfilePreferences: boolean;
}

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt')) //authentication using a JWT
@ApiTags('user')
@Controller('v1/user/preferences')
export class UserPreferencesController {
  constructor(
    @InjectRepository(User) //@InjectRepository decorator (to interact with the users table in our database)
    private userRepository: Repository<User>, //object 
  ) {}

  @Post()
  async saveUserPreferences( //method
    @Body() userPreferencesDto: UserPreferencesDto, //object
    @CurrentUser() user: User, // @CurrentUse: custom decorator
  ): Promise<void> {
    const existingUser = await this.userRepository.findOne(user.id);
    if (existingUser.preferences) { //checking if the user has already saved their preferences
      return; //if he did, return the DTO data.
    }

    const newUser = Object.assign(existingUser, { 
      preferences: userPreferencesDto,
    }); //if NOT, UPDATE the user's preferences field with the data from the DTO and save the updated user to the database.

    await this.userRepository.save(newUser);
  }
}



