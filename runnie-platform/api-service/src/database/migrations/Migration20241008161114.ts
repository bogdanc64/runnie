import { Migration } from '@mikro-orm/migrations';

export class Migration20241008161114 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`users\` (\`id\` int unsigned not null auto_increment primary key, \`created\` datetime not null default CURRENT_TIMESTAMP, \`modified\` datetime not null, \`deleted\` tinyint(1) not null default false, \`email\` varchar(255) not null, \`name\` varchar(255) not null, \`photo\` varchar(255) null, \`role\` varchar(255) not null default 'user') default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`users\` add unique \`users_email_unique\`(\`email\`);`);
  }

}
