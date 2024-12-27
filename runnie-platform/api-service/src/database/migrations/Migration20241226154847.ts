import { Migration } from '@mikro-orm/migrations';

export class Migration20241226154847 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`steps\` (\`id\` int unsigned not null auto_increment primary key, \`created\` datetime not null default CURRENT_TIMESTAMP, \`modified\` datetime null, \`deleted\` tinyint(1) not null default false, \`action\` varchar(255) not null, \`photo\` varchar(255) not null, \`identifier\` varchar(255) not null, \`description\` varchar(255) not null, \`test_id\` int unsigned not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`steps\` add index \`steps_test_id_index\`(\`test_id\`);`);

    this.addSql(`create table \`test-runs\` (\`id\` int unsigned not null auto_increment primary key, \`created\` datetime not null default CURRENT_TIMESTAMP, \`modified\` datetime null, \`deleted\` tinyint(1) not null default false, \`test_id\` int unsigned not null, \`start_time\` datetime not null, \`end_time\` datetime not null, \`status\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`test-runs\` add index \`test-runs_test_id_index\`(\`test_id\`);`);

    this.addSql(`alter table \`steps\` add constraint \`steps_test_id_foreign\` foreign key (\`test_id\`) references \`tests\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`test-runs\` add constraint \`test-runs_test_id_foreign\` foreign key (\`test_id\`) references \`tests\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`tests\` drop column \`steps\`, drop column \`test_runs\`;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists \`steps\`;`);

    this.addSql(`drop table if exists \`test-runs\`;`);

    this.addSql(`alter table \`tests\` add \`steps\` text not null, add \`test_runs\` text not null;`);
  }

}
