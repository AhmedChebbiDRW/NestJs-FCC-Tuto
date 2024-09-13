import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSongDTO } from './dto/create-song.dto';
import { Song } from './entities/song.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}
  private readonly songs = [];

  async create(createSongDTO: CreateSongDTO): Promise<Song> {
    const song = this.songRepository.create(createSongDTO);
    return await this.songRepository.save(song);
  }

  async findAll(): Promise<Song[]> {
    return await this.songRepository.find();
  }

  async findOne(id: number): Promise<Song | undefined> {
    return await this.songRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateSong: Partial<CreateSongDTO>,
  ): Promise<Song | undefined> {
    await this.songRepository.update(id, updateSong);
    return await this.findOne(id);
  }

  async delete(id: number): Promise<{ deleted: boolean; message: string }> {
    const result = await this.songRepository.delete(id);
    if (result.affected > 0) {
      return { deleted: true, message: 'Song successfully deleted' };
    } else {
      return { deleted: false, message: 'Song not found or already deleted' };
    }
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    // Adding query builder
    // If you need to add query builder you can add it here
    const queryBuilder = this.songRepository.createQueryBuilder('songs');
    queryBuilder.orderBy('songs.releasedDate', 'DESC');
    return paginate<Song>(queryBuilder, options);
  }
}
