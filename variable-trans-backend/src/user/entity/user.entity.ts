import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  Id: string;

  @Column({ name: 'user_email', type: 'varchar', length: '30' })
  userEmail: string;

  @Column({ name: 'password', type: 'varchar', length: '64' })
  passowrd: string;

  @Column({ name: 'request_limit', type: 'int', default: 0 })
  requestLimit: number;

  @Column({ name: 'premium', type: 'varchar', length: '10', default: 'normal' })
  premium: string;
}
