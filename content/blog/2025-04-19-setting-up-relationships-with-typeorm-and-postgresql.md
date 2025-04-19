---
layout: blog
title: "Setting Up Relationships with TypeORM and PostgreSQL"
date: 2025-04-19T08:47:00
author: Nguyen Nguyen
tags:
  - SQL
  - Database
reading_time: 15
category: Technology
thumbnail: /images/uploads/1745052418849-slq-relationship.jpeg
description: "Demonstrates how to configure one-to-one, one-to-many, and many-to-many relationships using TypeORM with a PostgreSQL database."
---



## Prerequisites

- Node.js installed
- PostgreSQL server running
- Basic knowledge of TypeScript and TypeORM

## One-to-One Relationship

A one-to-one relationship connects one record in a table to exactly one record in another table.

### Basic Example: User and Profile

A user has one profile, and a profile belongs to one user.

1. Create `src/entity/User.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Profile } from "./Profile";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile;
}
```

2. Create `src/entity/Profile.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bio: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
```

### Advanced Example: User and Profile with Index and Constraint

This example enhances the one-to-one relationship by adding an explicit foreign key column with an index and a named foreign key constraint.

1. Modify `src/entity/User.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Index } from "typeorm";
import { Profile } from "./Profile";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Index('idx_user_profile_id')
  @Column({ nullable: true })
  profileId: number;

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
  })
  @JoinColumn({
    name: 'profileId',
    foreignKeyConstraintName: 'fk_user_profile_id',
  })
  profile: Profile;
}
```

2. Keep `src/entity/Profile.ts` as above.

### Explanation of `@JoinColumn` and Enhancements in One-to-One

The `@JoinColumn` decorator is used on the `User` entity to indicate that the `user` table owns the foreign key (`profileId`) referencing the `profile` table. In the advanced example:

- **Indexing with** `@Index('idx_user_profile_id')`: The `@Index` decorator creates an index on the `profileId` column, improving query performance for operations like filtering or joining on `profileId` (e.g., `SELECT * FROM user WHERE profileId = 1`). The named index (`idx_user_profile_id`) is identifiable in database tools for performance tuning.
- **Named Foreign Key Constraint with** `foreignKeyConstraintName`: The `@JoinColumn` specifies `foreignKeyConstraintName: 'fk_user_profile_id'`, naming the foreign key constraint in the database. This makes debugging easier, as constraint violation errors will reference `fk_user_profile_id`.
- **Cascade Option (**`cascade: true`**)**: The `cascade: true` option ensures that saving a `User` entity also saves its related `Profile` entity.

On the `Profile` side, `@JoinColumn` is not needed because the foreign key is managed by the `User` entity.

## One-to-Many Relationship

A one-to-many relationship allows one record in a table to be associated with multiple records in another table.

### Basic Example: User and Posts

A user can have multiple posts, but each post belongs to one user.

1. Modify `src/entity/User.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Post } from "./Post";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
```

2. Create `src/entity/Post.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;
}
```

### Advanced Example: User and Posts with Index and Constraint

This example enhances the many-to-one relationship by adding an explicit foreign key column with an index and a named foreign key constraint.

1. Keep `src/entity/User.ts` as above.

2. Modify `src/entity/Post.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Index('idx_post_user_id')
  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.posts, {
    cascade: true,
  })
  @JoinColumn({
    name: 'userId',
    foreignKeyConstraintName: 'fk_post_user_id',
  })
  user: User;
}
```

### Explanation of `@JoinColumn` and Enhancements in One-to-Many

In a one-to-many relationship, the foreign key is stored on the "many" side (e.g., the `post` table has a `userId` column). TypeORM automatically manages this foreign key, so `@JoinColumn` is not required in the basic example. In the advanced example:

- **Indexing with** `@Index('idx_post_user_id')`: The `@Index` decorator creates an index on the `userId` column, improving query performance for operations like filtering or joining on `userId` (e.g., `SELECT * FROM post WHERE userId = 1`). The named index (`idx_post_user_id`) is identifiable in database tools.
- **Named Foreign Key Constraint with** `foreignKeyConstraintName`: The `@JoinColumn` specifies `foreignKeyConstraintName: 'fk_post_user_id'`, naming the foreign key constraint. This aids debugging by making constraint violation errors reference `fk_post_user_id`.
- **Cascade Option (**`cascade: true`**)**: The `cascade: true` option ensures that saving a `User` entity also saves its related `Post` entities.

On the `User` side, `@JoinColumn` is not used because the `user` table does not store the foreign key; the relationship is managed by the `post` table.

## Many-to-Many Relationship

A many-to-many relationship allows multiple records in one table to be associated with multiple records in another table, using a junction table.

### Basic Example: User and Role

A user can have multiple roles, and a role can be assigned to multiple users.

1. Modify `src/entity/User.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Role } from "./Role";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];
}
```

2. Create `src/entity/Role.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { User } from "./User";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => User)
  users: User[];
}
```

### Advanced Example: User and Role with Explicit Junction Table Entity

This example replaces the automatic junction table with an explicit entity (`UserRole`) to manage the many-to-many relationship, allowing additional attributes and enhanced indexing.

1. Modify `src/entity/User.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserRole } from "./UserRole";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => UserRole, (userRole) => userRole.user, { cascade: true })
  userRoles: UserRole[];
}
```

2. Modify \`src/entityand Role with Explicit Junction Table Entity

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserRole } from "./UserRole";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => UserRole, (userRole) => userRole.role, { cascade: true })
  userRoles: UserRole[];
}
```

