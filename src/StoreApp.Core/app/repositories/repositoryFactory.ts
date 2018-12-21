import { IRepository } from "./IRepository";
import { config } from "./../config";
import { RepositoryStub } from "./repositoryStub";
import { Repository } from "./repository";

export const repositoryFactory = {
  get(): IRepository {
    return config.useRepositoryStub ? new RepositoryStub() : new Repository();
  }
};
