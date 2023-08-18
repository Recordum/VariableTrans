import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  Id: string;

  @Column({ name: 'user_email', type: 'varchar', length: '30' })
  userEmail: string;

  @Column({ name: 'password', type: 'varchar', length: '64' })
  password: string;

  @Column({ name: 'request_limit', type: 'int', default: 0 })
  requestLimit: number;

  @Column({ name: 'grade', type: 'varchar', length: '10', default: 'normal' })
  grade: string;

  constructor(userEmail: string, password: string) {
    this.userEmail = userEmail;
    this.password = password;
    this.Id = uuidv4();
    this.requestLimit = 0;
    this.grade = 'normal';
  }
  public validatePasword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  public async encodePassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  public getId(): string {
    return this.Id;
  }

  public getGrade(): string {
    return this.grade;
  }

  public getRequestLimit(): number {
    return this.requestLimit;
  }
}