3. Create `src/entity/UserRole.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, JoinColumn } from "typeorm";
import { User } from "./User";
import { Role } from "./Role";

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  assignedAt: Date;

  @Index('idx_user_role_user_id')
  @Column()
  userId: number;

  @Index('idx_user_role_role_id')
  @Column()
  roleId: number;

  @ManyToOne(() => User, (user) => user.userRoles, { cascade: true })
  @JoinColumn({
    name: 'userId',
    foreignKeyConstraintName: 'fk_user_role_user_id',
  })
  user: User;

  @ManyToOne(() => Role, (role) => role.userRoles, { cascade: true })
  @JoinColumn({
    name: 'roleId',
    foreignKeyConstraintName: 'fk_user_role_role_id',
  })
  role: Role;
}
```

### Example Usage for Advanced Many-to-Many with Explicit Junction Table Entity

Below is an example of how to use the `UserRole` entity to manage the many-to-many relationship between `User` and `Role`, including creating, saving, and querying relationships with additional attributes.

```typescript
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import { Role } from "./entity/Role";
import { UserRole } from "./entity/UserRole";

async function main() {
  const connection = await createConnection();

  // Create a user
  const user = new User();
  user.name = "Alice";

  // Create roles
  const adminRole = new Role();
  adminRole.name = "Admin";

  const editorRole = new Role();
  editorRole.name = "Editor";

  // Create UserRole entries to link user with roles
  const userRoleAdmin = new UserRole();
  userRoleAdmin.user = user;
  userRoleAdmin.role = adminRole;
  userRoleAdmin.assignedAt = new Date("2025-04-19");

  const userRoleEditor = new UserRole();
  userRoleEditor.user = user;
  userRoleEditor.role = editorRole;
  userRoleEditor.assignedAt = new Date("2025-04-20");

  // Save entities
  const userRepository = connection.getRepository(User);
  const roleRepository = connection.getRepository(Role);
  const userRoleRepository = connection.getRepository(UserRole);

  await userRepository.save(user);
  await roleRepository.save([adminRole, editorRole]);
  await userRoleRepository.save([userRoleAdmin, userRoleEditor]);

  // Query user with roles and assignment dates
  const loadedUser = await userRepository.findOne({
    where: { id: user.id },
    relations: ["userRoles", "userRoles.role"],
  });
  console.log("User with roles:", loadedUser);
  loadedUser.userRoles.forEach((userRole) => {
    console.log(
      `${loadedUser.name} has role ${
        userRole.role.name
      }, assigned at ${userRole.assignedAt.toISOString()}`
    );
  });

  // Query roles assigned to a user after a specific date
  const recentUserRoles = await userRoleRepository.find({
    where: {
      user: { id: user.id },
      assignedAt: MoreThan(new Date("2025-04-19T12:00:00Z")),
    },
    relations: ["role"],
  });
  console.log("Recently assigned roles:", recentUserRoles);

  await connection.close();
}
```

### Explanation of `@JoinColumn` and Enhancements in Many-to-Many

In the basic many-to-many example, TypeORM creates an automatic junction table (e.g., `user_roles`) managed by `@JoinTable`. In the advanced example, we define an explicit `UserRole` entity to represent the junction table, allowing additional attributes (e.g., `assignedAt`) and fine-grained control:

- **Explicit Junction Table with** `UserRole`: The `UserRole` entity replaces the automatic junction table. It has its own primary key (`id`) and additional fields like `assignedAt` to store metadata about the relationship (e.g., when a role was assigned to a user). The `User` and `Role` entities now have one-to-many relationships with `UserRole`, which in turn has many-to-one relationships with `User` and `Role`.
- **Indexing with** `@Index`: Indexes are created on `userId` (`idx_user_role_user_id`) and `roleId` (`idx_user_role_role_id`) columns to improve query performance for operations like filtering or joining on these columns (e.g., `SELECT * FROM user_role WHERE userId = 1`). The named indexes are identifiable in database tools for performance tuning.
- **Named Foreign Key Constraints with** `foreignKeyConstraintName`: The `@JoinColumn` decorators specify `foreignKeyConstraintName` (`fk_user_role_user_id` and `fk_user_role_role_id`), naming the foreign key constraints. This aids debugging by making constraint violation errors reference these names.
- **Cascade Option (**`cascade: true`**)**: The `cascade: true` option ensures that operations on `User` or `Role` entities (e.g., saving) cascade to related `UserRole` entities.

### Explanation of Usage Example

- **Creating and Saving**: The example creates a `User` ("Alice") and two `Role` entities ("Admin" and "Editor"). It then creates `UserRole` entities to link the user to each role, setting the `assignedAt` date to track when each role was assigned. The entities are saved using their respective repositories.
- **Querying with Relations**: The `findOne` query loads the user along with their `userRoles` and the related `role` entities, demonstrating how to access the roles and their assignment dates. The output logs each role and its assignment date.
- **Advanced Querying**: The example includes a query to find `UserRole` entries for a specific user where roles were assigned after a certain date, showcasing the benefit of the `assignedAt` attribute. This query uses the `MoreThan` operator from TypeORM to filter by date.
- **Performance and Debugging**: The indexes on `userId` and `roleId` improve the performance of these queries, especially when filtering or joining. The named foreign key constraints (`fk_user_role_user_id` and `fk_user_role_role_id`) ensure that any constraint violations (e.g., attempting to delete a `User` with existing `UserRole` entries) produce clear error messages.

This approach provides more flexibility than the automatic junction table, as it allows additional attributes and direct querying of the junction table (e.g., `SELECT * FROM user_role WHERE assignedAt > '2025-01-01'`).

## Conclusion

This guide provides a foundation for implementing relationships in TypeORM with PostgreSQL, with a focus on basic and advanced configurations using `@JoinColumn`, indexing, named constraints, and explicit junction table entities for performance and debugging.