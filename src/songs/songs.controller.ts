import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/create-song.dto';
import { UpdateSongDTO } from './dto/update-song.dto';
import { Song } from './entities/song.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  async create(@Body() createSongDto: CreateSongDTO): Promise<Song> {
    return this.songsService.create(createSongDto);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number = 10,
  ): Promise<Pagination<Song>> {
    limit = limit > 100 ? 100 : limit;
    return this.songsService.paginate({ page, limit });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Song> {
    const song = await this.songsService.findOne(id);
    if (!song) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }
    return song;
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDto: UpdateSongDTO,
  ): Promise<Song> {
    const updatedSong = await this.songsService.update(id, updateSongDto);
    if (!updatedSong) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }
    return updatedSong;
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const result = await this.songsService.delete(id);
    if (!result.deleted) {
      throw new HttpException(result.message, HttpStatus.NOT_FOUND);
    }
  }
}
