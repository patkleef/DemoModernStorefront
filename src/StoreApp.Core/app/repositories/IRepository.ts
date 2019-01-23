export interface IRepository {
  getTrackEvents(): Promise<any>;
  getActiveUsers(): Promise<any>;
  getProductScannedEvents(): Promise<any>;
}
