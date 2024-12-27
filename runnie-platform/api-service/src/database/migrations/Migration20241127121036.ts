import { Migration } from '@mikro-orm/migrations';

export class Migration20241127121036 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`organizations\` (\`id\` int unsigned not null auto_increment primary key, \`created\` datetime not null default CURRENT_TIMESTAMP, \`modified\` datetime null, \`deleted\` tinyint(1) not null default false, \`name\` varchar(255) not null, \`description\` varchar(255) null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`assets\` (\`id\` int unsigned not null auto_increment primary key, \`created\` datetime not null default CURRENT_TIMESTAMP, \`modified\` datetime null, \`name\` varchar(255) not null, \`website\` varchar(255) not null, \`deleted\` tinyint(1) not null default false, \`organization_id\` int unsigned not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`assets\` add index \`assets_organization_id_index\`(\`organization_id\`);`);

    this.addSql(`create table \`tests\` (\`id\` int unsigned not null auto_increment primary key, \`created\` datetime not null default CURRENT_TIMESTAMP, \`modified\` datetime null, \`deleted\` tinyint(1) not null default false, \`url\` varchar(255) not null, \`steps\` text not null, \`test_runs\` text not null, \`asset_id\` int unsigned not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`tests\` add index \`tests_asset_id_index\`(\`asset_id\`);`);

    this.addSql(`alter table \`assets\` add constraint \`assets_organization_id_foreign\` foreign key (\`organization_id\`) references \`organizations\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`tests\` add constraint \`tests_asset_id_foreign\` foreign key (\`asset_id\`) references \`assets\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`users\` add constraint \`users_organization_id_foreign\` foreign key (\`organization_id\`) references \`organizations\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`users\` add index \`users_organization_id_index\`(\`organization_id\`);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`assets\` drop foreign key \`assets_organization_id_foreign\`;`);

    this.addSql(`alter table \`users\` drop foreign key \`users_organization_id_foreign\`;`);

    this.addSql(`alter table \`tests\` drop foreign key \`tests_asset_id_foreign\`;`);

    this.addSql(`drop table if exists \`organizations\`;`);

    this.addSql(`drop table if exists \`assets\`;`);

    this.addSql(`drop table if exists \`tests\`;`);

    this.addSql(`alter table \`users\` drop index \`users_organization_id_index\`;`);
  }

}
