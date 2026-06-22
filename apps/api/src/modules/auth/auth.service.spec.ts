import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import * as argon2 from 'argon2';

const mockPrisma = {
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  refreshToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-token'),
  verify: jest.fn(),
};

const mockConfig = {
  get: jest.fn().mockImplementation((_key: string, def?: string) => def ?? 'mock-secret'),
  getOrThrow: jest.fn().mockReturnValue('mock-secret-64chars-long-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('harus melempar ConflictException jika email sudah terdaftar', async () => {
      mockPrisma.user.findFirst.mockResolvedValue({ email: 'test@test.com', phone: '081234' });
      await expect(
        service.register({
          name: 'Test',
          email: 'test@test.com',
          phone: '081234',
          password: 'Password123!',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('harus berhasil mendaftar pengguna baru', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-1',
        name: 'Budi',
        email: 'budi@test.com',
        phone: '08123456789',
        role: 'buyer',
        createdAt: new Date(),
      });
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const result = await service.register({
        name: 'Budi',
        email: 'budi@test.com',
        phone: '08123456789',
        password: 'Password123!',
      });

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tokens');
      expect(result.tokens).toHaveProperty('accessToken');
    });
  });

  describe('login', () => {
    it('harus melempar UnauthorizedException jika user tidak ditemukan', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.login({ email: 'notfound@test.com', password: 'Password123!' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('harus melempar UnauthorizedException jika password salah', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        passwordHash: await argon2.hash('benar123'),
        status: 'active',
        role: 'buyer',
      });
      await expect(
        service.login({ email: 'test@test.com', password: 'salah' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('harus berhasil login dengan kredensial valid', async () => {
      const hash = await argon2.hash('Password123!');
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        name: 'Budi',
        email: 'budi@test.com',
        phone: '08123',
        passwordHash: hash,
        status: 'active',
        role: 'buyer',
        createdAt: new Date(),
        updatedAt: new Date(),
        avatarUrl: null,
      });
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const result = await service.login({ email: 'budi@test.com', password: 'Password123!' });

      expect(result).toHaveProperty('tokens');
      expect(result.user).not.toHaveProperty('passwordHash');
    });
  });
});
