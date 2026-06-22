import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';

@ApiTags('health')
@Controller()
export class AppController {
  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  health() {
    return {
      success: true,
      data: {
        status: 'ok',
        version: '1.0.0',
        app: 'UMKMku API',
        timestamp: new Date().toISOString(),
      },
    };
  }
}
