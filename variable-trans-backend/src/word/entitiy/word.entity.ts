import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('word')
export class Word {
  @PrimaryColumn()
  korean: string;

  @Column({ name: 'variable', type: 'varchar', length: '64' })
  variable: string;

  @Column({ name: 'count', type: 'int', default: 0 })
  count: number;
}
