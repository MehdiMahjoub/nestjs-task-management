import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { title } from 'process';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOneBy: jest.fn(),
});

const mockUser = {
  username: 'Ariel',
  id: 'someId',
  password: 'somePwd',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    //init a NestJs moldule with tasksService taskRepository
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useFactory: mockTasksRepository,
        },
      ],
    }).compile();
    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const reuslt = await tasksService.getTasks(null, mockUser);
      expect(reuslt).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      const mockTask = {
        title: 'test Title',
        description: 'test desc',
        id: 'someId',
        status: TaskStatus.OPEN,
      };

      tasksRepository.findOneBy.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });
    it('calls TasksRepository.findOne and handles an error', async () => {
      tasksRepository.findOneBy.mockResolvedValue(null);
      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
