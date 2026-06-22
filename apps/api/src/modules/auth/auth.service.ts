import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { phone: dto.phone }] },
    });
    if (exists) {
      if (exists.email === dto.email) throw new ConflictException('Email sudah terdaftar');
      throw new ConflictException('Nomor telepon sudah terdaftar');
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        role: dto.role as 'buyer' | 'seller',
      },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { user, tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Email atau password salah');
    if (user.status !== 'active') throw new UnauthorizedException('Akun Anda tidak aktif');

    const passwordValid = await argon2.verify(user.passwordHash, dto.password);
    if (!passwordValid) throw new UnauthorizedException('Email atau password salah');

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    const { passwordHash: _ph, ...safeUser } = user;
    return { user: safeUser, tokens };
  }

  async refresh(refreshToken: string) {
    let payload: { sub: string; email: string; role: string };
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token tidak valid atau sudah kadaluarsa');
    }

    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token tidak ditemukan atau sudah kadaluarsa');
    }

    await this.prisma.refreshToken.delete({ where: { token: refreshToken } });

    const tokens = await this.generateTokens(payload.sub, payload.email, payload.role);
    return tokens;
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await this.prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    } else {
      await this.prisma.refreshToken.deleteMany({ where: { userId } });
    }
    return { message: 'Berhasil logout' };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessSecret = this.config.getOrThrow<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.config.getOrThrow<string>('JWT_REFRESH_SECRET');

    const accessExpiry = this.config.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m';
    const refreshExpiry = this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';
    const accessOpts: JwtSignOptions = { secret: accessSecret, expiresIn: accessExpiry as never };
    const refreshOpts: JwtSignOptions = { secret: refreshSecret, expiresIn: refreshExpiry as never };

    const accessToken = this.jwtService.sign(payload, accessOpts);
    const refreshToken = this.jwtService.sign(payload, refreshOpts);

    const refreshExpiresInMs = 7 * 24 * 60 * 60 * 1000;
    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + refreshExpiresInMs),
      },
    });

    return { accessToken, refreshToken, expiresIn: 900 };
  }
}
