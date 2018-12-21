export interface IRepository {
  getTrackEvents(): Promise<any>;
  getActiveUsers(): Promise<any>;
}
