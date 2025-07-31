import { UserResponseDto } from '../dtos/userResponse.dto';

export class LoginResponseDto {
  message: string;
  user: UserResponseDto;
  token: string;

  constructor(message: string, user: UserResponseDto, token: string) {
    this.message = message;
    this.user = user;
    this.token = token;
  }
}
