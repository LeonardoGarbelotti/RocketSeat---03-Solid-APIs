import { CheckIn, Prisma } from "@prisma/client";

export interface CheckInsRepository {
  // CheckInUncheckedCreateInput é utilizado quando queremos criar um registro
  // em cima de 2 registros já existentes (neste caso um USERID e GYMID)
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  save(checkIn: CheckIn): Promise<CheckIn>;
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>;
  countByUserId(userId: string): Promise<number>;
  findById(userId: string): Promise<CheckIn | null>;
}
