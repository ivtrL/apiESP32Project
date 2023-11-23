import { Log, User, Device, Card, Time, Admin } from '@prisma/client';

export abstract class AbstractDeviceRepository {
  abstract createDevice(deviceName: string): Promise<void>;
  abstract getAllDevices(): Promise<Device[]>;
  abstract findByDeviceUid(deviceUid: string): Promise<Device>;
  abstract findByDeviceName(deviceName: string): Promise<Device[]>;
  abstract updateDevice(deviceUid: string, deviceName: string): Promise<void>;
  abstract deleteDevice(deviceUid: string): Promise<void>;
}

export abstract class AbstractCardRepository {
  abstract createCard(cardUid: string, userId?: string): Promise<void>;
  abstract getAllCards(): Promise<Card[]>;
  abstract findByCardUid(cardUid: string): Promise<Card>;
  abstract findByUserId(userId: string): Promise<Card[]>;
  abstract updateCard(cardUid: string, userId: string): Promise<void>;
  abstract deleteCard(cardUid: string): Promise<void>;
}

export abstract class AbstractLogRepository {
  abstract createLog(
    logId: string,
    deviceUid: string,
    Authorized: boolean,
    cardUid?: string,
  ): Promise<Log>;
  abstract getAllLogs(): Promise<Log[]>;
  abstract getLatestAuthorizedLog(cardUid: string): Promise<Log[]>;
  abstract findByLogId(logId: string): Promise<Log>;
  abstract findByCardUid(cardUid: string): Promise<Log[]>;
  abstract findByDeviceUid(deviceUid: string): Promise<Log[]>;
  abstract updateLog(
    logId: string,
    data: { cardUid?: string; deviceUid?: string },
  ): Promise<void>;
  abstract deleteLog(logId: string): Promise<void>;
  abstract deleteLogs(cardUid: string): Promise<void>;
}

export abstract class AbstractUserRepository {
  abstract createUser(
    email: string,
    password: string,
    name?: string,
  ): Promise<void>;
  abstract getAllUsers(): Promise<User[]>;
  abstract findById(userId: string): Promise<User>;
  abstract findByEmail(email: string): Promise<User[]>;
  abstract findByName(name: string): Promise<User[]>;
  abstract updateUser(
    userId: string,
    data: { email?: string; password?: string; name?: string },
  ): Promise<void>;
  abstract deleteUser(userId: string): Promise<void>;
}

export abstract class AbstractTimeRepository {
  abstract createTime(logId: string, booleanExit: boolean): Promise<void>;
  abstract getAllTimes(): Promise<Time[]>;
  abstract findByTime(time: Date): Promise<Time[]>;
  abstract findByLogId(logId: string): Promise<Time[]>;
  abstract findByBooleanExit(booleanExit: boolean): Promise<Time[]>;
  abstract deleteTimes(logId: string): Promise<void>;
}

export abstract class AbstractAdminRepository {
  abstract createAdmin(
    email: string,
    password: string,
    name?: string,
  ): Promise<void>;
  abstract findById(AdminId: string): Promise<Admin>;
  abstract findByEmail(email: string): Promise<Admin>;
  abstract updateAdmin(
    AdminId: string,
    data: { email?: string; password?: string; name?: string },
  ): Promise<void>;
  abstract deleteAdmin(AdminId: string): Promise<void>;
}
