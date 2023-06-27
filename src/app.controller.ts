import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

class UserPreferencesDto {
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
@UseGuards(AuthGuard('jwt'))
@ApiTags('user')
@Controller('v1/user/preferences')
export class UserPreferencesController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Post()
  async saveUserPreferences(
    @Body() userPreferencesDto: UserPreferencesDto,
    @CurrentUser() user: User,
  ): Promise<void> {
    const existingUser = await this.userRepository.findOne(user.id);
    if (existingUser.preferences) {
      return;
    }

    const newUser = Object.assign(existingUser, {
      preferences: userPreferencesDto,
    });

    await this.userRepository.save(newUser);
  }
}



