import { User as IUser } from "runnie-common"
import { Entity, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from "./base.entity";
import { UserStatus } from "runnie-common/dist/src/models/user";

@Entity({ tableName: "users" })
export class User extends BaseEntity implements IUser {
    @Property()
    @Unique()
    email!: string;

    @Property()
    name!: string;

    @Property({ nullable: true })
    photo?: string;

    @Property({ default: "user" })
    role!: string;

    @Property({ nullable: true })
    passwordHash?: string;

    @Property({ nullable: true })
    refreshToken?: string;

    @Property({ nullable: true })
    confirmEmailToken?: string;

    @Property({ nullable: true })
    confirmEmailTokenDate?: Date;

    @Property({ nullable: true })
    resetPasswordToken?: string;

    @Property({ nullable: true })
    resetPasswordTokenDate?: Date;

    @Property({ default: UserStatus.Pending })
    status!: UserStatus;

    @Property({ default: false })
    isOAuthUser!: boolean;
}
