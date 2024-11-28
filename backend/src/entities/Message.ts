import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  to: string;

  @Column({ type: 'varchar', length: 255 })
  from: string;

  @Column({type: 'text'})
  content: string;

  @Column({ type: 'varchar', length: 255 })
  type: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  constructor(from: string, to: string, content: string, type: string) {
    this.from = from;
    this.to = to;
    this.content = content;
    this.type = type
    this.created_at = new Date();
  }
}
