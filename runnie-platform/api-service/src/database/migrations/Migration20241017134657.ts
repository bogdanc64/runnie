import { Migration } from '@mikro-orm/migrations';

export class Migration20241017134657 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`permissions\` (\`id\` int unsigned not null auto_increment primary key, \`created\` datetime not null default CURRENT_TIMESTAMP, \`modified\` datetime null, \`deleted\` tinyint(1) not null default false, \`resource\` varchar(255) not null, \`action\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`roles\` (\`id\` int unsigned not null auto_increment primary key, \`created\` datetime not null default CURRENT_TIMESTAMP, \`modified\` datetime null, \`deleted\` tinyint(1) not null default false, \`name\` varchar(255) not null, \`description\` varchar(255) null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`roles\` add unique \`roles_name_unique\`(\`name\`);`);

    this.addSql(`create table \`roles_permissions\` (\`role_id\` int unsigned not null, \`permission_id\` int unsigned not null, primary key (\`role_id\`, \`permission_id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`roles_permissions\` add index \`roles_permissions_role_id_index\`(\`role_id\`);`);
    this.addSql(`alter table \`roles_permissions\` add index \`roles_permissions_permission_id_index\`(\`permission_id\`);`);

    this.addSql(`alter table \`roles_permissions\` add constraint \`roles_permissions_role_id_foreign\` foreign key (\`role_id\`) references \`roles\` (\`id\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`roles_permissions\` add constraint \`roles_permissions_permission_id_foreign\` foreign key (\`permission_id\`) references \`permissions\` (\`id\`) on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`roles_permissions\` drop foreign key \`roles_permissions_permission_id_foreign\`;`);

    this.addSql(`alter table \`roles_permissions\` drop foreign key \`roles_permissions_role_id_foreign\`;`);

    this.addSql(`drop table if exists \`permissions\`;`);

    this.addSql(`drop table if exists \`roles\`;`);

    this.addSql(`drop table if exists \`roles_permissions\`;`);
  }

}
