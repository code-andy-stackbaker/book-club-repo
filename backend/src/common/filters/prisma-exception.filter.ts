// Maps common Prisma errors to clean HTTP responses.
// Purposefully small: we only cover the cases we actually hit in this app.
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    // Known Prisma errors → friendly HTTP status + message.
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2025') {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Resource not found' });
      }
      if (exception.code === 'P2002') {
        return res.status(HttpStatus.CONFLICT).json({ message: 'Unique constraint violated' });
      }
      return res.status(HttpStatus.BAD_REQUEST).json({ message: exception.message });
    }

    // Pass through HttpExceptions (e.g., 400/404 thrown in services).
    if (exception instanceof HttpException) {
      return res.status(exception.getStatus()).json(exception.getResponse());
    }

    // Fallback: don’t leak internals.
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Unexpected error' });
  }
}