import { IRepository } from "./IRepository";

export class RepositoryStub implements IRepository {
  /* TRACKING API */
  public async getTrackEvents(): Promise<any> {
    var response = await window.fetch(`/data/events.json`);
    return response.json();
  }

  public async getActiveUsers(): Promise<any> {
    var response = await window.fetch(`/data/active-users.json`);
    return response.json();
  }
}
